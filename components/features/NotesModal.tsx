
import React, { useState } from 'react';
import { Note } from '../../types';
import Card from '../common/Card';
import Button from '../common/Button';
import { DictatedInput } from '../common/DictatedInput';

interface NotesModalProps {
    notes: Note[];
    onSaveNote: (content: string) => void;
    onClose: () => void;
    currentTime: string;
}

// NotesModal component provides a UI for students to view and capture lesson notes
const NotesModal: React.FC<NotesModalProps> = ({ notes, onSaveNote, onClose, currentTime }) => {
    const [input, setInput] = useState('');

    const handleSave = () => {
        if (!input.trim()) return;
        onSaveNote(input);
        setInput('');
    };

    return (
        <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-md max-h-[80vh] flex flex-col" padding="none">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">edit_note</span>
                        <h2 className="text-lg font-bold font-display text-white">My Notes</h2>
                    </div>
                    <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
                    {notes.length === 0 ? (
                        <div className="text-center text-white/40 py-8 flex flex-col items-center">
                            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">note_add</span>
                            <p className="text-sm">No notes yet.<br/>Capture key moments while you learn!</p>
                        </div>
                    ) : (
                        notes.map(note => (
                            <div key={note.id} className="bg-white/5 border border-white/10 rounded-xl p-3 animate-in slide-in-from-bottom-2">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">{note.timestamp}</span>
                                    <span className="text-[10px] text-white/40">{note.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                </div>
                                <p className="text-sm text-white/90 font-body leading-relaxed">{note.content}</p>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-white/10 bg-black/20">
                    <div className="flex gap-2">
                        <DictatedInput 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onTranscript={(text) => setInput(prev => prev ? `${prev} ${text}` : text)}
                            placeholder="Type or speak a note..."
                            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        />
                        <Button onClick={handleSave} disabled={!input.trim()}>
                            Save
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default NotesModal;
