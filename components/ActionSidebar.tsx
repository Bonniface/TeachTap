
import React, { useState } from 'react';
import { Author, FeedStats } from '../types';
import { cn } from '../utils/classNames';

interface ActionSidebarProps {
    author: Author;
    stats: FeedStats;
    isDownloaded?: boolean;
    onNoteClick: () => void;
    onDownloadClick: () => Promise<void>;
    onSubscribeToggle: () => void;
}

const ActionSidebar: React.FC<ActionSidebarProps> = ({ 
    author, 
    stats, 
    isDownloaded = false, 
    onNoteClick,
    onDownloadClick,
    onSubscribeToggle
}) => {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(stats.likes);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleLike = () => {
        setLiked(!liked);
        if (!liked) {
             setLikeCount("12.6k");
        } else {
             setLikeCount(stats.likes);
        }
    };

    const handleDownload = async () => {
        if (isDownloading) return;
        setIsDownloading(true);
        try {
            await onDownloadClick();
        } finally {
            setIsDownloading(false);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Check out this lesson!',
                    text: 'Learn about Relativity with TeachTap',
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing', err);
            }
        } else {
            alert('Link copied to clipboard!');
        }
    };

    const actionBtnClass = "flex items-center justify-center size-11 rounded-full backdrop-blur-md transition-all duration-300 active:scale-90 hover:scale-110 border border-transparent hover:border-white/30 focus:outline-none focus:ring-2 focus:ring-primary shadow-lg";

    return (
        <div className="absolute right-4 bottom-[24%] z-20 flex flex-col gap-5 items-center pb-4 pointer-events-auto">
            {/* Profile Avatar & Subscription Toggle */}
            <div className="relative mb-2 group">
                <div className="size-12 rounded-full border-2 border-white p-0.5 overflow-hidden bg-black transition-all duration-300 group-hover:scale-105 group-hover:border-primary shadow-xl">
                    <img 
                        src={author.avatarUrl} 
                        alt="User Profile Avatar" 
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>
                
                {/* Subscription Button (Plus/Check) */}
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onSubscribeToggle();
                    }}
                    className={cn(
                        "absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full size-5 flex items-center justify-center border border-black shadow-sm transition-all duration-500 active:scale-75",
                        author.isSubscribed 
                            ? "bg-success scale-0 opacity-0" 
                            : "bg-primary scale-100 opacity-100 hover:scale-110"
                    )}
                >
                    <span className="material-symbols-outlined text-[14px] font-bold text-white">add</span>
                </button>

                {/* Success Subscription Animation State */}
                {author.isSubscribed && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-success rounded-full size-5 flex items-center justify-center border border-black shadow-sm animate-in zoom-in fade-in duration-300">
                        <span className="material-symbols-outlined text-[14px] font-bold text-white">check</span>
                    </div>
                )}
            </div>

            {/* Like */}
            <div className="flex flex-col items-center gap-1 group">
                <button 
                    onClick={handleLike}
                    className={`${actionBtnClass} ${liked ? 'text-red-500 bg-white/20' : 'text-white bg-black/40 hover:bg-black/60'}`}
                >
                    <span 
                        className={`material-symbols-outlined transition-transform duration-300 ${liked ? 'scale-125' : 'group-hover:scale-110'}`} 
                        style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}
                    >
                        favorite
                    </span>
                </button>
                <span className="text-xs font-bold drop-shadow-md font-display transition-colors group-hover:text-red-400">{likeCount}</span>
            </div>

            {/* Comments */}
            <div className="flex flex-col items-center gap-1 group">
                <button className={`${actionBtnClass} text-white bg-black/40 hover:bg-black/60`}>
                    <span className="material-symbols-outlined transition-transform duration-300 group-hover:scale-110" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
                </button>
                <span className="text-xs font-bold drop-shadow-md font-display transition-colors group-hover:text-primary">{stats.comments}</span>
            </div>

            {/* Notes */}
            <div className="flex flex-col items-center gap-1 group">
                <button 
                    onClick={onNoteClick}
                    className={`${actionBtnClass} text-white bg-black/40 hover:bg-black/60`}
                >
                    <span className="material-symbols-outlined transition-transform duration-300 group-hover:scale-110">edit_note</span>
                </button>
                <span className="text-xs font-bold drop-shadow-md font-display transition-colors group-hover:text-primary">Notes</span>
            </div>

            {/* Download */}
            <div className="flex flex-col items-center gap-1 group">
                <button 
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className={`${actionBtnClass} ${isDownloaded ? 'text-green-400 bg-white/20' : 'text-white bg-black/40 hover:bg-black/60'} ${isDownloading ? 'cursor-wait opacity-80' : ''}`}
                >
                    {isDownloading ? (
                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <span 
                            className={`material-symbols-outlined transition-all duration-300 ${isDownloaded ? 'scale-125 rotate-0' : 'group-hover:scale-110'}`} 
                            style={{ fontVariationSettings: isDownloaded ? "'FILL' 1" : "'FILL' 0" }}
                        >
                            {isDownloaded ? 'download_done' : 'download'}
                        </span>
                    )}
                </button>
                <span className="text-xs font-bold drop-shadow-md font-display transition-colors group-hover:text-green-400">
                    {isDownloading ? 'Saving...' : (isDownloaded ? 'Saved' : 'Save')}
                </span>
            </div>

            {/* Share */}
            <div className="flex flex-col items-center gap-1 group">
                <button onClick={handleShare} className={`${actionBtnClass} text-white bg-black/40 hover:bg-black/60`}>
                    <span className="material-symbols-outlined transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">share</span>
                </button>
                <span className="text-xs font-bold drop-shadow-md font-display transition-colors group-hover:text-primary">Share</span>
            </div>
        </div>
    );
};

export default ActionSidebar;
