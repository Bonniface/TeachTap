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

    const handleOptionClick = (index: number) => {
        if (isSubmitted) return;
        setSelectedOption(index);
    };

    const handleSubmit = () => {
        if (selectedOption === null) return;
        setIsSubmitted(true);
        if (selectedOption === quizData.correctAnswerIndex) {
            onComplete(100); // Award 100 points for correct answer
        }
    };

    const isCorrect = selectedOption === quizData.correctAnswerIndex;

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
                                if (isCorrectAnswer) {
                                    stateClass = 'border-green-500/50 bg-green-500/20 text-white';
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
                                            isSubmitted && isCorrectAnswer ? "border-green-400 bg-green-500 text-white" :
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

                    {isSubmitted && (
                        <div className={cn(
                            "mt-6 p-4 rounded-xl border animate-in slide-in-from-bottom-2",
                            isCorrect ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
                        )}>
                            <div className="flex items-start gap-3">
                                <div className={cn(
                                    "p-1.5 rounded-full shrink-0",
                                    isCorrect ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                                )}>
                                    <span className="material-symbols-outlined text-sm">
                                        {isCorrect ? 'lightbulb' : 'info'}
                                    </span>
                                </div>
                                <div>
                                    <p className={cn("font-bold text-sm mb-1", isCorrect ? 'text-green-400' : 'text-red-400')}>
                                        {isCorrect ? 'Correct! +100 XP' : 'Not quite right'}
                                    </p>
                                    <p className="text-white/80 text-sm leading-relaxed font-body">
                                        {quizData.explanation}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
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