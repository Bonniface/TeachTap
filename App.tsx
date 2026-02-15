
import React, { useState, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import VideoBackground from './components/VideoBackground.tsx';
import TopNav from './components/TopNav.tsx';
import ActionSidebar from './components/ActionSidebar.tsx';
import BottomPanel from './components/BottomPanel.tsx';
import QuizModal from './components/QuizModal.tsx';
import NotesModal from './components/features/NotesModal.tsx';
import StreaksModal from './components/features/StreaksModal.tsx';
import LearningPathsModal from './components/features/LearningPathsModal.tsx';
import DeveloperPortalModal from './components/features/DeveloperPortalModal.tsx';
import TimeBackModal from './components/features/TimeBackModal.tsx';
import UploadVideoModal from './components/features/UploadVideoModal.tsx';
import ArenaModal from './components/features/ArenaModal.tsx';
import PasscoModal from './components/features/PasscoModal.tsx';
import BottomNavBar from './components/BottomNavBar.tsx';
import DiscoverPage from './components/pages/DiscoverPage.tsx';
import InboxPage from './components/pages/InboxPage.tsx';
import ProfilePage from './components/pages/ProfilePage.tsx';
import { generateQuizForTopic } from './services/geminiService.ts';
import { offlineService } from './services/offlineService.ts';
import { useLiveGemini } from './hooks/useLiveGemini.ts';
import { useOffline } from './hooks/useOffline.ts';
import { FeedItemData, LoadingState, QuizQuestion, Note, Achievement, SyncAction, LearningPath, PathStep } from './types.ts';

// Extended Mock Feed - Base items with actual video loops
const MOCK_FEED_BASE: FeedItemData[] = [
    {
      id: '1',
      topic: 'Physics 101',
      title: 'Relativity Basics',
      description: 'Learn the basics of special relativity with Albert Einstein.',
      videoPosterUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVclnW6Hm-h9-mBVYNMh4CZE6RIAIZ-M-OFEqUD7gByDWbJZoa63-lawZSy2ZAOoaCzk2SWl7BK8MXBSU7gZtcNoMGX0XaC7XUNJNdiPnb6DWC297Yb6hjbMhCjiDQ5HNzzOTC6Dqmvoj6ioFyPqk08oe6QdKbgeSXKgw7NIYcBD9U44hrbynC65GyRaJo_0JFdJbnrFr1heuC_Vf9vyKE2iFKxgPWqTcJggr22PYPIPrMlgfWBynuNTd9S9whMcTCqEUGdYJhnmg',
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      author: {
        name: 'Albert Einstein',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-Tw2-YnT2oD1h8L4S6kVMdGWRwSpBVgYl8FpzkTjBwHtYre9yLHhbJ5zXHLlTGdDhQz8N1Z3RAhrITifNYGoJECrLQVB3gwcisv6B5JNuQbLp1DyDQelcV8KeR3CZkcQiiR6nQKTSFs0l2ubab2X1uanB7fT-ShAHmKtekKbXATouQhs3siRIzJiaD3sS9_C6cU7ID5y-B1C52EumwQpZpmSHBQMpFZTLSPJ7v4AD081xygTpklk-AztQrRzGJuoEOZ31Pkb55Sk',
        isVerified: true,
        isSubscribed: false
      },
      stats: { likes: '12.5k', comments: '342', shares: '1.2k' },
      transcript: ["<span class='text-primary font-bold'>E=mc²</span> explains that energy equals mass times the speed of light squared.", "The speed of light is a constant, approximately 300,000 km per second.", "In simple terms, mass is just a super-concentrated form of energy waiting to be released."]
    },
    {
      id: '2',
      topic: 'Astronomy',
      title: 'Black Holes 101',
      description: 'Understanding the event horizon.',
      videoPosterUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2011&auto=format&fit=crop',
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      author: {
        name: 'Neil Tyson',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVclnW6Hm-h9-mBVYNMh4CZE6RIAIZ-M-OFEqUD7gByDWbJZoa63-lawZSy2ZAOoaCzk2SWl7BK8MXBSU7gZtcNoMGX0XaC7XUNJNdiPnb6DWC297Yb6hjbMhCjiDQ5HNzzOTC6Dqmvoj6ioFyPqk08oe6QdKbgeSXKgw7NIYcBD9U44hrbynC65GyRaJo_0JFdJbnrFr1heuC_Vf9vyKE2iFKxgPWqTcJggr22PYPIPrMlgfWBynuNTd9S9whMcTCqEUGdYJhnmg',
        isVerified: true,
        isSubscribed: false
      },
      stats: { likes: '45k', comments: '1.2k', shares: '5k' },
      transcript: ["A black hole is a region of spacetime where gravity is so strong that nothing can escape.", "The event horizon is the point of no return.", "Singularity lies at the center."]
    }
];

const MOCK_FEED: FeedItemData[] = [...MOCK_FEED_BASE];

const SYSTEM_INSTRUCTION = `You are a helpful AI tutor. You are witty, slightly eccentric, but extremely brilliant and encouraging. Keep your answers relatively short (under 2 sentences) to keep the conversation flowing.`;

const INITIAL_ACHIEVEMENTS: Achievement[] = [
    { id: '1', title: 'Quiz Whiz', description: 'Get a perfect score on 5 quizzes', icon: 'psychology', progress: 3, maxProgress: 5, isUnlocked: false, color: 'purple' },
    { id: '2', title: 'Social Butterfly', description: 'Share 3 videos with friends', icon: 'share', progress: 1, maxProgress: 3, isUnlocked: false, color: 'blue' },
    { id: '3', title: 'Night Owl', description: 'Complete a study session after 8 PM', icon: 'bedtime', progress: 1, maxProgress: 1, isUnlocked: true, color: 'indigo' },
    { id: '4', title: 'Curious Mind', description: 'Ask 10 questions to the AI tutor', icon: 'chat', progress: 4, maxProgress: 10, isUnlocked: false, color: 'green' }
];

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
  const [activeTab, setActiveTab] = useState('home');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedItems, setFeedItems] = useState<FeedItemData[]>(MOCK_FEED);
  const currentFeedItem = feedItems[currentIndex] || feedItems[0];
  const [progress, setProgress] = useState(0);
  const [isUiVisible, setIsUiVisible] = useState(true);
  
  const [showQuiz, setShowQuiz] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showStreaks, setShowStreaks] = useState(false);
  const [showPaths, setShowPaths] = useState(false);
  const [showDevPortal, setShowDevPortal] = useState(false);
  const [showTimeBack, setShowTimeBack] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showArena, setShowArena] = useState(false);
  const [showPassco, setShowPassco] = useState(false);
  
  const [quizData, setQuizData] = useState<QuizQuestion | null>(null);
  const [quizLoadingState, setQuizLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [xp, setXp] = useState(1200);
  const [notes, setNotes] = useState<Note[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(INITIAL_PATHS);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);

  const { connect, disconnect, connected, isSpeaking, transcripts } = useLiveGemini(SYSTEM_INSTRUCTION);

  // Swipe handlers using react-swipeable
  const handlers = useSwipeable({
      onSwipedUp: () => {
          if (currentIndex < feedItems.length - 1) {
              setCurrentIndex(prev => prev + 1);
              setProgress(0);
              setQuizData(null);
              setIsUiVisible(true);
          }
      },
      onSwipedDown: () => {
          if (currentIndex > 0) {
              setCurrentIndex(prev => prev - 1);
              setProgress(0);
              setQuizData(null);
              setIsUiVisible(true);
          }
      },
      trackMouse: true
  });

  // Keyboard navigation
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (activeTab !== 'home') return;
          
          if (e.key === 'ArrowDown') {
              if (currentIndex < feedItems.length - 1) {
                  setCurrentIndex(prev => prev + 1);
                  setProgress(0);
                  setQuizData(null);
                  setIsUiVisible(true);
              }
          } else if (e.key === 'ArrowUp') {
              if (currentIndex > 0) {
                  setCurrentIndex(prev => prev - 1);
                  setProgress(0);
                  setQuizData(null);
                  setIsUiVisible(true);
              }
          }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, activeTab, feedItems.length]);

  useEffect(() => {
    let interval: number;
    if (!isPanelExpanded && activeTab === 'home' && isUiVisible) {
        interval = window.setInterval(() => {
            setProgress(prev => (prev >= 100 ? 0 : prev + 0.5));
        }, 100);
    }
    return () => clearInterval(interval);
  }, [currentIndex, isPanelExpanded, activeTab, isUiVisible]);

  useEffect(() => {
    const init = async () => {
        try {
            if (isOnline) {
                await offlineService.processSyncQueue(handleSyncAction);
            } else {
                const downloaded = await offlineService.getAllDownloadedVideos();
                if (downloaded.length > 0) {
                    setFeedItems(downloaded);
                    setCurrentIndex(0);
                }
            }
        } catch (e) {
            console.error("Initialization error:", e);
        }
    };
    init();
  }, [isOnline]);

  const handleSyncAction = (action: SyncAction) => {
      if (action.type === 'XP_GAIN') {
          setXp(prev => prev + action.payload.amount);
      }
  };

  const handleVideoUpload = (newVideo: FeedItemData) => {
      setFeedItems(prev => [newVideo, ...prev]);
      setCurrentIndex(0); 
      setActiveTab('home');
      setShowUpload(false);
  };

  const handleSubscribeToggle = (authorName: string) => {
      setFeedItems(prev => prev.map(item => {
          if (item.author.name === authorName) {
              return {
                  ...item,
                  author: {
                      ...item.author,
                      isSubscribed: !item.author.isSubscribed
                  }
              };
          }
          return item;
      }));
  };

  const handleDownloadClick = async () => {
      const item = currentFeedItem;
      if (!item) return;
      if (item.isDownloaded) {
          await offlineService.removeVideo(item.id);
          setFeedItems(prev => prev.map(i => i.id === item.id ? { ...i, isDownloaded: false } : i));
      } else {
          try {
              await offlineService.saveVideo(item);
              setFeedItems(prev => prev.map(i => i.id === item.id ? { ...i, isDownloaded: true } : i));
          } catch (e: any) {
              alert(e.message || "Failed to download");
          }
      }
  };

  const handleQuizClick = async () => {
    if (!currentFeedItem) return;
    setQuizLoadingState(LoadingState.LOADING);
    setQuizData(null); 
    
    try {
        if (isOffline) {
            const mockOfflineQuiz = {
                 question: `A quick check on ${currentFeedItem.topic}...`,
                 options: ["Gravity", "Relativity", "Magnetism", "Force"],
                 correctAnswerIndex: 1,
                 explanation: "Even offline, we keep your brain sharp!"
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
        console.error("Failed to generate quiz:", error);
        setQuizLoadingState(LoadingState.ERROR);
    }
  };

  const toggleLive = () => {
    if (isOffline) {
        alert("Live Chat requires an internet connection.");
        return;
    }
    if (connected) disconnect();
    else connect();
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
      setQuizData(null);
      const updateState = () => {
          setXp(prev => prev + points);
          if (points >= 100) {
            setAchievements(prev => prev.map(ach => {
                if (ach.id === '1' && !ach.isUnlocked) {
                    const newProgress = ach.progress + 1;
                    return { ...ach, progress: newProgress, isUnlocked: newProgress >= ach.maxProgress };
                }
                return ach;
            }));
        }
      };
      updateState();
      if (isOffline) {
          await offlineService.queueSyncAction({ type: 'XP_GAIN', payload: { amount: points } });
      }
  };

  const handleAddPath = (path: LearningPath) => {
      setLearningPaths(prev => [path, ...prev]);
  };

  const handleSelectStep = (pathId: string, step: PathStep) => {
      setActiveTab('home');
  };

  const handleTabChange = (tab: string) => {
      setActiveTab(tab);
  };

  return (
    <div className="bg-background-dark text-white font-display overflow-hidden h-screen w-full relative select-none">
      {isOffline && (
          <div className="absolute top-0 inset-x-0 z-50 bg-orange-500 text-white text-xs font-bold text-center py-1">
              OFFLINE MODE • VIEWING DOWNLOADED CONTENT
          </div>
      )}

      <div className={`h-full w-full ${activeTab === 'home' ? 'block' : 'hidden'}`}>
        <div className={`transition-all duration-300 ${isUiVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <TopNav 
                topic={currentFeedItem?.topic || 'Learning'}
                title={currentFeedItem?.title || 'Untitled'}
                authorName={currentFeedItem?.author.name || 'Anonymous'}
                onTimeBackClick={() => setShowTimeBack(true)}
                onArenaClick={() => setShowArena(true)}
                onPasscoClick={() => setShowPassco(true)}
            />
        </div>

        {/* Swipeable Video Feed Container */}
        <div {...handlers} className="h-full w-full overflow-hidden relative bg-black">
             <div 
                className="h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                style={{ transform: `translateY(-${currentIndex * 100}%)` }}
             >
                {feedItems.map((item, index) => (
                    <div key={item.id} className="h-full w-full relative">
                        <VideoBackground 
                            videoUrl={item.videoUrl}
                            posterUrl={item.localPosterUrl || item.videoPosterUrl} 
                            altText={`Video about ${item.title}`}
                            isActive={index === currentIndex} 
                            onToggleUi={() => setIsUiVisible(!isUiVisible)}
                        />
                        <div className={`transition-all duration-300 ${isUiVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                            <ActionSidebar 
                                author={item.author}
                                stats={item.stats}
                                isDownloaded={item.isDownloaded}
                                onNoteClick={() => setShowNotes(true)}
                                onDownloadClick={handleDownloadClick}
                                onSubscribeToggle={() => handleSubscribeToggle(item.author.name)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
        <div className={`absolute bottom-[80px] w-full z-20 px-4 pointer-events-none transition-opacity duration-300 ${isPanelExpanded || !isUiVisible ? 'opacity-0' : 'opacity-100'}`}>
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <div 
                    className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(140,37,244,0.8)] relative transition-[width] duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 size-2 bg-white rounded-full shadow-md"></div>
                </div>
            </div>
        </div>

        <div className={`transition-all duration-500 transform ${isUiVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>
            <BottomPanel 
                transcript={currentFeedItem?.transcript || []}
                onQuizClick={handleQuizClick}
                quizLoadingState={quizLoadingState}
                isLiveConnected={connected}
                isLiveSpeaking={isSpeaking}
                liveTranscripts={transcripts}
                onToggleLive={toggleLive}
                onExpandChange={setIsPanelExpanded}
            />
        </div>
      </div>

      <div className={`h-full w-full ${activeTab === 'discover' ? 'block' : 'hidden'}`}>
          <DiscoverPage />
      </div>
      <div className={`h-full w-full ${activeTab === 'inbox' ? 'block' : 'hidden'}`}>
          <InboxPage />
      </div>
      <div className={`h-full w-full ${activeTab === 'profile' ? 'block' : 'hidden'}`}>
          <ProfilePage />
      </div>

      <div className={`transition-all duration-300 ${isUiVisible || activeTab !== 'home' ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>
          <BottomNavBar 
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onUpload={() => setShowUpload(true)}
          />
      </div>

      {showQuiz && quizData && (
        <QuizModal quizData={quizData} onClose={() => setShowQuiz(false)} onComplete={handleQuizComplete} />
      )}
      {showNotes && (
        <NotesModal notes={notes} onSaveNote={handleSaveNote} onClose={() => setShowNotes(false)} currentTime="0:45" />
      )}
      {showStreaks && (
        <StreaksModal streak={5} xp={xp} achievements={achievements} onClose={() => setShowStreaks(false)} />
      )}
      {showPaths && (
          <LearningPathsModal paths={learningPaths} onClose={() => setShowPaths(false)} onAddPath={handleAddPath} onSelectStep={handleSelectStep} />
      )}
      {showDevPortal && (
          <DeveloperPortalModal onClose={() => setShowDevPortal(false)} />
      )}
      {showTimeBack && (
          <TimeBackModal onClose={() => setShowTimeBack(false)} />
      )}
      {showUpload && (
          <UploadVideoModal onClose={() => setShowUpload(false)} onVideoUpload={handleVideoUpload} />
      )}
      {showArena && (
          <ArenaModal onClose={() => setShowArena(false)} />
      )}
      {showPassco && (
          <PasscoModal onClose={() => setShowPassco(false)} />
      )}
    </div>
  );
};

export default App;
