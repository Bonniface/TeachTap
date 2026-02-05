
import React from 'react';

interface BottomNavBarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    onUpload: () => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabChange, onUpload }) => {
    const navItemClass = (tab: string) => `flex flex-col items-center gap-1 p-2 transition-colors ${activeTab === tab ? 'text-white' : 'text-white/60 hover:text-white'}`;
    const iconClass = (filled: boolean) => `material-symbols-outlined text-[26px] ${filled ? 'font-bold' : ''}`;

    return (
        <div className="absolute bottom-0 inset-x-0 z-50 h-[60px] bg-black border-t border-white/10 flex items-center justify-between px-6 pb-2 pt-1 select-none">
            <button className={navItemClass('home')} onClick={() => onTabChange('home')}>
                <span className={iconClass(activeTab === 'home')} style={activeTab === 'home' ? { fontVariationSettings: "'FILL' 1" } : {}}>home</span>
                <span className="text-[10px] font-medium tracking-wide">Home</span>
            </button>

            <button className={navItemClass('discover')} onClick={() => onTabChange('discover')}>
                <span className={iconClass(activeTab === 'discover')}>explore</span>
                <span className="text-[10px] font-medium tracking-wide">Discover</span>
            </button>

            {/* Create Button */}
            <button className="relative group px-2" onClick={onUpload}>
                <div className="w-[45px] h-[30px] bg-white rounded-lg flex items-center justify-center relative z-10 group-active:scale-95 transition-transform">
                    <span className="material-symbols-outlined text-black text-2xl font-bold">add</span>
                </div>
                 {/* TikTok Style Offset Effect */}
                <div className="absolute left-[11px] top-0 w-[45px] h-[30px] bg-cyan-400 rounded-lg -z-0 translate-x-[-3px] opacity-90"></div>
                <div className="absolute left-[11px] top-0 w-[45px] h-[30px] bg-red-500 rounded-lg -z-0 translate-x-[3px] opacity-90"></div>
            </button>

            <button className={navItemClass('inbox')} onClick={() => onTabChange('inbox')}>
                <span className={iconClass(activeTab === 'inbox')}>chat_bubble_outline</span>
                <span className="text-[10px] font-medium tracking-wide">Inbox</span>
            </button>

            <button className={navItemClass('profile')} onClick={() => onTabChange('profile')}>
                <span className={iconClass(activeTab === 'profile')}>person</span>
                <span className="text-[10px] font-medium tracking-wide">Me</span>
            </button>
        </div>
    );
};

export default BottomNavBar;
