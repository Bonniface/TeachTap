
import React, { useState } from 'react';

const ProfilePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('videos');

    return (
        <div className="h-full w-full bg-background-dark text-white overflow-y-auto pb-24">
            {/* Top Bar */}
            <div className="sticky top-0 z-20 flex justify-between items-center px-4 py-3 bg-background-dark/90 backdrop-blur-sm border-b border-white/5">
                <span className="material-symbols-outlined">person_add</span>
                <div className="flex items-center gap-1 font-bold">
                    <span>Student User</span>
                    <span className="material-symbols-outlined text-sm">expand_more</span>
                </div>
                <span className="material-symbols-outlined">more_horiz</span>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col items-center pt-6 pb-6 border-b border-white/5">
                <div className="relative mb-4">
                    <div className="size-24 rounded-full bg-gradient-to-br from-primary to-purple-600 p-0.5">
                        <img 
                            src="https://i.pravatar.cc/300?u=me" 
                            className="w-full h-full rounded-full object-cover border-4 border-background-dark"
                            alt="Profile"
                        />
                    </div>
                </div>

                <h1 className="text-xl font-bold font-display mb-1">@student_dev</h1>
                <div className="flex items-center gap-4 text-sm mb-4">
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-lg">142</span>
                        <span className="text-white/50 text-xs">Following</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-lg">5.2k</span>
                        <span className="text-white/50 text-xs">Followers</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-lg">12k</span>
                        <span className="text-white/50 text-xs">Likes</span>
                    </div>
                </div>

                <div className="flex gap-2 mb-4">
                    <button className="px-8 py-2.5 bg-white/10 border border-white/10 rounded-md text-sm font-bold hover:bg-white/20 transition-colors">Edit Profile</button>
                    <button className="px-3 py-2.5 bg-white/10 border border-white/10 rounded-md flex items-center justify-center hover:bg-white/20 transition-colors">
                        <span className="material-symbols-outlined text-lg">bookmark</span>
                    </button>
                </div>

                <p className="text-sm text-center px-8 text-white/80">
                    🎓 Learning Physics & React <br/>
                    🔥 5 Day Streak | Level 3 Scholar
                </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 sticky top-[53px] bg-background-dark z-10">
                <button 
                    onClick={() => setActiveTab('videos')}
                    className={`flex-1 py-3 flex justify-center items-center ${activeTab === 'videos' ? 'border-b-2 border-white text-white' : 'text-white/40'}`}
                >
                    <span className="material-symbols-outlined">grid_view</span>
                </button>
                <button 
                    onClick={() => setActiveTab('likes')}
                    className={`flex-1 py-3 flex justify-center items-center ${activeTab === 'likes' ? 'border-b-2 border-white text-white' : 'text-white/40'}`}
                >
                    <span className="material-symbols-outlined" style={activeTab === 'likes' ? {} : {fontVariationSettings: "'FILL' 0"}}>favorite</span>
                </button>
                <button 
                    onClick={() => setActiveTab('private')}
                    className={`flex-1 py-3 flex justify-center items-center ${activeTab === 'private' ? 'border-b-2 border-white text-white' : 'text-white/40'}`}
                >
                    <span className="material-symbols-outlined">lock</span>
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-0.5">
                {[1,2,3,4,5,6,7,8,9].map(i => (
                    <div key={i} className="aspect-[3/4] bg-white/5 relative group cursor-pointer">
                        <img 
                            src={`https://picsum.photos/seed/${i + 200}/200/300`} 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                            alt="Video"
                        />
                        <div className="absolute bottom-1 left-2 flex items-center gap-1">
                            <span className="material-symbols-outlined text-white text-[12px]">play_arrow</span>
                            <span className="text-[10px] font-bold">{100 + i * 5}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfilePage;
