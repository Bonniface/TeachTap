
import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useSpeechToText } from '../../hooks/useSpeechToText';

interface TimeBackModalProps {
    onClose: () => void;
}

const TimeBackModal: React.FC<TimeBackModalProps> = ({ onClose }) => {
    const [analyzing, setAnalyzing] = useState(false);
    const [summary, setSummary] = useState<string | null>(null);
    const [query, setQuery] = useState('');

    const { isListening, startListening } = useSpeechToText((text) => {
        setQuery(prev => (prev ? `${prev} ${text}` : text));
    });

    const handleAnalyze = () => {
        setAnalyzing(true);
        // Simulate Gemini Processing
        setTimeout(() => {
            setSummary("Based on your last 20 minutes, you've mastered the core concepts of Special Relativity and React Hooks. You saved approx. 1.5 hours compared to standard university lectures.");
            setAnalyzing(false);
        }, 2000);
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-lg h-[85vh] flex flex-col overflow-hidden bg-[#0F0F13] border-white/10" padding="none">
                {/* Header */}
                <div className="p-5 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-primary/10 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(140,37,244,0.3)]">
                            <span className="material-symbols-outlined text-primary text-xl">history_toggle_off</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold font-display text-white">TimeBack Copilot</h2>
                            <p className="text-xs text-primary-300 font-mono tracking-wide">EFFICIENCY ENGINE</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 scrollbar-hide space-y-6">
                    
                    {/* Hero Metric: Time Reclaimed */}
                    <div className="relative overflow-hidden rounded-2xl bg-[#16121E] border border-white/5 p-6 text-center group">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-50"></div>
                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-all duration-1000"></div>
                        
                        <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-2 relative z-10">Total Time Reclaimed</h3>
                        <div className="flex items-baseline justify-center gap-2 relative z-10">
                            <span className="text-6xl font-bold text-white font-display drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">4.2</span>
                            <span className="text-xl text-white/60 font-medium">Hours</span>
                        </div>
                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-green-400 bg-green-400/10 py-1.5 px-3 rounded-full mx-auto w-fit border border-green-400/20">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            <span>3x faster than traditional study</span>
                        </div>
                    </div>

                    {/* Velocity Graph */}
                    <div className="rounded-2xl bg-[#16121E] border border-white/5 p-5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-white">Knowledge Velocity</h3>
                            <select className="bg-black/30 text-xs text-white/60 border border-white/10 rounded-lg px-2 py-1 outline-none">
                                <option>This Week</option>
                            </select>
                        </div>
                        <div className="flex items-end justify-between h-32 gap-2">
                            {[40, 65, 30, 85, 50, 90, 60].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="w-full bg-white/5 rounded-t-sm relative h-full overflow-hidden">
                                        <div 
                                            className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-primary to-primary-400 transition-all duration-500 group-hover:brightness-125"
                                            style={{ height: `${h}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-[10px] text-white/30 font-mono">
                                        {['M','T','W','T','F','S','S'][i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Synthesis Section */}
                    <div className="rounded-2xl bg-gradient-to-br from-[#16121E] to-[#1F1929] border border-white/5 p-1 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="material-symbols-outlined text-6xl">auto_awesome</span>
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-white mb-1">Smart Synthesis</h3>
                            <p className="text-xs text-white/50 mb-4">AI-generated summary of your recent sessions</p>
                            
                            {summary ? (
                                <div className="bg-black/20 rounded-xl p-4 border border-white/5 animate-in fade-in slide-in-from-bottom-2">
                                    <p className="text-sm text-white/90 leading-relaxed font-body">{summary}</p>
                                    <div className="mt-3 flex gap-2">
                                        <button className="text-xs bg-white/5 hover:bg-white/10 text-white/70 px-3 py-1.5 rounded-lg transition-colors border border-white/5">
                                            Generate Quiz
                                        </button>
                                        <button className="text-xs bg-white/5 hover:bg-white/10 text-white/70 px-3 py-1.5 rounded-lg transition-colors border border-white/5">
                                            Export Notes
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    {analyzing ? (
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                            <p className="text-xs text-primary animate-pulse">Analyzing learning patterns...</p>
                                        </div>
                                    ) : (
                                        <Button onClick={handleAnalyze} fullWidth variant="outline" className="border-dashed border-white/20 hover:border-primary/50 text-white/60 hover:text-white">
                                            <span className="material-symbols-outlined mr-2">analytics</span>
                                            Analyze My Progress
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Efficiency Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-[#16121E] border border-white/5">
                            <div className="size-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
                                <span className="material-symbols-outlined text-lg">timer_off</span>
                            </div>
                            <div className="text-2xl font-bold text-white">45m</div>
                            <div className="text-[10px] text-white/40">Saved today</div>
                        </div>
                        <div className="p-4 rounded-xl bg-[#16121E] border border-white/5">
                            <div className="size-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 mb-3">
                                <span className="material-symbols-outlined text-lg">bolt</span>
                            </div>
                            <div className="text-2xl font-bold text-white">High</div>
                            <div className="text-[10px] text-white/40">Focus Score</div>
                        </div>
                    </div>

                </div>

                {/* Footer Chat Input */}
                <div className="p-4 border-t border-white/10 bg-[#16121E]">
                    <div className="relative">
                        <input 
                            type="text" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask TimeBack about your learning..." 
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 placeholder:text-white/20"
                        />
                        <button 
                            onClick={startListening}
                            className={`absolute right-12 top-1/2 -translate-y-1/2 p-1.5 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-white/40 hover:text-white'}`}
                        >
                            <span className="material-symbols-outlined text-xl">mic</span>
                        </button>
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary/20 hover:bg-primary rounded-lg text-primary hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-lg">arrow_upward</span>
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default TimeBackModal;
