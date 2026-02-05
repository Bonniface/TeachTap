
import React, { useState, useEffect } from 'react';
import VideoBackground from './components/VideoBackground';
import TopNav from './components/TopNav';
import ActionSidebar from './components/ActionSidebar';
import BottomPanel from './components/BottomPanel';
import QuizModal from './components/QuizModal';
import NotesModal from './components/features/NotesModal';
import StreaksModal from './components/features/StreaksModal';
import LearningPathsModal from './components/features/LearningPathsModal';
import DeveloperPortalModal from './components/features/DeveloperPortalModal';
import TimeBackModal from './components/features/TimeBackModal';
import UploadVideoModal from './components/features/UploadVideoModal';
import { generateQuizForTopic } from './services/geminiService';
import { offlineService } from './services/offlineService';
import { useLiveGemini } from './hooks/useLiveGemini';
import { useOffline } from './hooks/useOffline';
import { FeedItemData, LoadingState, QuizQuestion, Note, Achievement, SyncAction, LearningPath, PathStep } from './types';

// Mock Data for the Feed
const MOCK_FEED_ITEM: FeedItemData = {
  id: '1',
  topic: 'Physics 101',
  title: 'Relativity Basics',
  description: 'Learn the basics of special relativity with Albert Einstein.',
  videoPosterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVclnW6Hm-h9-mBVYNMh4CZE6RIAIZ-M-OFEqUD7gByDWbJZoa63-lawZSy2ZAOoaCzk2SWl7BK8MXBSU7gZtcNoMGX0XaC7XUNJNdiPnb6DWC297Yb6hjbMhCjiDQ5HNzzOTC6Dqmvoj6ioFyPqk08oe6QdKbgeSXKgw7NIYcBD9U44hrbynC65GyRaJo_0JFdJbnrFr1heuC_Vf9vyKE2iFKxgPWqTcJggr22PYPIPrMlgfWBynuNTd9S9whMcTCqEUGdYJhnmg',
  author: {
    name: 'Albert Einstein',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-Tw2-YnT2oD1h8L4S6kVMdGWRwSpBVgYl8FpzkTjBwHtYre9yLHhbJ5zXHLlTGdDhQz8N1Z3RAhrITifNYGoJECrLQVB3gwcisv6B5JNuQbLp1DyDQelcV8KeR3CZkcQiiR6nQKTSFs0l2ubab2X1uanB7fT-ShAHmKtekKbXATouQhs3siRIzJiaD3sS9_C6cU7ID5y-B1C52EumwQpZpmSHBQMpFZTLSPJ7v4AD081xygTpklk-AztQrRzGJuoEOZ31Pkb55Sk',
    isVerified: true
  },
  stats: {
    likes: '12.5k',
    comments: '342',
    shares: '1.2k'
  },
  transcript: [
    "<span class='text-primary font-bold'>E=mc²</span> explains that energy equals mass times the speed of light squared. This means a small amount of mass can be converted into a tremendous amount of energy.",
    "Wait, let's break that down further. The speed of light is a constant, approximately 300,000 km per second.",
    "This fundamental equation changed how we understand the universe, linking matter and energy inextricably.",
    "In simple terms, mass is just a super-concentrated form of energy waiting to be released."
  ]
};

const SYSTEM_INSTRUCTION = `You are Albert Einstein, the famous physicist. 
You are teaching a short class on Relativity. 
You are witty, slightly eccentric, but extremely brilliant and encouraging.
Keep your answers relatively short (under 2 sentences) to keep the conversation flowing.
Use analogies.`;

// Mock Achievements
const INITIAL_ACHIEVEMENTS: Achievement[] = [
    {
        id: '1',
        title: 'Quiz Whiz',
        description: 'Get a perfect score on 5 quizzes',
        icon: 'psychology',
        progress: 3,
        maxProgress: 5,
        isUnlocked: false,
        color: 'purple'
    },
    {
        id: '2',
        title: 'Social Butterfly',
        description: 'Share 3 videos with friends',
        icon: 'share',
        progress: 1,
        maxProgress: 3,
        isUnlocked: false,
        color: 'blue'
    },
    {
        id: '3',
        title: 'Night Owl',
        description: 'Complete a study session after 8 PM',
        icon: 'bedtime',
        progress: 1,
        maxProgress: 1,
        isUnlocked: true,
        color: 'indigo'
    },
    {
        id: '4',
        title: 'Curious Mind',
        description: 'Ask 10 questions to the AI tutor',
        icon: 'chat',
        progress: 4,
        maxProgress: 10,
        isUnlocked: false,
        color: 'green'
    }
];

