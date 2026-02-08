
import React from 'react';

interface TopNavProps {
    topic: string;
    title: string;
    authorName: string;
    onTimeBackClick: () => void;
    onArenaClick: () => void;
    onPasscoClick: () => void;
}

const TopNav: React.FC<TopNavProps> = ({ 
    topic, 
    title, 
    authorName, 
    onTimeBackClick,
    onArenaClick,
    onPasscoClick
}) => {
    return (
        <div className="absolute top-0 inset-x-0 z-20 pt-12 pb-4 px-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
            <div className="flex items-start justify-between pointer-events-auto">
                {/* Left Actions */}
                <div className="flex gap-2">
                     <button 
                        onClick={onTimeBackClick}
                        className="flex items-center justify-center size-10 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-black/40 transition-colors focus:ring-2 focus:ring-primary group"
                        title="TimeBack Copilot"
                    >
                        <span className="material-symbols-outlined group-hover:text-primary transition-colors">history_toggle_off</span>
                    </button>
                    <button 
                        onClick={onArenaClick}
                        className="flex items-center justify-center size-10 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-black/40 transition-colors focus:ring-2 focus:ring-primary group"
                        title="Arena"
                    >
                        <span className="material-symbols-outlined group-hover:text-yellow-400 transition-colors">swords</span>
                    </button>
                </div>

                {/* Feed Toggle */}
                <div className="flex flex-col items-center gap-2">
                    <div className="flex h-9 items-center justify-center rounded-lg bg-black/40 backdrop-blur-md p-1 border border-white/10">
                        <label className="flex cursor-pointer h-full items-center justify-center px-4 rounded-md bg-white/20 text-white text-xs font-bold transition-all shadow-sm">
                            <span>For You</span>
                            <input type="radio" name="feed_type" value="For You" className="hidden" defaultChecked />
                        </label>
                        <label className="flex cursor-pointer h-full items-center justify-center px-4 rounded-md text-white/60 hover:text-white text-xs font-medium transition-all">
                            <span>Following</span>
                            <input type="radio" name="feed_type" value="Following" className="hidden" />
                        </label>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex gap-2">
                    <button 
                        onClick={onPasscoClick}
                        className="flex items-center justify-center size-10 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-black/40 transition-colors focus:ring-2 focus:ring-primary group"
                        title="Passco"
                    >
                        <span className="material-symbols-outlined group-hover:text-blue-400 transition-colors">menu_book</span>
                    </button>
                    <button className="flex items-center justify-center size-10 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10 hover:bg-black/40 transition-colors focus:ring-2 focus:ring-primary">
                        <span className="material-symbols-outlined">more_vert</span>
                    </button>
                </div>
            </div>

            {/* Topic Info Tag */}
            <div className="mt-4 flex flex-col items-center justify-center text-center opacity-90 pointer-events-auto">
                <div className="px-3 py-1 bg-primary/80 backdrop-blur-md rounded-full text-xs font-bold tracking-wide uppercase mb-2 shadow-lg shadow-primary/20 border border-white/10">
                    {topic}
                </div>
                <h1 className="text-xl font-bold text-white drop-shadow-md font-display mb-1">{title}</h1>
                <p className="text-sm text-gray-200 font-medium drop-shadow-sm flex items-center gap-1 font-body">
                    with {authorName} 
                    <span className="material-symbols-outlined text-blue-400 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </p>
            </div>
        </div>
    );
};

export default TopNav;
