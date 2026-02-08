
import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

interface ArenaModalProps {
    onClose: () => void;
}

const LEADERBOARD = [
    { rank: 1, name: 'QuantumMaster', xp: 12450, avatar: 'https://i.pravatar.cc/100?u=1' },
    { rank: 2, name: 'PhysicsPro', xp: 11200, avatar: 'https://i.pravatar.cc/100?u=2' },
    { rank: 3, name: 'ReactWizard', xp: 10850, avatar: 'https://i.pravatar.cc/100?u=3' },
    { rank: 4, name: 'HistoryBuff', xp: 9500, avatar: 'https://i.pravatar.cc/100?u=4' },
    { rank: 5, name: 'AILearner', xp: 8200, avatar: 'https://i.pravatar.cc/100?u=5' },
];

const ArenaModal: React.FC<ArenaModalProps> = ({ onClose }) => {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-lg h-[85vh] flex flex-col overflow-hidden bg-[#0A0A0E] border-white/10 shadow-[0_0_50px_rgba(140,37,244,0.15)]" padding="none">
                {/* Animated Header */}
                <div className="p-6 border-b border-white/5 relative overflow-hidden flex justify-between items-center bg-gradient-to-r from-primary/20 to-transparent">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <div className="relative z-10 flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(140,37,244,0.6)]">
                            <span className="material-symbols-outlined text-white text-3xl">swords</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold font-display text-white tracking-tight">Arena</h2>
                            <p className="text-xs text-primary-300 font-mono tracking-widest uppercase">Global Proving Ground</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="relative z-10 text-white/40 hover:text-white transition-colors bg-white/5 p-2 rounded-full">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-8">
                    
                    {/* Active Challenge Card */}
                    <div className="p-1 rounded-3xl bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 shadow-2xl">
                        <div className="bg-[#0A0A0E] rounded-[22px] p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[120px]">bolt</span>
                            </div>
                            <div className="relative z-10">
                                <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-md mb-4 inline-block tracking-widest">LIVE BATTLE</span>
                                <h3 className="text-2xl font-bold text-white mb-2">Weekend Sprint: Astrophysics</h3>
                                <p className="text-sm text-white/60 mb-6 leading-relaxed">Compete against 1.2k scholars. Top 10 win exclusive "Stellar" badges.</p>
                                <Button size="lg" className="bg-white text-black hover:bg-gray-100 font-bold px-10 shadow-lg">
                                    Join Battle
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                            <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <span className="material-symbols-outlined">military_tech</span>
                            </div>
                            <div>
                                <div className="text-lg font-bold">#42</div>
                                <div className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Global Rank</div>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
                            <div className="size-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                                <span className="material-symbols-outlined">emoji_events</span>
                            </div>
                            <div>
                                <div className="text-lg font-bold">12</div>
                                <div className="text-[10px] text-white/40 uppercase font-bold tracking-wider">Victories</div>
                            </div>
                        </div>
                    </div>

                    {/* Leaderboard */}
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-white text-lg font-display">Top Scholars</h3>
                            <button className="text-xs text-primary font-bold hover:underline">View All</button>
                        </div>
                        <div className="space-y-3">
                            {LEADERBOARD.map((user, i) => (
                                <div key={user.rank} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                                    i === 0 ? 'bg-primary/10 border-primary/30 shadow-lg' : 'bg-white/5 border-white/5 hover:bg-white/10'
                                }`}>
                                    <div className={`size-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                        i === 0 ? 'bg-yellow-500 text-black' : 
                                        i === 1 ? 'bg-gray-300 text-black' : 
                                        i === 2 ? 'bg-orange-400 text-black' : 'text-white/40'
                                    }`}>
                                        {user.rank}
                                    </div>
                                    <img src={user.avatar} className="size-10 rounded-full border border-white/10" alt="" />
                                    <div className="flex-1">
                                        <div className="font-bold text-sm">{user.name}</div>
                                        <div className="text-[10px] text-white/40">{i === 0 ? 'Legendary Tier' : 'Elite Tier'}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-mono font-bold text-primary">{user.xp.toLocaleString()}</div>
                                        <div className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Points</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/5 bg-[#0A0A0E] flex gap-3">
                    <Button variant="secondary" fullWidth className="bg-white/5 border-white/10 text-white">Friend Duel</Button>
                    <Button fullWidth>Global Matchmaking</Button>
                </div>
            </Card>
        </div>
    );
};

export default ArenaModal;
