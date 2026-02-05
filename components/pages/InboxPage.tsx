
import React from 'react';

const InboxPage: React.FC = () => {
    const activities = [
        { id: 1, type: 'like', user: 'Elon Musk', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-Tw2-YnT2oD1h8L4S6kVMdGWRwSpBVgYl8FpzkTjBwHtYre9yLHhbJ5zXHLlTGdDhQz8N1Z3RAhrITifNYGoJECrLQVB3gwcisv6B5JNuQbLp1DyDQelcV8KeR3CZkcQiiR6nQKTSFs0l2ubab2X1uanB7fT-ShAHmKtekKbXATouQhs3siRIzJiaD3sS9_C6cU7ID5y-B1C52EumwQpZpmSHBQMpFZTLSPJ7v4AD081xygTpklk-AztQrRzGJuoEOZ31Pkb55Sk', text: 'liked your comment: "Relativity is cool!"', time: '2m' },
        { id: 2, type: 'follow', user: 'Neil deGrasse Tyson', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVclnW6Hm-h9-mBVYNMh4CZE6RIAIZ-M-OFEqUD7gByDWbJZoa63-lawZSy2ZAOoaCzk2SWl7BK8MXBSU7gZtcNoMGX0XaC7XUNJNdiPnb6DWC297Yb6hjbMhCjiDQ5HNzzOTC6Dqmvoj6ioFyPqk08oe6QdKbgeSXKgw7NIYcBD9U44hrbynC65GyRaJo_0JFdJbnrFr1heuC_Vf9vyKE2iFKxgPWqTcJggr22PYPIPrMlgfWBynuNTd9S9whMcTCqEUGdYJhnmg', text: 'started following you', time: '1h' },
        { id: 3, type: 'system', user: 'TeachTap', avatar: '', text: 'You reached a 5 day streak! 🔥', time: '5h' },
        { id: 4, type: 'mention', user: 'Sarah Code', avatar: 'https://i.pravatar.cc/150?u=sarah', text: 'mentioned you in a comment', time: '1d' },
    ];

    return (
        <div className="h-full w-full bg-background-dark text-white overflow-y-auto pb-24">
            {/* Header */}
            <div className="sticky top-0 bg-background-dark/95 backdrop-blur-md z-20 px-4 py-4 border-b border-white/5 flex justify-center items-center">
                <h2 className="text-lg font-bold font-display">Activity</h2>
                <div className="absolute right-4">
                    <span className="material-symbols-outlined text-white/80">send</span>
                </div>
            </div>

            {/* List */}
            <div className="px-4 py-2">
                <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4 mt-2">New</p>
                
                <div className="space-y-6">
                    {activities.map(activity => (
                        <div key={activity.id} className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="relative">
                                {activity.type === 'system' ? (
                                    <div className="size-12 rounded-full bg-primary flex items-center justify-center">
                                        <span className="material-symbols-outlined text-white">school</span>
                                    </div>
                                ) : (
                                    <img src={activity.avatar} className="size-12 rounded-full object-cover border border-white/10" alt="Avatar" />
                                )}
                                
                                {activity.type === 'like' && (
                                    <div className="absolute -bottom-1 -right-1 bg-black p-0.5 rounded-full">
                                        <div className="size-4 bg-red-500 rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[10px] text-white">favorite</span>
                                        </div>
                                    </div>
                                )}
                                {activity.type === 'follow' && (
                                    <div className="absolute -bottom-1 -right-1 bg-black p-0.5 rounded-full">
                                        <div className="size-4 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[10px] text-white">person_add</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-white line-clamp-2">
                                    <span className="font-bold mr-1">{activity.user}</span>
                                    <span className="text-white/80">{activity.text}</span>
                                </p>
                                <p className="text-xs text-white/40 mt-0.5">{activity.time}</p>
                            </div>

                            {/* Action */}
                            {activity.type === 'follow' ? (
                                <button className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-md">Follow Back</button>
                            ) : (
                                <div className="size-10 bg-white/5 rounded-md">
                                    {/* Thumbnail preview would go here */}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InboxPage;
