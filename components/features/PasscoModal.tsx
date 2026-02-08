
import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useSpeechToText } from '../../hooks/useSpeechToText';

interface PasscoModalProps {
    onClose: () => void;
}

const CATEGORIES = ['Physics', 'Maths', 'English', 'Biology', 'Chemistry', 'History'];
const RECENT_PAPERS = [
    { id: 1, title: 'WASSCE 2023 - Physics', type: 'Core', questions: 50, year: 2023 },
    { id: 2, title: 'JAMB 2022 - Mathematics', type: 'Elective', questions: 40, year: 2022 },
    { id: 3, title: 'NECO 2021 - Biology', type: 'Core', questions: 60, year: 2021 },
    { id: 4, title: 'SAT Practice Test 3', type: 'International', questions: 52, year: 2024 },
];

const PasscoModal: React.FC<PasscoModalProps> = ({ onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCat, setActiveCat] = useState('Physics');

    const { isListening, startListening } = useSpeechToText((text) => {
        setSearchQuery(prev => (prev ? `${prev} ${text}` : text));
    });

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-lg h-[85vh] flex flex-col overflow-hidden bg-[#0A0A0E] border-white/10" padding="none">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#111116]">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                            <span className="material-symbols-outlined text-blue-400 text-2xl">menu_book</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold font-display text-white">Passco</h2>
                            <p className="text-[10px] text-blue-300 font-mono tracking-widest uppercase">Past Questions Library</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors bg-white/5 p-2 rounded-full">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-8">
                    
                    {/* Search Bar with Dictation */}
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 material-symbols-outlined">search</span>
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Find specific exams or years..." 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-14 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-white/20"
                        />
                        <button 
                            onClick={startListening}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-white/30 hover:text-white'}`}
                        >
                            <span className="material-symbols-outlined text-2xl">mic</span>
                        </button>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                        {CATEGORIES.map(cat => (
                            <button 
                                key={cat}
                                onClick={() => setActiveCat(cat)}
                                className={`px-5 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                                    activeCat === cat 
                                    ? 'bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/20' 
                                    : 'bg-white/5 border-white/5 text-white/40 hover:text-white'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Featured Exam Prep Section */}
                    <div className="relative rounded-3xl overflow-hidden group">
                        <img 
                            src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop" 
                            className="w-full h-48 object-cover opacity-30 group-hover:scale-105 transition-transform duration-700"
                            alt="Exam Study"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-6 flex flex-col justify-end">
                            <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-md mb-2 inline-block w-fit">AI TUTOR MODE</span>
                            <h3 className="text-xl font-bold text-white mb-2">Simulate Live Exam</h3>
                            <p className="text-xs text-white/60 mb-4 line-clamp-2">Get real-time explanations from Gemini while practicing under pressure.</p>
                            <Button className="w-fit bg-white text-black hover:bg-gray-100 font-bold px-6 py-2 h-auto text-sm">
                                Start Simulation
                            </Button>
                        </div>
                    </div>

                    {/* Papers List */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Recent for {activeCat}</h4>
                        <div className="grid grid-cols-1 gap-3">
                            {RECENT_PAPERS.map(paper => (
                                <div key={paper.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-colors cursor-pointer group">
                                    <div className="size-12 rounded-xl bg-black/40 flex items-center justify-center text-blue-400 border border-white/5 group-hover:border-blue-500/30 transition-colors">
                                        <span className="text-lg font-bold">{paper.year}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-sm font-bold text-white">{paper.title}</div>
                                        <div className="text-[10px] text-white/40 uppercase tracking-tight">{paper.type} • {paper.questions} Questions</div>
                                    </div>
                                    <button className="size-10 rounded-full flex items-center justify-center text-white/20 group-hover:text-blue-400 transition-colors">
                                        <span className="material-symbols-outlined">play_circle</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Footer Footer */}
                <div className="p-6 border-t border-white/5 bg-[#0A0A0E]">
                    <Button fullWidth variant="outline" className="border-dashed border-white/20 text-white/60 hover:text-white">
                        <span className="material-symbols-outlined mr-2">upload_file</span>
                        Upload My Own Paper
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default PasscoModal;
