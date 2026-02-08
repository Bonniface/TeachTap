
import { useState, useCallback } from 'react';

export const useSpeechToText = (onTranscript: (text: string) => void) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error('Recognition start failed', e);
      setIsListening(false);
    }
  }, [onTranscript]);

  return { isListening, startListening };
};
