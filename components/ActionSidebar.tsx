
import React, { useState } from 'react';
import { Author, FeedStats } from '../types';

interface ActionSidebarProps {
    author: Author;
    stats: FeedStats;
    isDownloaded?: boolean;
    onNoteClick: () => void;
    onDownloadClick: () => Promise<void>;
}

const ActionSidebar: React.FC<ActionSidebarProps> = ({ 
    author, 
    stats, 
    isDownloaded = false, 
    onNoteClick,
    onDownloadClick 
}) => {
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
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

    const actionBtnClass = "flex items-center justify-center size-11 rounded-full backdrop-blur-md transition-all active:scale-95 border border-transparent hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-primary";

    return (
        <div className="absolute right-4 bottom-[24%] z-20 flex flex-col gap-5 items-center pb-4 pointer-events-auto">
            {/* Profile Avatar */}
            <div className="relative mb-2 group cursor-pointer">
                <div className="size-12 rounded-full border-2 border-white p-0.5 overflow-hidden bg-black transition-transform group-hover:scale-110 shadow-lg">
                    <img 
                        src={author.avatarUrl} 
                        alt="User Profile Avatar" 
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-primary rounded-full size-5 flex items-center justify-center border border-black shadow-sm">
                    <span className="material-symbols-outlined text-[14px] font-bold text-white">add</span>
                </div>
            </div>

            {/* Like */}
            <div className="flex flex-col items-center gap-1">
                <button 
                    onClick={handleLike}
                    className={`${actionBtnClass} ${liked ? 'text-red-500 bg-white/20' : 'text-white bg-black/40 hover:bg-black/60'}`}
                >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 1" }}>favorite</span>
                </button>
                <span className="text-xs font-bold drop-shadow-md font-display">{likeCount}</span>
            </div>

            {/* Comments */}
            <div className="flex flex-col items-center gap-1">
                <button className={`${actionBtnClass} text-white bg-black/40 hover:bg-black/60`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>chat_bubble</span>
                </button>
                <span className="text-xs font-bold drop-shadow-md font-display">{stats.comments}</span>
            </div>

            {/* Notes */}
            <div className="flex flex-col items-center gap-1">
                <button 
                    onClick={onNoteClick}
                    className={`${actionBtnClass} text-white bg-black/40 hover:bg-black/60`}
                >
                    <span className="material-symbols-outlined">edit_note</span>
                </button>
                <span className="text-xs font-bold drop-shadow-md font-display">Notes</span>
            </div>

            {/* Download (New!) */}
            <div className="flex flex-col items-center gap-1">
                <button 
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className={`${actionBtnClass} ${isDownloaded ? 'text-green-400 bg-white/20' : 'text-white bg-black/40 hover:bg-black/60'} ${isDownloading ? 'cursor-wait opacity-80' : ''}`}
                >
                    {isDownloading ? (
                        <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: isDownloaded ? "'FILL' 1" : "'FILL' 0" }}>
                            {isDownloaded ? 'download_done' : 'download'}
                        </span>
                    )}
                </button>
                <span className="text-xs font-bold drop-shadow-md font-display">
                    {isDownloading ? 'Saving...' : (isDownloaded ? 'Saved' : 'Save')}
                </span>
            </div>

            {/* Share */}
            <div className="flex flex-col items-center gap-1">
                <button onClick={handleShare} className={`${actionBtnClass} text-white bg-black/40 hover:bg-black/60`}>
                    <span className="material-symbols-outlined">share</span>
                </button>
                <span className="text-xs font-bold drop-shadow-md font-display">Share</span>
            </div>
        </div>
    );
};

export default ActionSidebar;