// Mock Learning Paths
const INITIAL_PATHS: LearningPath[] = [
    {
        id: '101',
        topic: 'Computer Science',
        title: 'Interview Prep: Algorithms',
        description: 'Master the top 5 coding interview patterns.',
        totalSteps: 5,
        completedSteps: 2,
        steps: [
            { id: 's1', title: 'Big O Notation', description: 'Understanding time complexity', duration: '5 min', isCompleted: true, isLocked: false },
            { id: 's2', title: 'Arrays & Strings', description: 'Sliding window technique', duration: '8 min', isCompleted: true, isLocked: false },
            { id: 's3', title: 'Linked Lists', description: 'Two pointer method', duration: '6 min', isCompleted: false, isLocked: false },
            { id: 's4', title: 'Trees & Graphs', description: 'DFS and BFS traversals', duration: '10 min', isCompleted: false, isLocked: true },
            { id: 's5', title: 'Dynamic Programming', description: 'Memoization basics', duration: '12 min', isCompleted: false, isLocked: true }
        ]
    }
];

const App: React.FC = () => {
  const { isOnline, isOffline } = useOffline();
  
  // Data State
  const [currentFeedItem, setCurrentFeedItem] = useState<FeedItemData>(MOCK_FEED_ITEM);
  
  // Modal States
  const [showQuiz, setShowQuiz] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showStreaks, setShowStreaks] = useState(false);
  const [showPaths, setShowPaths] = useState(false);
  const [showDevPortal, setShowDevPortal] = useState(false);
  const [showTimeBack, setShowTimeBack] = useState(false);
  const [showUpload, setShowUpload] = useState(false); // New State
  
  // Logic State
  const [quizData, setQuizData] = useState<QuizQuestion | null>(null);
  const [quizLoadingState, setQuizLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  
  // Gamification & User Data
  const [streak, setStreak] = useState(5); 
  const [xp, setXp] = useState(1200);
  const [notes, setNotes] = useState<Note[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(INITIAL_PATHS);

  // UI State
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  // Live API Hook
  const { connect, disconnect, connected, isSpeaking, transcripts } = useLiveGemini(SYSTEM_INSTRUCTION);

  // Initialize: Check for offline videos if offline, or sync pending actions if online
  useEffect(() => {
    const init = async () => {
        if (isOnline) {
            // 1. Sync pending offline actions
            await offlineService.processSyncQueue(handleSyncAction);
            // 2. Load online feed (Mock for now)
            // Keep default mock feed item unless paths override it
        } else {
            // Offline mode: Load downloaded videos
            try {
                const downloaded = await offlineService.getAllDownloadedVideos();
                if (downloaded.length > 0) {
                    setCurrentFeedItem(downloaded[0]); 
                }
            } catch (e) {
                console.error("Error loading offline videos", e);
            }
        }
        
        // Check if current item is already downloaded (to update UI)
        if (isOnline) {
            const downloaded = await offlineService.getAllDownloadedVideos();
            const isSaved = downloaded.some(d => d.id === currentFeedItem.id);
            setCurrentFeedItem(prev => ({ ...prev, isDownloaded: isSaved }));
        }
    };
    init();
  }, [isOnline]);

  const handleSyncAction = (action: SyncAction) => {
      // Replay actions logic
      if (action.type === 'XP_GAIN') {
          setXp(prev => prev + action.payload.amount);
      }
      // Add other action handlers here
  };

  const handleDownloadClick = async () => {
      if (currentFeedItem.isDownloaded) {
          // Remove
          await offlineService.removeVideo(currentFeedItem.id);
          setCurrentFeedItem(prev => ({ ...prev, isDownloaded: false }));
      } else {
          // Add
          try {
              await offlineService.saveVideo(currentFeedItem);
              setCurrentFeedItem(prev => ({ ...prev, isDownloaded: true }));
          } catch (e: any) {
              alert(e.message || "Failed to download");
          }
      }
  };

  const handleQuizClick = async () => {
    if (quizData) {
        setShowQuiz(true);
        return;
    }

    setQuizLoadingState(LoadingState.LOADING);
    
    try {
        if (isOffline) {
            const mockOfflineQuiz = {
                 question: "What concept links Energy and Mass?",
                 options: ["Gravity", "Relativity", "Magnetism", "Force"],
                 correctAnswerIndex: 1,
                 explanation: "Special relativity demonstrates that mass and energy are equivalent."
            };
            setQuizData(mockOfflineQuiz);
        } else {
             const context = currentFeedItem.transcript.join(" ");
             const data = await generateQuizForTopic(currentFeedItem.topic, context);
             setQuizData(data);
        }
        setQuizLoadingState(LoadingState.SUCCESS);
        setShowQuiz(true);
    } catch (error) {
        console.error(error);
        setQuizLoadingState(LoadingState.ERROR);
    }
  };

  const toggleLive = () => {
    if (isOffline) {
        alert("Live Chat requires an internet connection.");
        return;
    }
    if (connected) {
        disconnect();
    } else {
        connect();
    }
  };

  const handleSaveNote = (content: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      content,
      timestamp: "0:45",
      createdAt: new Date()
    };
    setNotes([newNote, ...notes]);
  };

  const handleQuizComplete = async (points: number) => {
      const updateState = () => {
          setXp(prev => prev + points);
          if (points >= 100) {
            setAchievements(prev => prev.map(ach => {
                if (ach.id === '1' && !ach.isUnlocked) {
                    const newProgress = ach.progress + 1;
                    return {
                        ...ach,
                        progress: newProgress,
                        isUnlocked: newProgress >= ach.maxProgress
                    };
                }
                return ach;
            }));
        }
      };

      updateState();

      // Handle Sync Logic
      if (isOffline) {
          await offlineService.queueSyncAction({
              type: 'XP_GAIN',
              payload: { amount: points }
          });
      }
  };

  // Learning Paths Handlers
  const handleAddPath = (path: LearningPath) => {
      setLearningPaths(prev => [path, ...prev]);
  };

  const handleSelectStep = (pathId: string, step: PathStep) => {
      // Simulate playing the selected step's content
      setCurrentFeedItem(prev => ({
          ...prev,
          topic: "Learning Path: " + pathId,
          title: step.title,
          description: step.description,
          // In a real app, this would fetch the actual video ID associated with the step
      }));
  };

  return (
    <div className="bg-background-dark text-white font-display overflow-hidden h-screen w-full relative select-none">
      
      {/* Offline Indicator Banner */}
      {isOffline && (
          <div className="absolute top-0 inset-x-0 z-50 bg-orange-500 text-white text-xs font-bold text-center py-1">
              OFFLINE MODE • VIEWING DOWNLOADED CONTENT
          </div>
      )}

      {/* Video Layer */}
      <VideoBackground 
        // Use local blob URL if available (offline), otherwise remote
        posterUrl={currentFeedItem.localPosterUrl || currentFeedItem.videoPosterUrl} 
        altText={`Video about ${currentFeedItem.title}`} 
      />

      {/* Top Nav Layer */}
      <TopNav 
        topic={currentFeedItem.topic}
        title={currentFeedItem.title}
        authorName={currentFeedItem.author.name}
        streak={streak}
        onStreakClick={() => setShowStreaks(true)}
        onPathsClick={() => setShowPaths(true)}
        onDevClick={() => setShowDevPortal(true)}
        onTimeBackClick={() => setShowTimeBack(true)}
        onUploadClick={() => setShowUpload(true)}
      />

      {/* Right Actions Layer */}
      <ActionSidebar 
        author={currentFeedItem.author}
        stats={currentFeedItem.stats}
        isDownloaded={currentFeedItem.isDownloaded}
        onNoteClick={() => setShowNotes(true)}
        onDownloadClick={handleDownloadClick}
      />

      {/* Video Progress Bar */}
      <div className={`absolute bottom-[26%] w-full z-20 px-2 pointer-events-none transition-opacity duration-300 ${isPanelExpanded ? 'opacity-0' : 'opacity-100'}`}>
        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <div className="h-full bg-primary w-[45%] rounded-full shadow-[0_0_10px_rgba(140,37,244,0.8)] relative">
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 size-2 bg-white rounded-full shadow-md"></div>
            </div>
        </div>
        <div className="flex justify-between px-1 mt-1">
            <span className="text-[10px] font-medium text-white/80 drop-shadow-md">0:45</span>
            <span className="text-[10px] font-medium text-white/80 drop-shadow-md">1:30</span>
        </div>
      </div>

      {/* Bottom Panel Layer */}
      <BottomPanel 
        transcript={currentFeedItem.transcript}
        onQuizClick={handleQuizClick}
        quizLoadingState={quizLoadingState}
        isLiveConnected={connected}
        isLiveSpeaking={isSpeaking}
        liveTranscripts={transcripts}
        onToggleLive={toggleLive}
        onExpandChange={setIsPanelExpanded}
      />

      {/* Visual Separator Gradient */}
      <div className="absolute bottom-0 inset-x-0 h-1 w-full bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-40"></div>

      {/* Quiz Modal Overlay */}
      {showQuiz && quizData && (
        <QuizModal 
            quizData={quizData} 
            onClose={() => setShowQuiz(false)}
            onComplete={handleQuizComplete}
        />
      )}

      {/* Notes Modal Overlay */}
      {showNotes && (
        <NotesModal 
            notes={notes}
            onSaveNote={handleSaveNote}
            onClose={() => setShowNotes(false)}
            currentTime="0:45"
        />
      )}

      {/* Streaks Modal Overlay */}
      {showStreaks && (
        <StreaksModal 
            streak={streak}
            xp={xp}
            achievements={achievements}
            onClose={() => setShowStreaks(false)}
        />
      )}

      {/* Learning Paths Modal */}
      {showPaths && (
          <LearningPathsModal
              paths={learningPaths}
              onClose={() => setShowPaths(false)}
              onAddPath={handleAddPath}
              onSelectStep={handleSelectStep}
          />
      )}

      {/* Developer Portal Modal */}
      {showDevPortal && (
          <DeveloperPortalModal 
              onClose={() => setShowDevPortal(false)}
          />
      )}

       {/* TimeBack Copilot Modal */}
       {showTimeBack && (
          <TimeBackModal 
              onClose={() => setShowTimeBack(false)}
          />
      )}

      {/* Upload Video Modal */}
      {showUpload && (
          <UploadVideoModal 
              onClose={() => setShowUpload(false)}
          />
      )}
    </div>
  );
};

export default App;
