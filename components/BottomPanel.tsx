
import React, { useRef, useEffect, useState } from 'react';
import { LoadingState } from '../types';
import Button from './common/Button';

interface BottomPanelProps {
    transcript: string[];
    onQuizClick: () => void;
    quizLoadingState: LoadingState;
    // Live Props
    isLiveConnected: boolean;
    isLiveSpeaking: boolean;
    liveTranscripts: Array<{role: 'user' | 'model', text: string}>;
    onToggleLive: () => void;
    onExpandChange?: (isExpanded: boolean) => void;
}

const BottomPanel: React.FC<BottomPanelProps> = ({ 
    transcript, 
    onQuizClick, 
    quizLoadingState,
    isLiveConnected,
    isLiveSpeaking,
    liveTranscripts,
    onToggleLive,
    onExpandChange
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const liveScrollRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    
    // Drag state
    const [height, setHeight] = useState(25);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartY = useRef(0);
    const dragStartHeight = useRef(0);

    // Derived state for visibility
    const isMinimized = height < 15;

    // Notify parent of expansion state (for hiding progress bar etc)
    useEffect(() => {
        if (onExpandChange) {
            // Consider expanded if height is larger than the default peek state
            onExpandChange(height > 20);
        }
    }, [height, onExpandChange]);

    // Auto-expand/collapse based on live status
    useEffect(() => {
        if (isLiveConnected) {
            // User requested to show only 2-5% when live chat starts
            setHeight(5); 
        } 
    }, [isLiveConnected]);

    // Auto-scroll for static transcript
    useEffect(() => {
        const el = scrollRef.current;
        if (!el || isLiveConnected || isDragging || isMinimized) return; 
        
        let animationFrameId: number;
        let lastTimestamp = 0;
        
        const step = (timestamp: number) => {
            if (!lastTimestamp) lastTimestamp = timestamp;
            const progress = timestamp - lastTimestamp;
            
            if (progress > 50) {
                if (el.scrollTop < el.scrollHeight - el.clientHeight) {
                    el.scrollTop += 0.5;
                }
                lastTimestamp = timestamp;
            }
            animationFrameId = window.requestAnimationFrame(step);
        };
        
        animationFrameId = window.requestAnimationFrame(step);
        return () => window.cancelAnimationFrame(animationFrameId);
    }, [isLiveConnected, isDragging, isMinimized]);

    // Auto-scroll for live transcript
    useEffect(() => {
        if (liveScrollRef.current) {
            liveScrollRef.current.scrollTop = liveScrollRef.current.scrollHeight;
        }
    }, [liveTranscripts, isLiveConnected]);

    // Drag Handlers
    const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true);
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        dragStartY.current = clientY;
        
        if (panelRef.current) {
            dragStartHeight.current = panelRef.current.getBoundingClientRect().height;
        }
    };

    useEffect(() => {
        const handleDragMove = (e: MouseEvent | TouchEvent) => {
            if (!isDragging) return;
            
            if (e.cancelable && e.type === 'touchmove') {
               e.preventDefault(); 
            }

            const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;
            const deltaY = dragStartY.current - clientY; 
            const newHeightPx = dragStartHeight.current + deltaY;
            const windowHeight = window.innerHeight;
            
            let newHeightPct = (newHeightPx / windowHeight) * 100;
            
            if (newHeightPct < 3) newHeightPct = 3; 
            if (newHeightPct > 95) newHeightPct = 95;
            
            setHeight(newHeightPct);
        };

        const handleDragEnd = () => {
            if (!isDragging) return;
            setIsDragging(false);

            // Snap logic
            if (height < 15) {
                setHeight(5); // Snap to minimized
            } else if (height < 40) {
                setHeight(25); // Snap to default peek
            } else if (height < 75) {
                setHeight(65); // Snap to Live/Reading view
            } else {
                setHeight(90); // Snap to Full expand
            }
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleDragMove);
            window.addEventListener('mouseup', handleDragEnd);
            window.addEventListener('touchmove', handleDragMove, { passive: false });
            window.addEventListener('touchend', handleDragEnd);
        }

        return () => {
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
            window.removeEventListener('touchmove', handleDragMove);
            window.removeEventListener('touchend', handleDragEnd);
        };
    }, [isDragging, height]);

    return (
        <div 
            ref={panelRef}
            className={`absolute bottom-0 inset-x-0 z-30 glass-panel rounded-t-2xl flex flex-col shadow-[0_-8px_30px_rgba(0,0,0,0.5)] ${isDragging ? '' : 'transition-[height] duration-500 cubic-bezier(0.32, 0.72, 0, 1)'}`}
            style={{ height: `${height}%` }}
        >
            {/* Draggable Handle Indicator */}
            <div 
                className="w-full flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing hover:bg-white/5 transition-colors rounded-t-2xl touch-none relative"
                onMouseDown={handleDragStart}
                onTouchStart={handleDragStart}
            >
                <div className="w-12 h-1.5 bg-white/30 rounded-full pointer-events-none mb-1"></div>
                
                {/* Live Status Indicator - Visible when minimized so user knows chat is active */}
                {isLiveConnected && (
                    <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-1">
                        <span className="size-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
                        <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase">Live Copilot Active</span>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className={`flex flex-1 flex-row gap-4 px-5 pb-20 pt-1 overflow-hidden relative transition-opacity duration-200 ${isMinimized ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                {/* Left: Content Area */}
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <div className="flex items-center justify-between mb-3 shrink-0">
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={onToggleLive}
                                variant={isLiveConnected ? 'danger' : 'secondary'}
                                size="sm"
                                className={`rounded-full border ${isLiveConnected ? 'bg-red-500/20 text-red-400 border-red-500/50 hover:bg-red-500/30' : ''}`}
                                leftIcon={
                                    <span className={`material-symbols-outlined text-sm ${isLiveConnected ? 'animate-pulse' : ''}`}>
                                        {isLiveConnected ? 'mic' : 'mic_off'}
                                    </span>
                                }
                            >
                                {isLiveConnected ? (isLiveSpeaking ? 'Speaking...' : 'Listening') : 'Start Live Chat'}
                            </Button>
                        </div>
                        
                        {isLiveConnected && (
                            <div className="flex gap-1 h-4 items-end px-2">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className={`w-1 bg-primary rounded-full animate-bounce`} style={{ height: isLiveSpeaking ? `${Math.random() * 100}%` : '20%', animationDelay: `${i * 0.1}s` }}></div>
                                ))}
                            </div>
                        )}
                    </div>

                    {isLiveConnected ? (
                        <div 
                            ref={liveScrollRef}
                            className="overflow-y-auto scrollbar-hide pr-2 relative h-full flex flex-col gap-3 pb-2"
                        >
                            {liveTranscripts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-white/40 space-y-2">
                                    <span className="material-symbols-outlined text-3xl opacity-50">graphic_eq</span>
                                    <p className="text-sm italic">Say "Hello" to start...</p>
                                </div>
                            ) : (
                                liveTranscripts.map((t, i) => (
                                    <div key={i} className={`flex flex-col ${t.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                                            t.role === 'user' 
                                            ? 'bg-white/10 text-white rounded-tr-none' 
                                            : 'bg-primary/20 text-white rounded-tl-none border border-primary/20'
                                        }`}>
                                            {t.text}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div 
                            ref={scrollRef}
                            className="overflow-y-auto scrollbar-hide pr-2 relative fade-bottom pb-2"
                        >
                            {transcript.map((text, i) => (
                                <p key={i} className={`text-sm leading-relaxed font-body mb-3 ${i === 0 ? 'text-white font-medium' : 'text-gray-400'}`} dangerouslySetInnerHTML={{ __html: text }} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Check Knowledge CTA */}
                <div className="flex flex-col items-center justify-end pb-1 shrink-0">
                    <button 
                        onClick={onQuizClick}
                        disabled={quizLoadingState === LoadingState.LOADING || isLiveConnected}
                        className={`relative group flex flex-col items-center justify-center gap-1 size-[72px] rounded-2xl transition-all border border-white/10 disabled:opacity-50 disabled:grayscale ${
                            isLiveConnected ? 'bg-white/5' : 'bg-primary shadow-[0_4px_20px_rgba(140,37,244,0.4)] hover:bg-primary-600 hover:scale-105 active:scale-95'
                        }`}
                        aria-label="Take Quiz"
                    >
                        {quizLoadingState === LoadingState.LOADING ? (
                            <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <div className={`absolute -top-1 -right-1 size-3 bg-red-500 rounded-full border-2 border-[#1e1828] ${isLiveConnected ? 'hidden' : 'block'}`}></div>
                                <span className="material-symbols-outlined text-3xl mb-0.5">quiz</span>
                                <span className="text-[10px] font-bold leading-none text-center font-display">Quiz</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BottomPanel;
