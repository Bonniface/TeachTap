import React, { useState } from 'react';

interface VideoBackgroundProps {
    posterUrl: string;
    altText: string;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ posterUrl, altText }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
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
            
            {/* Simulated Play/Pause Overlay */}
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${!isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                <div className="bg-black/40 rounded-full p-4 backdrop-blur-sm">
                    <span className="material-symbols-outlined text-white text-4xl">play_arrow</span>
                </div>
            </div>
        </div>
    );
};

export default VideoBackground;