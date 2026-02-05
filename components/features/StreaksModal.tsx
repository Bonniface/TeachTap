import React from 'react';
import Card from '../common/Card';
import { Achievement } from '../../types';

interface StreaksModalProps {
    streak: number;
    xp: number;
    achievements: Achievement[];
    onClose: () => void;
}

const StreaksModal: React.FC<StreaksModalProps> = ({ streak, xp, achievements, onClose }) => {
    // Determine Level based on XP (e.g., every 500 XP is a level)
    const level = Math.floor(xp / 500) + 1;
    const currentLevelProgress = xp % 500;
    const nextLevelXp = 500;
    const progressPercentage = (currentLevelProgress / nextLevelXp) * 100;

    // Mock Calendar Data
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const currentDayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1; // 0-6, Mon-Sun

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden" padding="none">
                {/* Header */}
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <h2 className="text-lg font-bold font-display text-white">Your Progress</h2>
                    <button 
                        onClick={onClose}
                        className="size-8 flex items-center justify-center rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="overflow-y-auto p-6 space-y-8">
                    
                    {/* Main Streak Counter */}
                    <div className="flex flex-col items-center text-center">
                        <div className="relative mb-2">
                             <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-20 rounded-full animate-pulse-slow"></div>
                             <span className="material-symbols-outlined text-[64px] text-orange-500 relative z-10 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}>local_fire_department</span>
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-1 font-display tracking-tight">{streak}</h1>
                        <p className="text-lg text-orange-400 font-bold mb-2">Day Streak</p>
                        <div className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full">
                            <p className="text-xs text-orange-300 font-medium">Earn 10% more XP today!</p>
                        </div>
                    </div>

                    {/* Weekly Calendar */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-bold text-white/80">This Week</span>
                            <span className="text-xs text-white/40">Total active days: {streak}</span>
                        </div>
                        <div className="flex justify-between gap-1">
                            {days.map((day, i) => {
                                const isActive = i === currentDayIndex || (i < currentDayIndex && i >= currentDayIndex - (streak % 7)); // Mock logic for previous streak days
                                const isToday = i === currentDayIndex;
                                return (
                                    <div key={i} className="flex flex-col items-center gap-2">
                                        <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${
                                            isActive 
                                                ? 'bg-orange-500 border-orange-400 text-white shadow-[0_0_10px_rgba(249,115,22,0.4)]' 
                                                : isToday 
                                                    ? 'bg-white/10 border-white/30 text-white' 
                                                    : 'bg-transparent border-transparent text-white/20'
                                        }`}>
                                            {isActive ? <span className="material-symbols-outlined text-sm">check</span> : day}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* XP & Level */}
                    <div>
                         <div className="flex justify-between items-end mb-2">
                            <div>
                                <span className="text-xs text-primary font-bold uppercase tracking-wider mb-0.5 block">Current Level</span>
                                <span className="text-2xl font-bold text-white">Level {level} Scholar</span>
                            </div>
                            <span className="text-sm font-mono text-white/60">{currentLevelProgress} / {nextLevelXp} XP</span>
                        </div>
                        <div className="h-3 bg-white/10 rounded-full overflow-hidden border border-white/5">
                            <div 
                                className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(140,37,244,0.5)]" 
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Achievements List */}
                    <div>
                        <h3 className="text-sm font-bold text-white/80 mb-4 uppercase tracking-wider">Achievements</h3>
                        <div className="space-y-3">
                            {achievements.map((achievement) => (
                                <div 
                                    key={achievement.id} 
                                    className={`relative overflow-hidden rounded-xl border p-3 flex items-center gap-4 transition-all ${
                                        achievement.isUnlocked 
                                            ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20 shadow-lg' 
                                            : 'bg-white/5 border-white/5 opacity-70 grayscale'
                                    }`}
                                >
                                    {/* Achievement Icon */}
                                    <div className={`size-12 rounded-lg flex items-center justify-center text-2xl border ${
                                        achievement.isUnlocked 
                                            ? `bg-${achievement.color}-500/20 border-${achievement.color}-500/50 text-${achievement.color}-400` 
                                            : 'bg-white/5 border-white/10 text-white/20'
                                    }`}>
                                        <span className="material-symbols-outlined" style={{ color: achievement.isUnlocked ? undefined : 'inherit' }}>
                                            {achievement.icon}
                                        </span>
                                    </div>

                                    {/* Text Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <h4 className="font-bold text-sm text-white truncate pr-2">{achievement.title}</h4>
                                            {achievement.isUnlocked && (
                                                <span className="material-symbols-outlined text-yellow-400 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>trophy</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-white/60 mb-2 truncate">{achievement.description}</p>
                                        
                                        {/* Mini Progress Bar for locked items */}
                                        {!achievement.isUnlocked && (
                                            <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-white/40 rounded-full" 
                                                    style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                                                ></div>
                                            </div>
                                        )}
                                        {/* Date earned or progress text */}
                                        <div className="flex justify-end mt-1">
                                            <span className="text-[10px] text-white/30 font-medium">
                                                {achievement.isUnlocked ? 'Unlocked' : `${achievement.progress}/${achievement.maxProgress}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </Card>
        </div>
    );
};

export default StreaksModal;