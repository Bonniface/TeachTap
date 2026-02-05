import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { LearningPath, LoadingState, PathStep } from '../../types';
import { generateLearningPath } from '../../services/geminiService';

interface LearningPathsModalProps {
    paths: LearningPath[];
    onClose: () => void;
    onAddPath: (path: LearningPath) => void;
    onSelectStep: (pathId: string, step: PathStep) => void;
}

const LearningPathsModal: React.FC<LearningPathsModalProps> = ({ paths, onClose, onAddPath, onSelectStep }) => {
    const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
    const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
    const [topicInput, setTopicInput] = useState('');
    const [loading, setLoading] = useState(LoadingState.IDLE);

    // Create / Generate Path
    const handleCreateSubmit = async () => {
        if (!topicInput.trim()) return;
        setLoading(LoadingState.LOADING);
        try {
            const pathData = await generateLearningPath(topicInput);
            const newPath: LearningPath = {
                id: Date.now().toString(),
                ...pathData,
                totalSteps: pathData.steps.length,
                completedSteps: 0,
                // Random gradient for cover
                coverImage: `linear-gradient(${Math.random() * 360}deg, #8c25f4, #4c1d95)`
            };
            onAddPath(newPath);
            setTopicInput('');
            setLoading(LoadingState.SUCCESS);
            setSelectedPath(newPath);
            setView('detail');
        } catch (e) {
            console.error(e);
            setLoading(LoadingState.ERROR);
        }
    };

    const handlePathClick = (path: LearningPath) => {
        setSelectedPath(path);
        setView('detail');
    };

    const handleStepClick = (step: PathStep) => {
        if (step.isLocked || !selectedPath) return;
        onSelectStep(selectedPath.id, step);
        onClose();
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-md h-[85vh] flex flex-col overflow-hidden" padding="none">
                {/* Header */}
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                    {view === 'detail' || view === 'create' ? (
                        <button onClick={() => setView('list')} className="text-white/60 hover:text-white">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                    ) : (
                         <div className="flex items-center gap-2 text-primary">
                            <span className="material-symbols-outlined">map</span>
                            <span className="font-bold font-display">Learning Paths</span>
                        </div>
                    )}
                   
                    <h2 className="text-base font-bold text-white absolute left-1/2 -translate-x-1/2 pointer-events-none">
                        {view === 'create' ? 'New Path' : view === 'detail' ? selectedPath?.title : 'My Library'}
                    </h2>

                    <button onClick={onClose} className="text-white/60 hover:text-white">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                    {view === 'list' && (
                        <div className="space-y-4">
                            {/* Create Button */}
                            <button 
                                onClick={() => setView('create')}
                                className="w-full p-4 rounded-2xl border-2 border-dashed border-white/20 hover:border-primary/50 hover:bg-white/5 transition-all flex flex-col items-center justify-center gap-2 group"
                            >
                                <div className="size-10 rounded-full bg-white/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined text-white group-hover:text-primary">add</span>
                                </div>
                                <span className="text-sm font-medium text-white/60 group-hover:text-white">Create new Learning Path</span>
                            </button>

                            {/* Existing Paths */}
                            {paths.map(path => (
                                <div 
                                    key={path.id}
                                    onClick={() => handlePathClick(path)}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-4 cursor-pointer hover:bg-white/10 transition-colors relative overflow-hidden group"
                                >
                                    <div className="flex justify-between items-start mb-2 relative z-10">
                                        <div>
                                            <h3 className="font-bold text-lg mb-0.5">{path.title}</h3>
                                            <p className="text-xs text-white/50">{path.totalSteps} lessons • {path.topic}</p>
                                        </div>
                                        <div className="size-8 rounded-full bg-white/10 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-white/60">chevron_right</span>
                                        </div>
                                    </div>
                                    
                                    {/* Progress Bar */}
                                    <div className="relative z-10 mt-3">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-primary font-bold">{Math.round((path.completedSteps / path.totalSteps) * 100)}% Complete</span>
                                            <span className="text-white/40">{path.completedSteps}/{path.totalSteps}</span>
                                        </div>
                                        <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-primary rounded-full" 
                                                style={{ width: `${(path.completedSteps / path.totalSteps) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    
                                    {/* Decor */}
                                    <div className="absolute -right-4 -bottom-4 size-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>
                                </div>
                            ))}
                        </div>
                    )}

                    {view === 'create' && (
                        <div className="flex flex-col h-full justify-center">
                            <div className="text-center mb-8">
                                <span className="material-symbols-outlined text-5xl text-primary mb-4 animate-bounce">auto_awesome</span>
                                <h3 className="text-2xl font-bold font-display mb-2">AI Curriculum Designer</h3>
                                <p className="text-white/60">What do you want to master today?</p>
                            </div>

                            <div className="space-y-4">
                                <input 
                                    type="text" 
                                    value={topicInput}
                                    onChange={(e) => setTopicInput(e.target.value)}
                                    placeholder="e.g., Quantum Mechanics, Baking Sourdough, React Hooks..."
                                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-white/20 text-center text-lg"
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleCreateSubmit()}
                                />
                                <Button 
                                    fullWidth 
                                    size="lg" 
                                    onClick={handleCreateSubmit} 
                                    loading={loading === LoadingState.LOADING}
                                    disabled={!topicInput.trim()}
                                >
                                    Generate Path
                                </Button>
                            </div>
                        </div>
                    )}

                    {view === 'detail' && selectedPath && (
                        <div>
                             <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-primary/20 to-purple-900/20 border border-primary/20 text-center">
                                <h3 className="text-2xl font-bold font-display mb-1">{selectedPath.title}</h3>
                                <p className="text-sm text-white/70 mb-3">{selectedPath.description}</p>
                                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/20 text-xs font-mono text-primary-300">
                                    <span className="material-symbols-outlined text-[14px]">school</span>
                                    {selectedPath.totalSteps} Lessons
                                </div>
                             </div>

                             {/* Timeline */}
                             <div className="relative pl-4 space-y-6 before:absolute before:left-[27px] before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
                                {selectedPath.steps.map((step, index) => {
                                    const isNext = !step.isCompleted && !step.isLocked;
                                    return (
                                        <div 
                                            key={step.id} 
                                            className={`relative pl-10 transition-all ${step.isLocked ? 'opacity-50 grayscale' : 'opacity-100'}`}
                                            onClick={() => handleStepClick(step)}
                                        >
                                            {/* Node */}
                                            <div className={`absolute left-0 top-1 size-8 rounded-full border-2 flex items-center justify-center z-10 bg-[#1e1828] transition-colors ${
                                                step.isCompleted 
                                                    ? 'border-green-500 text-green-500' 
                                                    : isNext 
                                                        ? 'border-primary text-primary shadow-[0_0_10px_rgba(140,37,244,0.5)]' 
                                                        : 'border-white/20 text-white/20'
                                            }`}>
                                                {step.isCompleted ? (
                                                    <span className="material-symbols-outlined text-sm">check</span>
                                                ) : step.isLocked ? (
                                                    <span className="material-symbols-outlined text-sm">lock</span>
                                                ) : (
                                                    <span className="text-xs font-bold">{index + 1}</span>
                                                )}
                                            </div>

                                            {/* Card */}
                                            <div className={`p-4 rounded-xl border transition-all ${
                                                isNext 
                                                    ? 'bg-primary/10 border-primary/50 cursor-pointer hover:bg-primary/20' 
                                                    : 'bg-white/5 border-white/10'
                                            }`}>
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className={`font-bold text-sm ${isNext ? 'text-primary-300' : 'text-white'}`}>{step.title}</h4>
                                                    <span className="text-[10px] font-mono opacity-60 bg-black/20 px-1.5 rounded">{step.duration}</span>
                                                </div>
                                                <p className="text-xs text-white/60 leading-relaxed">{step.description}</p>
                                                
                                                {isNext && (
                                                    <div className="mt-3 flex items-center gap-1 text-xs text-primary font-bold">
                                                        <span>Start Lesson</span>
                                                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                             </div>
                             
                             {selectedPath.completedSteps === selectedPath.totalSteps && (
                                <div className="mt-8 text-center p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl animate-in zoom-in">
                                    <span className="material-symbols-outlined text-5xl text-yellow-400 mb-2">workspace_premium</span>
                                    <h4 className="text-xl font-bold text-yellow-200">Certificate of Completion</h4>
                                    <p className="text-sm text-yellow-100/60">You've mastered {selectedPath.topic}!</p>
                                </div>
                             )}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default LearningPathsModal;