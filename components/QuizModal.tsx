import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import Button from './common/Button';
import Card from './common/Card';
import { cn } from '../utils/classNames';

interface QuizModalProps {
    quizData: QuizQuestion;
    onClose: () => void;
    onComplete: (points: number) => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ quizData, onClose, onComplete }) => {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [view, setView] = useState<'question' | 'success'>('question');

    const handleOptionClick = (index: number) => {
        if (isSubmitted) return;
        setSelectedOption(index);
    };

    const handleSubmit = () => {
        if (selectedOption === null) return;
        setIsSubmitted(true);
        const isCorrect = selectedOption === quizData.correctAnswerIndex;
        
        if (isCorrect) {
            onComplete(100); // Award 100 points
            // Small delay to show selection before switching view
            setTimeout(() => setView('success'), 600);
        }
    };

    const isCorrect = selectedOption === quizData.correctAnswerIndex;

    // --- Success View (High Fidelity) ---
    if (view === 'success') {
        return (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xl animate-in fade-in duration-300">
                <div className="w-full max-w-md h-full flex flex-col px-6 pt-20 pb-8 overflow-y-auto scrollbar-hide">
                    
                    {/* Success Animation & Header */}
                    <div className="flex flex-col items-center justify-center mt-4 mb-2 animate-pop">
                        <div className="relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-success/30 rounded-full blur-2xl"></div>
                            <span className="material-symbols-outlined text-success text-[100px] relative drop-shadow-2xl" style={{ fontVariationSettings: "'FILL' 1, 'wght' 600" }}>
                                check_circle
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold text-white mt-4 tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                            Correct!
                        </h1>
                    </div>

                    {/* Explanation Card */}
                    <div className="mt-8 bg-[#1E1E1E]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-700"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="material-symbols-outlined text-success text-sm">lightbulb</span>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Why it's right</span>
                            </div>
                            <p className="text-lg text-white font-body leading-relaxed">
                                <span className="font-bold text-success">Exactly!</span> {quizData.explanation}
                            </p>
                        </div>
                    </div>

                    {/* XP Progress Section */}
                    <div className="mt-8 w-full">
                        <div className="flex justify-between items-end mb-2 px-1">
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-300">Level Up</span>
                            <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-0.5 rounded-lg border border-yellow-500/20">
                                <span className="material-symbols-outlined text-yellow-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                                <span className="text-sm font-bold text-yellow-400">+100 XP</span>
                            </div>
                        </div>
                        <div className="h-5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 relative shadow-inner">
                            <div className="absolute inset-0 flex">
                                <div className="flex-1 border-r border-black/20"></div>
                                <div className="flex-1 border-r border-black/20"></div>
                                <div className="flex-1 border-r border-black/20"></div>
                                <div className="flex-1"></div>
                            </div>
                            <div className="h-full bg-gradient-to-r from-success to-emerald-500 w-[65%] rounded-full shadow-[0_0_15px_rgba(0,224,84,0.4)] relative">
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/30"></div>
                            </div>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1.5 px-1">
                            <span>Rank 12</span>
                            <span>Rank 13</span>
                        </div>
                    </div>

                    <div className="flex-1"></div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 mt-8">
                        <button 
                            onClick={onClose}
                            className="w-full h-14 bg-white text-black font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:bg-gray-100 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                        >
                            <span>Next Question</span>
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                        <button 
                            onClick={onClose}
                            className="w-full py-3 text-white/60 font-medium text-sm hover:text-white transition-colors flex items-center justify-center gap-1"
                        >
                            <span className="material-symbols-outlined text-lg">replay</span>
                            Back to Video
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- Standard Question View ---
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-md max-h-[90vh] flex flex-col" padding="none">
                {/* Header */}
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-2 text-primary">
                        <div className="bg-primary/10 p-1.5 rounded-lg">
                            <span className="material-symbols-outlined text-lg">psychology</span>
                        </div>
                        <h2 className="text-lg font-bold font-display text-white">Quick Quiz</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="size-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                        aria-label="Close quiz"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    <div className="mb-6">
                         <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-3 border border-primary/20">
                            <span className="material-symbols-outlined text-primary text-xs">quiz</span>
                            <span className="text-xs font-bold text-primary tracking-wide uppercase">Multiple Choice</span>
                        </div>
                        <h3 className="text-xl font-medium text-white leading-relaxed font-display">
                            {quizData.question}
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {quizData.options.map((option, index) => {
                            const isSelected = selectedOption === index;
                            const isCorrectAnswer = index === quizData.correctAnswerIndex;
                            
                            let stateClass = 'border-white/10 bg-white/5 hover:bg-white/10 text-white/80';
                            
                            if (isSubmitted) {
                                // For standard view (incorrect state), show feedback
                                if (isCorrectAnswer) {
                                    stateClass = 'border-success/50 bg-success/20 text-white';
                                } else if (isSelected) {
                                    stateClass = 'border-red-500/50 bg-red-500/20 text-white/70';
                                } else {
                                    stateClass = 'border-transparent bg-white/5 text-white/30 opacity-50';
                                }
                            } else if (isSelected) {
                                stateClass = 'border-primary bg-primary/20 text-white shadow-[0_0_15px_rgba(140,37,244,0.3)]';
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleOptionClick(index)}
                                    className={cn(
                                        "w-full p-4 rounded-xl text-left border transition-all duration-200 relative overflow-hidden group",
                                        stateClass
                                    )}
                                    disabled={isSubmitted}
                                >
                                    <div className="flex items-center gap-3 relative z-10">
                                        <div className={cn(
                                            "size-8 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors",
                                            isSubmitted && isCorrectAnswer ? "border-green-400 bg-success text-white" :
                                            isSubmitted && isSelected ? "border-red-400 bg-red-500 text-white" :
                                            isSelected ? "border-primary bg-primary text-white" :
                                            "border-white/30 text-white/50 group-hover:border-white/50"
                                        )}>
                                            {isSubmitted && isCorrectAnswer ? <span className="material-symbols-outlined text-sm">check</span> :
                                             isSubmitted && isSelected ? <span className="material-symbols-outlined text-sm">close</span> :
                                             String.fromCharCode(65 + index)}
                                        </div>
                                        <span className="font-body text-sm font-medium leading-tight">{option}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Inline Feedback for Incorrect Answer */}
                    {isSubmitted && !isCorrect && (
                        <div className="mt-6 p-4 rounded-xl border animate-in slide-in-from-bottom-2 bg-red-500/10 border-red-500/20">
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 rounded-full shrink-0 bg-red-500/20 text-red-400">
                                    <span className="material-symbols-outlined text-sm">info</span>
                                </div>
                                <div>
                                    <p className="font-bold text-sm mb-1 text-red-400">Not quite right</p>
                                    <p className="text-white/80 text-sm leading-relaxed font-body">
                                        {quizData.explanation}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions (Only for Question View) */}
                <div className="p-4 border-t border-white/5 bg-black/20 flex justify-end">
                    {!isSubmitted ? (
                        <Button 
                            onClick={handleSubmit}
                            disabled={selectedOption === null}
                            fullWidth
                            size="lg"
                            rightIcon={<span className="material-symbols-outlined">check</span>}
                        >
                            Check Answer
                        </Button>
                    ) : (
                        <Button 
                            onClick={onClose}
                            variant="secondary"
                            fullWidth
                            size="lg"
                            rightIcon={<span className="material-symbols-outlined">arrow_forward</span>}
                        >
                            Continue Learning
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default QuizModal;
