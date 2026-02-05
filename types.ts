
export interface Author {
    name: string;
    avatarUrl: string;
    isVerified: boolean;
}

export interface FeedStats {
    likes: string;
    comments: string;
    shares: string;
}

export interface FeedItemData {
    id: string;
    topic: string;
    title: string;
    description: string;
    videoPosterUrl: string; // Remote URL
    localPosterUrl?: string; // Blob URL for offline
    author: Author;
    stats: FeedStats;
    transcript: string[];
    isDownloaded?: boolean;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
    hint?: string;
}

export interface Note {
    id: string;
    timestamp: string;
    content: string;
    createdAt: Date;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    progress: number;
    maxProgress: number;
    isUnlocked: boolean;
    color: string;
}

export interface PathStep {
    id: string;
    title: string;
    description: string;
    duration: string;
    isCompleted: boolean;
    isLocked: boolean;
}

export interface LearningPath {
    id: string;
    topic: string;
    title: string;
    description: string;
    totalSteps: number;
    completedSteps: number;
    steps: PathStep[];
    coverImage?: string;
}

export enum LoadingState {
    IDLE = 'IDLE',
    LOADING = 'LOADING',
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR'
}

export interface SyncAction {
    id: string;
    type: 'QUIZ_COMPLETE' | 'XP_GAIN';
    payload: any;
    timestamp: number;
}
