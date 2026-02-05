
import React from 'react';
import Card from '../common/Card';

const DiscoverPage: React.FC = () => {
    const categories = ['Physics', 'Coding', 'History', 'Math', 'Biology', 'Art'];
    const trending = [
        { id: 1, tag: '#QuantumLeap', views: '2.4B' },
        { id: 2, tag: '#ReactJS', views: '890M' },
        { id: 3, tag: '#SpaceX', views: '500M' },
        { id: 4, tag: '#HistoryFacts', views: '1.2B' },
    ];

    return (
        <div className="h-full w-full bg-background-dark text-white overflow-y-auto pb-24 pt-4">
            {/* Search Header */}
            <div className="px-4 mb-4 sticky top-0 bg-background-dark/95 backdrop-blur-md z-20 py-2">
                <div className="flex gap-3 items-center">
                    <div className="flex-1 relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 material-symbols-outlined">search</span>
                        <input 
                            type="text" 
                            placeholder="Search for lessons, users..." 
                            className="w-full bg-white/10 border border-white/5 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:bg-white/20 transition-colors"
                        />
                    </div>
                    <span className="material-symbols-outlined text-white/80">qr_code_scanner</span>
                </div>
            </div>

            {/* Carousel / Banner */}
            <div className="px-4 mb-6 overflow-x-auto scrollbar-hide flex gap-3">
                <div className="min-w-[85%] h-40 bg-gradient-to-r from-primary to-blue-600 rounded-xl p-5 flex flex-col justify-center relative overflow-hidden shadow-lg">
                    <div className="relative z-10">
                        <span className="bg-white/20 text-xs font-bold px-2 py-0.5 rounded text-white mb-2 inline-block">FEATURED</span>
                        <h3 className="text-xl font-bold font-display w-3/4">Master Relativity in 5 Mins</h3>
                        <button className="mt-3 bg-white text-black text-xs font-bold px-4 py-2 rounded-full">Start Path</button>
                    </div>
                    <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-white/10 rotate-12">science</span>
                </div>
                <div className="min-w-[85%] h-40 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-5 flex flex-col justify-center relative overflow-hidden shadow-lg">
                    <div className="relative z-10">
                        <span className="bg-white/20 text-xs font-bold px-2 py-0.5 rounded text-white mb-2 inline-block">LIVE EVENT</span>
                        <h3 className="text-xl font-bold font-display w-3/4">SpaceX Launch Party</h3>
                    </div>
                    <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-white/10 rotate-12">rocket_launch</span>
                </div>
            </div>

            {/* Trending Tags */}
            <div className="px-4 mb-6">
                <h3 className="font-bold text-white mb-3">Trending Now</h3>
                <div className="flex flex-wrap gap-2">
                    {trending.map(t => (
                        <div key={t.id} className="flex items-center gap-1 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                            <span className="text-primary font-bold">#</span>
                            <span className="text-sm font-medium">{t.tag.substring(1)}</span>
                            <span className="text-[10px] text-white/40 ml-1">{t.views}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Categories */}
            <div className="px-4 mb-2">
                <div className="flex overflow-x-auto scrollbar-hide gap-4 pb-2 border-b border-white/10">
                    {categories.map((c, i) => (
                        <button key={c} className={`whitespace-nowrap text-sm font-bold ${i === 0 ? 'text-white border-b-2 border-primary pb-2' : 'text-white/40'}`}>
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Masonry Grid Simulation */}
            <div className="px-2 grid grid-cols-2 gap-2">
                {[1,2,3,4,5,6].map(i => (
                    <div key={i} className={`relative rounded-lg overflow-hidden bg-white/5 ${i % 3 === 0 ? 'row-span-2 h-64' : 'h-40'}`}>
                        <img 
                            src={`https://picsum.photos/seed/${i + 100}/300/500`} 
                            className="w-full h-full object-cover opacity-80"
                            alt="Thumbnail"
                        />
                        <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-xs font-bold line-clamp-2">Understanding the basics of {categories[i % categories.length]}</p>
                            <div className="flex items-center gap-1 mt-1">
                                <div className="size-4 bg-white/20 rounded-full"></div>
                                <span className="text-[10px] text-white/70">User{i}</span>
                                <span className="flex-1 text-right text-[10px] flex items-center justify-end gap-0.5">
                                    <span className="material-symbols-outlined text-[10px]">favorite_border</span>
                                    {100 * i}k
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DiscoverPage;
