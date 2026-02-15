
import React, { useState, useEffect, useRef } from 'react';

interface VideoBackgroundProps {
    videoUrl?: string;
    posterUrl: string;
    altText: string;
    isActive: boolean;
    onToggleUi?: () => void;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ videoUrl, posterUrl, altText, isActive, onToggleUi }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    // Sync playback and speed with component state
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.playbackRate = speed;
        
        if (isActive && !hasError) {
            video.play().catch(err => {
                console.warn("Autoplay blocked or failed:", err);
                setIsPlaying(false);
            });
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    }, [isActive, speed, hasError, retryCount]);

    const handleVideoTap = (e: React.MouseEvent) => {
        // Only toggle UI if the video is currently playing or we are in a normal interactive state
        // This makes the screen tap feel like "waking up" the UI
        if (onToggleUi) {
            onToggleUi();
        }
        
        // Optionally toggle play/pause as well, or just rely on the UI button
        // For standard TikTok feel, tapping toggles play/pause
        const video = videoRef.current;
        if (!video || hasError) return;

        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    const cycleSpeed = (e: React.MouseEvent) => {
        e.stopPropagation();
        const speeds = [0.5, 1, 1.5, 2];
        const currentIndex = speeds.indexOf(speed);
        const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
        setSpeed(nextSpeed);
    };

    const handleRetry = (e: React.MouseEvent) => {
        e.stopPropagation();
        setHasError(false);
        setIsLoading(true);
        setRetryCount(prev => prev + 1);
        if (videoRef.current) {
            videoRef.current.load();
        }
    };

    return (
        <div 
            className="absolute inset-0 z-0 h-full w-full bg-black overflow-hidden select-none"
            onClick={handleVideoTap}
        >
            {/* Poster Fallback / Background Blur */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center opacity-50 blur-xl scale-110 transition-opacity duration-1000"
                style={{ backgroundImage: `url("${posterUrl}")` }}
            />

            {/* Actual Video Element */}
            {!hasError && videoUrl && (
                <video
                    ref={videoRef}
                    src={videoUrl}
                    poster={posterUrl}
                    className={`w-full h-full object-cover relative z-10 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    loop
                    muted={false}
                    playsInline
                    onWaiting={() => setIsLoading(true)}
                    onPlaying={() => {
                        setIsLoading(false);
                        setHasError(false);
                    }}
                    onCanPlay={() => setIsLoading(false)}
                    onError={() => {
                        setHasError(true);
                        setIsLoading(false);
                    }}
                />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/60 via-transparent to-black/30 pointer-events-none"></div>
            
            {/* Speed Control UI - Smaller and subtle */}
            <div className={`absolute top-28 left-4 z-30 transition-opacity duration-300 ${isActive && !hasError ? 'opacity-100' : 'opacity-0'}`}>
                <button 
                    onClick={cycleSpeed}
                    className="flex items-center gap-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 rounded-full pl-2 pr-3 py-1.5 transition-all active:scale-95 group shadow-lg"
                >
                    <span className="material-symbols-outlined text-white/70 text-[18px] group-hover:text-white transition-colors">speed</span>
                    <span className="text-xs font-bold font-mono text-white/90 min-w-[24px] text-center">{speed}x</span>
                </button>
            </div>

            {/* Play/Pause Overlay */}
            <div className={`absolute inset-0 z-25 flex items-center justify-center pointer-events-none transition-opacity duration-200 ${!isPlaying && !isLoading && !hasError ? 'opacity-100' : 'opacity-0'}`}>
                <div className="bg-black/40 rounded-full p-4 backdrop-blur-sm border border-white/10 shadow-xl">
                    <span className="material-symbols-outlined text-white text-4xl">play_arrow</span>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && !hasError && (
                <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[2px]">
                    <div className="relative">
                        <div className="size-16 border-4 border-white/10 border-t-primary rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white/20 text-xl">school</span>
                        </div>
                    </div>
                    <p className="mt-4 text-xs font-bold text-white/40 tracking-widest uppercase animate-pulse">Loading Lesson...</p>
                </div>
            )}

            {/* Error State Overlay */}
            {hasError && (
                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md px-6 text-center animate-in fade-in duration-300">
                    <div className="size-20 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                        <span className="material-symbols-outlined text-red-400 text-4xl">cloud_off</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 font-display">Lesson Unavailable</h3>
                    <p className="text-sm text-white/60 mb-8 max-w-[240px]">We're having trouble loading this video. Please check your connection or try again.</p>
                    <button 
                        onClick={handleRetry}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-600 text-white px-8 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-xl shadow-primary/20"
                    >
                        <span className="material-symbols-outlined">refresh</span>
                        Retry Loading
                    </button>
                </div>
            )}
        </div>
    );
};

export default VideoBackground;
