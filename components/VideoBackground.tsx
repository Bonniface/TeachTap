
import React, { useState, useEffect } from 'react';

interface VideoBackgroundProps {
    posterUrl: string;
    altText: string;
    isActive: boolean;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ posterUrl, altText, isActive }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);

    // Sync local playing state with active prop
    useEffect(() => {
        setIsPlaying(isActive);
    }, [isActive]);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const cycleSpeed = (e: React.MouseEvent) => {
        e.stopPropagation();
        const speeds = [0.5, 1, 1.5, 2];
        const currentIndex = speeds.indexOf(speed);
        const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
        setSpeed(nextSpeed);
    };

    return (
        <div 
            className="absolute inset-0 z-0 h-[80%] w-full bg-cover bg-center transition-transform duration-700"
            style={{ backgroundImage: `url("${posterUrl}")` }}
            onClick={togglePlay}
            aria-label={altText}
        >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/20 pointer-events-none"></div>
            
            {/* Speed Control Button - positioned below TopNav right actions */}
            <div className={`absolute top-28 right-4 z-20 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                <button 
                    onClick={cycleSpeed}
                    className="flex items-center gap-1.5 bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 rounded-full pl-2 pr-3 py-1.5 transition-all active:scale-95 group shadow-lg"
                >
                    <span className="material-symbols-outlined text-white/70 text-[18px] group-hover:text-white transition-colors">speed</span>
                    <span className="text-xs font-bold font-mono text-white/90 min-w-[24px] text-center">{speed}x</span>
                </button>
            </div>

            {/* Simulated Play/Pause Overlay */}
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200 ${!isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                <div className="bg-black/40 rounded-full p-4 backdrop-blur-sm border border-white/10 shadow-xl scale-100">
                    <span className="material-symbols-outlined text-white text-4xl">play_arrow</span>
                </div>
            </div>
        </div>
    );
};

export default VideoBackground;
