
import React, { useState, useRef } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

interface UploadVideoModalProps {
    onClose: () => void;
}

type UploadStep = 'SELECT' | 'DETAILS' | 'PROCESSING' | 'SUCCESS';

const UploadVideoModal: React.FC<UploadVideoModalProps> = ({ onClose }) => {
    const [step, setStep] = useState<UploadStep>('SELECT');
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [processingStage, setProcessingStage] = useState(0);
    
    // Form State
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [description, setDescription] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setTitle(selectedFile.name.split('.')[0]); // Auto-fill title
            setStep('DETAILS');
        }
    };

    const handlePublish = () => {
        setStep('PROCESSING');
        // Simulate AI Processing Steps
        const stages = [
            "Uploading video...",
            "AI generating transcript...",
            "Identifying key topics...",
            "Creating interactive quiz...",
            "Finalizing lesson..."
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
        "Uploading video...",
        "AI generating transcript...",
        "Identifying key topics...",
        "Creating interactive quiz...",
        "Finalizing lesson..."
    ];

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden bg-[#0F0F13] border-white/10" padding="none">
                {/* Header */}
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">add_circle</span>
                        <h2 className="text-lg font-bold font-display text-white">Create Lesson</h2>
                    </div>
                    <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {step === 'SELECT' && (
                        <div 
                            className="border-2 border-dashed border-white/20 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 hover:bg-white/5 transition-all group"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="video/*" 
                                onChange={handleFileSelect}
                            />
                            <div className="size-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl text-primary">cloud_upload</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">Upload Video</h3>
                            <p className="text-sm text-white/50">Drag and drop or tap to select</p>
                            <p className="text-xs text-white/30 mt-4">MP4, MOV up to 50MB</p>
                        </div>
                    )}

                    {step === 'DETAILS' && (
                        <div className="space-y-6">
                            {/* Preview */}
                            <div className="w-full h-48 bg-black rounded-xl overflow-hidden relative border border-white/10">
                                {previewUrl ? (
                                    <video src={previewUrl} className="w-full h-full object-cover opacity-60" />
                                ) : (
                                    <div className="w-full h-full bg-white/5" />
                                )}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl text-white/80">play_circle</span>
                                </div>
                            </div>

                            {/* Inputs */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5 block">Title</label>
                                    <input 
                                        type="text" 
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-[#161b22] border border-white/20 rounded-lg px-3 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                        placeholder="e.g. Introduction to Astrophysics"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5 block">Topic</label>
                                    <select 
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        className="w-full bg-[#161b22] border border-white/20 rounded-lg px-3 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none"
                                    >
                                        <option value="" disabled selected>Select a topic...</option>
                                        <option value="Physics">Physics</option>
                                        <option value="Programming">Programming</option>
                                        <option value="History">History</option>
                                        <option value="Art">Art</option>
                                        <option value="Cooking">Cooking</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider mb-1.5 block">Description</label>
                                    <textarea 
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full bg-[#161b22] border border-white/20 rounded-lg px-3 py-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none h-24 resize-none"
                                        placeholder="What will students learn?"
                                    />
                                </div>
                            </div>

                            <Button onClick={handlePublish} fullWidth size="lg">
                                <span className="material-symbols-outlined mr-2">auto_awesome</span>
                                Generate & Publish
                            </Button>
                        </div>
                    )}

                    {step === 'PROCESSING' && (
                        <div className="py-10 text-center">
                            <div className="relative size-24 mx-auto mb-8">
                                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                    <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" />
                                    <path className="text-primary transition-all duration-300" strokeDasharray={`${(processingStage / 5) * 100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2" />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl text-white animate-pulse">smart_toy</span>
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-bold text-white mb-2">AI is working its magic</h3>
                            <div className="h-6 overflow-hidden">
                                <p className="text-primary animate-pulse">{processingStages[Math.min(processingStage, processingStages.length - 1)]}</p>
                            </div>
                        </div>
                    )}

                    {step === 'SUCCESS' && (
                        <div className="text-center py-6">
                            <div className="size-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                                <span className="material-symbols-outlined text-5xl text-green-400">check_circle</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Lesson Published!</h2>
                            <p className="text-white/60 mb-8">Your video is now live and students can start learning.</p>
                            
                            <div className="bg-[#161b22] border border-white/10 rounded-xl p-4 mb-8 text-left">
                                <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">AI Generated Assets</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-white/80">
                                        <span className="material-symbols-outlined text-green-400 text-base">check</span>
                                        Full Transcript
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-white/80">
                                        <span className="material-symbols-outlined text-green-400 text-base">check</span>
                                        5-Question Quiz
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-white/80">
                                        <span className="material-symbols-outlined text-green-400 text-base">check</span>
                                        Topic Tags
                                    </div>
                                </div>
                            </div>

                            <Button onClick={onClose} fullWidth>
                                Done
                            </Button>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default UploadVideoModal;
