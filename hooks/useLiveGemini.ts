import { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { createBlob, decodeAudioData, decode } from '../utils/audioUtils';

// Helper to prevent memory leaks with transcription history
const MAX_TRANSCRIPTS = 50;

export const useLiveGemini = (systemInstruction: string) => {
    const [connected, setConnected] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false); // Model is speaking
    const [transcripts, setTranscripts] = useState<Array<{role: 'user' | 'model', text: string}>>([]);
    const [error, setError] = useState<string | null>(null);

    // Refs for cleanup
    const audioContextsRef = useRef<{input?: AudioContext, output?: AudioContext}>({});
    const sessionRef = useRef<any>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    
    // Transcription buffering
    const currentInputRef = useRef('');
    const currentOutputRef = useRef('');

    const disconnect = useCallback(async () => {
        if (sessionRef.current) {
            // sessionRef.current.close() is not always available depending on SDK version or if connection failed, 
            // but for @google/genai we assume we can just drop the reference or call close if it exists.
            // The SDK documentation says `session.close()`.
            try {
                await sessionRef.current.close();
            } catch (e) {
                console.warn("Error closing session", e);
            }
            sessionRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        if (audioContextsRef.current.input) {
            audioContextsRef.current.input.close();
        }
        if (audioContextsRef.current.output) {
            audioContextsRef.current.output.close();
        }
        audioContextsRef.current = {};

        // Stop all playing sources
        sourcesRef.current.forEach(source => {
            try { source.stop(); } catch (e) {}
        });
        sourcesRef.current.clear();

        setConnected(false);
        setIsSpeaking(false);
    }, []);

    const connect = useCallback(async () => {
        try {
            setError(null);
            
            // 1. Setup Audio Contexts
            const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 16000});
            const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
            audioContextsRef.current = { input: inputAudioContext, output: outputAudioContext };

            const outputNode = outputAudioContext.createGain();
            outputNode.connect(outputAudioContext.destination);

            // 2. Get Microphone Stream
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // 3. Initialize Client
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
            
            // 4. Connect
            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-12-2025',
                callbacks: {
                    onopen: () => {
                        setConnected(true);
                        
                        // Setup Input Processing
                        const source = inputAudioContext.createMediaStreamSource(stream);
                        // Using ScriptProcessor as per documentation example for simplicity in this environment
                        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
                        
                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            sessionPromise.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContext.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        // Handle Transcriptions
                        if (message.serverContent?.outputTranscription) {
                            currentOutputRef.current += message.serverContent.outputTranscription.text;
                        } else if (message.serverContent?.inputTranscription) {
                            currentInputRef.current += message.serverContent.inputTranscription.text;
                        }

                        if (message.serverContent?.turnComplete) {
                            const userText = currentInputRef.current;
                            const modelText = currentOutputRef.current;
                            
                            if (userText || modelText) {
                                setTranscripts(prev => {
                                    const newTranscripts = [...prev];
                                    if (userText) newTranscripts.push({ role: 'user', text: userText });
                                    if (modelText) newTranscripts.push({ role: 'model', text: modelText });
                                    return newTranscripts.slice(-MAX_TRANSCRIPTS);
                                });
                            }
                            
                            currentInputRef.current = '';
                            currentOutputRef.current = '';
                            setIsSpeaking(false);
                        }

                        // Handle Audio Output
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio) {
                            setIsSpeaking(true);
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContext.currentTime);
                            
                            const audioBuffer = await decodeAudioData(
                                decode(base64Audio),
                                outputAudioContext,
                                24000,
                                1
                            );
                            
                            const source = outputAudioContext.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputNode);
                            source.addEventListener('ended', () => {
                                sourcesRef.current.delete(source);
                                // If no more sources, potentially stop speaking visual? 
                                // But simpler to rely on turnComplete for logic end.
                            });
                            
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            sourcesRef.current.add(source);
                        }

                        // Handle Interruption
                        if (message.serverContent?.interrupted) {
                            sourcesRef.current.forEach(s => {
                                try { s.stop(); } catch(e) {}
                            });
                            sourcesRef.current.clear();
                            nextStartTimeRef.current = 0;
                            setIsSpeaking(false);
                        }
                    },
                    onclose: () => {
                        setConnected(false);
                        setIsSpeaking(false);
                    },
                    onerror: (e) => {
                        console.error("Session error", e);
                        setError("Connection error");
                        disconnect();
                    }
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
                    },
                    systemInstruction: systemInstruction,
                    inputAudioTranscription: {},
                    outputAudioTranscription: {}
                }
            });
            
            sessionRef.current = await sessionPromise;

        } catch (err) {
            console.error(err);
            setError("Failed to connect to Live API");
            disconnect();
        }
    }, [systemInstruction, disconnect]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return {
        connect,
        disconnect,
        connected,
        isSpeaking,
        transcripts,
        error
    };
};