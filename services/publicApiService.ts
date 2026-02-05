
// Mock data store for API simulation
export const publicApiService = {
    async searchVideos(query: string): Promise<any> {
        // Simulate network delay
        await new Promise(r => setTimeout(r, 600));
        
        const mockDb = [
            { id: '1', title: 'Relativity Basics', topic: 'Physics', educator: 'Albert Einstein', views: 12500 },
            { id: '2', title: 'Introduction to React', topic: 'Programming', educator: 'Dan Abramov', views: 45000 },
            { id: '3', title: 'Sourdough Starters', topic: 'Cooking', educator: 'Joshua Weissman', views: 8900 }
        ];

        const results = query 
            ? mockDb.filter(v => 
                v.title.toLowerCase().includes(query.toLowerCase()) || 
                v.topic.toLowerCase().includes(query.toLowerCase())
              )
            : mockDb;

        return {
            status: 200,
            data: {
                count: results.length,
                results: results
            }
        };
    },

    async getUserProgress(userId: string): Promise<any> {
        await new Promise(r => setTimeout(r, 600));
        return {
            status: 200,
            data: {
                userId,
                level: "Scholar Lvl 3",
                xp: 1250,
                currentStreak: 5,
                completedPaths: ['101'],
                achievements: ['Quiz Whiz', 'Night Owl']
            }
        };
    },

    async submitQuizAnswer(payload: { videoId: string, answerIndex: number }): Promise<any> {
        await new Promise(r => setTimeout(r, 800));
        const isCorrect = payload.answerIndex === 1; // Mock validation
        return {
            status: 200,
            data: {
                correct: isCorrect,
                xpAwarded: isCorrect ? 100 : 0,
                streakBonus: isCorrect ? 10 : 0
            }
        };
    },

    async createSmartPlaylist(payload: { name: string, topics: string[] }): Promise<any> {
        await new Promise(r => setTimeout(r, 800));
        return {
            status: 201,
            message: "Playlist created successfully",
            data: {
                id: 'pl_' + Date.now().toString(36),
                name: payload.name,
                itemCount: 15,
                estimatedDuration: "45 mins",
                shareUrl: `teachtap.app/playlist/${Date.now().toString(36)}`
            }
        };
    }
};
