
import React, { useState, useRef, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useSpeechToText } from '../../hooks/useSpeechToText';
import { cn } from '../../utils/classNames';

interface UploadVideoModalProps {
    onClose: () => void;
}

type CreativeMode = '10m' | '60s' | '15s' | 'PHOTO' | 'TEXT';
type UploadStep = 'EDITOR' | 'DETAILS' | 'PROCESSING' | 'SUCCESS';

const GALLERY_IMAGES = [
    'https://picsum.photos/seed/gall1/200/300',
    'https://picsum.photos/seed/gall2/200/300',
    'https://picsum.photos/seed/gall3/200/300',
    'https://picsum.photos/seed/gall4/200/300',
    'https://picsum.photos/seed/gall5/200/300',
    'https://picsum.photos/seed/gall6/200/300',
];

const UploadVideoModal: React.FC<UploadVideoModalProps> = ({ onClose }) => {
    const [step, setStep] = useState<UploadStep>('EDITOR');
    const [activeMode, setActiveMode] = useState<CreativeMode>('PHOTO');
    const [selectedImage, setSelectedImage] = useState(GALLERY_IMAGES[0]);
    const [showLayout, setShowLayout] = useState(true);
    
    // Processing state
    const [processingStage, setProcessingStage] = useState(0);
    
    // Form State for "DETAILS" step
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');

    const { isListening: isTitleListening, startListening: startTitleListening } = useSpeechToText((text) => setTitle(prev => (prev ? `${prev} ${text}` : text)));
    const { isListening: isTopicListening, startListening: startTopicListening } = useSpeechToText((text) => setTopic(text));
    const { isListening: isDescListening, startListening: startDescListening } = useSpeechToText((text) => setDescription(prev => (prev ? `${prev} ${text}` : text)));

    const handlePublish = () => {
        setStep('PROCESSING');
        const stages = [
            "Processing creative assets...",
            "AI generating lesson context...",
            "Indexing visual patterns...",
            "Finalizing educational remix..."
        ];

        let current = 0;
        const interval = setInterval(() => {
            current++;
            setProcessingStage(current);
            if (current >= stages.length) {
                clearInterval(interval);
                setStep('SUCCESS');
            }
        }, 800);
    };

    const processingStages = [
        "Processing creative assets...",
        "AI generating lesson context...",
        "Indexing visual patterns...",
        "Finalizing educational remix..."
    ];

    // CSS for the Heart Petal effect
    const petalStyle = (index: number) => {
        const rotation = index * 72; // 360 / 5 petals
        return {
            transform: `rotate(${rotation}deg) translateY(-80px)`,
            clipPath: 'path("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z")',
            viewBox: "0 0 24 24"
        } as React.CSSProperties;
    };

    return (
        <div className="absolute inset-0 z-[60] bg-black text-white overflow-hidden animate-in fade-in duration-300">
            
            {/* EDITOR VIEW (THE CAMERA SCREEN) */}
            {step === 'EDITOR' && (
                <div className="h-full w-full flex flex-col relative">
                    {/* Top Controls */}
                    <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 pt-12">
                        <button onClick={onClose} className="text-white hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-3xl">close</span>
                        </button>
                        
                        <button className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-sm font-bold shadow-lg">
                            <span className="material-symbols-outlined text-xl">music_note</span>
                            Add sound
                        </button>

                        <button className="text-white hover:rotate-180 transition-transform duration-500">
                            <span className="material-symbols-outlined text-3xl">sync</span>
                        </button>
                    </div>

                    {/* Main Creative Canvas (The Flower Effect) */}
                    <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-blue-900/40 to-black">
                        {/* Background Blurred Image */}
                        <div 
                            className="absolute inset-0 blur-3xl opacity-30 scale-150 transition-all duration-1000"
                            style={{ backgroundImage: `url(${selectedImage})`, backgroundSize: 'cover' }}
                        ></div>

                        {/* The Flower/Heart Layout */}
                        {showLayout ? (
                            <div className="relative size-[320px] animate-in zoom-in spin-in-12 duration-700">
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <div 
                                        key={i} 
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[180px] bg-white p-0.5"
                                        style={petalStyle(i)}
                                    >
                                        <img 
                                            src={selectedImage} 
                                            className="w-full h-full object-cover" 
                                            style={{ transform: `rotate(${-i * 72}deg)` }} 
                                            alt=""
                                        />
                                    </div>
                                ))}
                                {/* Center Mirror */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-12 bg-white p-0.5 z-10 border border-white/50">
                                    <img src={selectedImage} className="w-full h-full object-cover" alt="" />
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full p-12 animate-in zoom-in duration-300">
                                <img src={selectedImage} className="w-full h-full object-cover rounded-3xl shadow-2xl border border-white/20" alt="" />
                            </div>
                        )}
                    </div>

                    {/* Right Toolbar */}
                    <div className="absolute right-4 top-1/3 z-20 flex flex-col gap-6">
                        <button className="flex flex-col items-center gap-1">
                            <span className="material-symbols-outlined text-3xl">flash_on</span>
                        </button>
                        <button className="flex flex-col items-center gap-1">
                            <span className="material-symbols-outlined text-3xl">timer</span>
                        </button>
                        <button 
                            onClick={() => setShowLayout(!showLayout)}
                            className={cn("flex flex-col items-center gap-1 transition-colors", showLayout ? "text-primary" : "text-white")}
                        >
                            <span className="material-symbols-outlined text-3xl">dashboard</span>
                        </button>
                        <button className="flex flex-col items-center gap-1">
                            <span className="material-symbols-outlined text-3xl">zoom_in_map</span>
                        </button>
                        <button className="flex flex-col items-center gap-1 text-white/50">
                            <div className="size-8 rounded-full border-2 border-white/30 p-0.5">
                                <img src="https://i.pravatar.cc/50?u=1" className="rounded-full" alt="" />
                            </div>
                            <span className="material-symbols-outlined text-pink-500 absolute -bottom-1 -right-1 text-sm bg-black rounded-full" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        </button>
                    </div>

                    {/* Bottom Area: Gallery & Controls */}
                    <div className="bg-gradient-to-t from-black via-black/80 to-transparent pt-10 pb-8 px-4 relative z-20">
                        
                        {/* Gallery Strip */}
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-2">
                            <div className="min-w-[56px] h-14 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
                                <span className="material-symbols-outlined">image</span>
                            </div>
                            {GALLERY_IMAGES.map((img, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => setSelectedImage(img)}
                                    className={cn(
                                        "min-w-[56px] h-14 rounded-lg overflow-hidden border-2 transition-all",
                                        selectedImage === img ? "border-white scale-105" : "border-transparent opacity-60"
                                    )}
                                >
                                    <img src={img} className="w-full h-full object-cover" alt="" />
                                </button>
                            ))}
                        </div>

                        {/* Mode Selector */}
                        <div className="flex items-center justify-center gap-6 mb-8 text-[11px] font-bold tracking-widest text-white/50 uppercase select-none">
                            {['10m', '60s', '15s', 'PHOTO', 'TEXT'].map((mode) => (
                                <button 
                                    key={mode} 
                                    onClick={() => setActiveMode(mode as CreativeMode)}
                                    className={cn("transition-colors", activeMode === mode ? "text-white" : "hover:text-white/80")}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>

                        {/* Main Capture Button */}
                        <div className="flex items-center justify-between px-6">
                            <div className="size-12 rounded-full overflow-hidden border border-white/20">
                                <img src="https://i.pravatar.cc/100?u=me" className="w-full h-full object-cover" alt="" />
                            </div>
                            
                            <button 
                                onClick={() => setStep('DETAILS')}
                                className="size-20 rounded-full bg-white p-1 border-[4px] border-white/20 shadow-xl active:scale-95 transition-transform relative group"
                            >
                                <div className="w-full h-full rounded-full border-2 border-black/10 overflow-hidden">
                                     <img src={selectedImage} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform" alt="" />
                                </div>
                            </button>

                            <button className="flex flex-col items-center gap-1 group">
                                <div className="size-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white/20">
                                    <span className="material-symbols-outlined">auto_fix_high</span>
                                </div>
                                <span className="text-[10px] font-bold">Effects</span>
                            </button>
                        </div>

                        {/* View All Effects Button */}
                        <div className="mt-8 flex justify-center">
                            <button className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-10 py-3 rounded-full border border-white/10 hover:bg-white/20 transition-all">
                                <span className="material-symbols-outlined text-white/80">bookmark</span>
                                <span className="text-sm font-bold">View all effects</span>
                                <span className="material-symbols-outlined text-white/40">close</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DETAILS VIEW (FORM) */}
            {step === 'DETAILS' && (
                <div className="h-full flex flex-col bg-[#0F0F13]">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5 pt-12">
                        <button onClick={() => setStep('EDITOR')} className="text-white/60">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </button>
                        <h2 className="text-lg font-bold font-display text-white">Lesson Details</h2>
                        <div className="w-8"></div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <div className="aspect-[9/16] w-32 bg-black rounded-xl mx-auto border border-white/20 overflow-hidden relative shadow-2xl">
                             <img src={selectedImage} className="w-full h-full object-cover opacity-80" alt="" />
                             <div className="absolute inset-0 flex items-center justify-center">
                                 <span className="material-symbols-outlined text-white/50 text-3xl">play_circle</span>
                             </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-white/40 uppercase mb-1.5 block">Title</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none pr-12"
                                        placeholder="Add a catchy title..."
                                    />
                                    <button onClick={startTitleListening} className={cn("absolute right-4 top-1/2 -translate-y-1/2", isTitleListening && "text-red-500 animate-pulse")}>
                                        <span className="material-symbols-outlined text-xl">mic</span>
                                    </button>
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-white/40 uppercase mb-1.5 block">Topic</label>
                                <div className="relative">
                                    <select 
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none appearance-none"
                                    >
                                        <option value="" disabled>Select subject...</option>
                                        <option value="Physics">Physics</option>
                                        <option value="Creative Arts">Creative Arts</option>
                                        <option value="Science">Science</option>
                                        <option value="Math">Math</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">expand_more</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-white/40 uppercase mb-1.5 block">Description</label>
                                <div className="relative">
                                    <textarea 
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none h-24 resize-none pr-12"
                                        placeholder="Describe your lesson..."
                                    />
                                    <button onClick={startDescListening} className={cn("absolute right-4 top-4", isDescListening && "text-red-500 animate-pulse")}>
                                        <span className="material-symbols-outlined text-xl">mic</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-white/5 bg-black/40">
                        <Button onClick={handlePublish} fullWidth size="lg">
                            <span className="material-symbols-outlined mr-2">publish</span>
                            Post Lesson
                        </Button>
                    </div>
                </div>
            )}

            {/* PROCESSING VIEW */}
            {step === 'PROCESSING' && (
                <div className="h-full flex flex-col items-center justify-center p-10 text-center">
                    <div className="relative size-32 mb-8">
                        <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                        <div 
                            className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"
                            style={{ animationDuration: '1.5s' }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="material-symbols-outlined text-5xl text-primary animate-pulse">smart_toy</span>
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">GenAI is Remixing...</h3>
                    <p className="text-white/40">{processingStages[Math.min(processingStage, processingStages.length - 1)]}</p>
                </div>
            )}

            {/* SUCCESS VIEW */}
            {step === 'SUCCESS' && (
                <div className="h-full flex flex-col items-center justify-center p-10 text-center animate-in zoom-in duration-500">
                    <div className="size-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.5)] mb-8">
                        <span className="material-symbols-outlined text-6xl text-white">check</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Creation Shared!</h2>
                    <p className="text-white/60 mb-12">Your interactive lesson has been shared to the feed.</p>
                    <Button onClick={onClose} fullWidth size="lg">Back to Home</Button>
                </div>
            )}
        </div>
    );
};

export default UploadVideoModal;
