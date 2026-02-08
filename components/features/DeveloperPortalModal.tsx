
import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { publicApiService } from '../../services/publicApiService';
import { useSpeechToText } from '../../hooks/useSpeechToText';

interface DeveloperPortalModalProps {
    onClose: () => void;
}

type EndpointType = 'SEARCH' | 'PROGRESS' | 'SUBMIT_QUIZ' | 'CREATE_PLAYLIST';

const DeveloperPortalModal: React.FC<DeveloperPortalModalProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'docs' | 'playground'>('dashboard');
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isLoadingKey, setIsLoadingKey] = useState(false);
    
    // Playground State
    const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointType>('SEARCH');
    const [requestBody, setRequestBody] = useState('');
    const [apiResponse, setApiResponse] = useState<any>(null);
    const [isRequesting, setIsRequesting] = useState(false);

    const { isListening, startListening } = useSpeechToText((text) => setRequestBody(prev => (prev ? `${prev} ${text}` : text)));

    const generateKey = () => {
        setIsLoadingKey(true);
        setTimeout(() => {
            setApiKey('sk_live_' + Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2));
            setIsLoadingKey(false);
        }, 1000);
    };

    const handleTestRequest = async () => {
        setIsRequesting(true);
        setApiResponse(null);
        try {
            let res;
            switch (selectedEndpoint) {
                case 'SEARCH':
                    res = await publicApiService.searchVideos(requestBody || '');
                    break;
                case 'PROGRESS':
                    res = await publicApiService.getUserProgress('user_123');
                    break;
                case 'SUBMIT_QUIZ':
                    try {
                        const parsed = JSON.parse(requestBody || '{"videoId": "1", "answerIndex": 1}');
                        res = await publicApiService.submitQuizAnswer(parsed);
                    } catch (e) {
                        res = { error: "Invalid JSON body" };
                    }
                    break;
                case 'CREATE_PLAYLIST':
                    try {
                        const parsed = JSON.parse(requestBody || '{"name": "My Study List", "topics": ["Physics"]}');
                        res = await publicApiService.createSmartPlaylist(parsed);
                    } catch (e) {
                        res = { error: "Invalid JSON body" };
                    }
                    break;
            }
            setApiResponse(res);
        } catch (error) {
            setApiResponse({ error: "Request failed" });
        } finally {
            setIsRequesting(false);
        }
    };

    const endpoints = [
        { id: 'SEARCH', method: 'GET', path: '/v1/videos/search', desc: 'Search for educational content' },
        { id: 'PROGRESS', method: 'GET', path: '/v1/user/progress', desc: 'Retrieve user XP, level, and streaks' },
        { id: 'SUBMIT_QUIZ', method: 'POST', path: '/v1/quiz/submit', desc: 'Submit an answer to a video quiz' },
        { id: 'CREATE_PLAYLIST', method: 'POST', path: '/v1/playlists', desc: 'Generate an AI-curated playlist' },
    ];

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden bg-[#0d1117] border-white/10" padding="none">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#161b22]">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/5 p-2 rounded-lg border border-white/10">
                            <span className="material-symbols-outlined text-primary">terminal</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold font-display text-white">TeachTap Developer</h2>
                            <p className="text-xs text-white/40 font-mono">Build the future of education</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 bg-[#0d1117]">
                    {(['dashboard', 'docs', 'playground'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                                activeTab === tab 
                                    ? 'border-primary text-primary' 
                                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === 'dashboard' && (
                        <div className="space-y-8">
                            {/* API Key Section */}
                            <div className="p-6 rounded-xl bg-[#161b22] border border-white/10">
                                <h3 className="text-lg font-bold text-white mb-2">API Keys</h3>
                                <p className="text-sm text-white/60 mb-6">Use this key to authenticate your requests. Keep it secret.</p>
                                
                                {apiKey ? (
                                    <div className="space-y-4">
                                        <div className="flex gap-2">
                                            <code className="flex-1 p-3 bg-black/50 rounded-lg border border-white/10 font-mono text-green-400 text-sm overflow-hidden text-ellipsis">
                                                {apiKey}
                                            </code>
                                            <Button variant="secondary" onClick={() => navigator.clipboard.writeText(apiKey)}>
                                                <span className="material-symbols-outlined text-sm">content_copy</span>
                                            </Button>
                                            <Button variant="danger" onClick={() => setApiKey(null)}>Revoke</Button>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-white/40">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            Active • Created just now
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 border-2 border-dashed border-white/10 rounded-lg">
                                        <div className="mb-4">
                                            <span className="material-symbols-outlined text-4xl text-white/20">key</span>
                                        </div>
                                        <Button onClick={generateKey} loading={isLoadingKey}>
                                            Generate New API Key
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Usage Stats (Mock) */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 rounded-xl bg-[#161b22] border border-white/10">
                                    <div className="text-sm text-white/60 mb-1">Requests (24h)</div>
                                    <div className="text-2xl font-bold text-white">0</div>
                                </div>
                                <div className="p-4 rounded-xl bg-[#161b22] border border-white/10">
                                    <div className="text-sm text-white/60 mb-1">Error Rate</div>
                                    <div className="text-2xl font-bold text-green-400">0%</div>
                                </div>
                                <div className="p-4 rounded-xl bg-[#161b22] border border-white/10">
                                    <div className="text-sm text-white/60 mb-1">Latency</div>
                                    <div className="text-2xl font-bold text-white">-- ms</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'docs' && (
                        <div className="space-y-4">
                            {endpoints.map(ep => (
                                <div key={ep.id} className="p-4 rounded-xl bg-[#161b22] border border-white/10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                            ep.method === 'GET' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                                        }`}>
                                            {ep.method}
                                        </span>
                                        <code className="text-sm font-mono text-white/90">{ep.path}</code>
                                    </div>
                                    <p className="text-sm text-white/60">{ep.desc}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'playground' && (
                        <div className="h-full flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                                {/* Request Config */}
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2 block">Endpoint</label>
                                        <select 
                                            className="w-full bg-[#161b22] border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                            value={selectedEndpoint}
                                            onChange={(e) => {
                                                setSelectedEndpoint(e.target.value as EndpointType);
                                                setRequestBody('');
                                                setApiResponse(null);
                                            }}
                                        >
                                            {endpoints.map(ep => (
                                                <option key={ep.id} value={ep.id}>{ep.method} {ep.path}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {(selectedEndpoint === 'SUBMIT_QUIZ' || selectedEndpoint === 'CREATE_PLAYLIST') && (
                                        <div className="flex-1 flex flex-col">
                                            <label className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2 block">Request Body (JSON)</label>
                                            <div className="relative flex-1">
                                                <textarea 
                                                    className="w-full h-full bg-[#161b22] border border-white/20 rounded-lg p-3 pr-10 font-mono text-xs text-white/90 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                                                    value={requestBody}
                                                    onChange={(e) => setRequestBody(e.target.value)}
                                                    placeholder={
                                                        selectedEndpoint === 'SUBMIT_QUIZ' 
                                                        ? '{\n  "videoId": "1",\n  "answerIndex": 1\n}' 
                                                        : '{\n  "name": "My List",\n  "topics": ["Physics"]\n}'
                                                    }
                                                />
                                                <button 
                                                    onClick={startListening}
                                                    className={`absolute right-3 top-3 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-white/40 hover:text-white'}`}
                                                >
                                                    <span className="material-symbols-outlined text-lg">mic</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {selectedEndpoint === 'SEARCH' && (
                                        <div>
                                            <label className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2 block">Query Parameter</label>
                                            <div className="relative">
                                                <input 
                                                    type="text" 
                                                    className="w-full bg-[#161b22] border border-white/20 rounded-lg px-3 py-2 pr-10 text-sm text-white outline-none"
                                                    placeholder="e.g. Physics"
                                                    value={requestBody}
                                                    onChange={(e) => setRequestBody(e.target.value)}
                                                />
                                                <button 
                                                    onClick={startListening}
                                                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-white/40 hover:text-white'}`}
                                                >
                                                    <span className="material-symbols-outlined text-lg">mic</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <Button onClick={handleTestRequest} loading={isRequesting} fullWidth>
                                        Send Request
                                    </Button>
                                </div>

                                {/* Response Viewer */}
                                <div className="flex flex-col h-full bg-[#161b22] rounded-xl border border-white/10 overflow-hidden">
                                    <div className="px-4 py-2 border-b border-white/10 bg-black/20 flex justify-between items-center">
                                        <span className="text-xs font-bold text-white/60 uppercase">Response</span>
                                        {apiResponse && (
                                            <span className={`text-xs px-2 py-0.5 rounded ${apiResponse.error ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                                {apiResponse.error ? 'ERROR' : '200 OK'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 p-4 overflow-auto">
                                        {apiResponse ? (
                                            <pre className="font-mono text-xs text-green-400 whitespace-pre-wrap">
                                                {JSON.stringify(apiResponse, null, 2)}
                                            </pre>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-white/20 text-sm italic">
                                                Hit send to see response...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default DeveloperPortalModal;
