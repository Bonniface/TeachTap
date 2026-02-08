
import React from 'react';
import { useSpeechToText } from '../../hooks/useSpeechToText';
import { cn } from '../../utils/classNames';

interface DictatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onTranscript?: (text: string) => void;
  containerClassName?: string;
  iconClassName?: string;
}

export const DictatedInput: React.FC<DictatedInputProps> = ({ 
  onTranscript, 
  value, 
  onChange, 
  className, 
  containerClassName,
  iconClassName,
  ...props 
}) => {
  const handleSpeech = (text: string) => {
    if (onTranscript) {
      onTranscript(text);
    } else if (onChange) {
      // Create a mock event for compatibility
      const mockEvent = {
        target: { value: value ? `${value} ${text}` : text }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(mockEvent);
    }
  };

  const { isListening, startListening } = useSpeechToText(handleSpeech);

  return (
    <div className={cn("relative flex-1", containerClassName)}>
      <input
        value={value}
        onChange={onChange}
        className={cn(
          "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all",
          className
        )}
        {...props}
      />
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          startListening();
        }}
        className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-200",
          isListening ? "text-red-500 animate-pulse scale-125" : "text-white/30 hover:text-white",
          iconClassName
        )}
        title="Voice dictation"
      >
        <span className="material-symbols-outlined text-xl">mic</span>
      </button>
    </div>
  );
};

interface DictatedTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onTranscript?: (text: string) => void;
  containerClassName?: string;
}

export const DictatedTextArea: React.FC<DictatedTextAreaProps> = ({ 
  onTranscript, 
  value, 
  onChange, 
  className, 
  containerClassName,
  ...props 
}) => {
  const handleSpeech = (text: string) => {
    if (onTranscript) {
      onTranscript(text);
    } else if (onChange) {
      const mockEvent = {
        target: { value: value ? `${value} ${text}` : text }
      } as React.ChangeEvent<HTMLTextAreaElement>;
      onChange(mockEvent);
    }
  };

  const { isListening, startListening } = useSpeechToText(handleSpeech);

  return (
    <div className={cn("relative", containerClassName)}>
      <textarea
        value={value}
        onChange={onChange}
        className={cn(
          "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pr-10 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all",
          className
        )}
        {...props}
      />
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          startListening();
        }}
        className={cn(
          "absolute right-3 top-4 transition-all duration-200",
          isListening ? "text-red-500 animate-pulse scale-125" : "text-white/30 hover:text-white"
        )}
        title="Voice dictation"
      >
        <span className="material-symbols-outlined text-xl">mic</span>
      </button>
    </div>
  );
};
