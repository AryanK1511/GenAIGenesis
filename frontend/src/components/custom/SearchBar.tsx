// frontend/src/components/custom/SearchBar.tsx

'use client';
import { FC, useRef, useEffect, useState } from 'react';
import { Mic, Send, Square, RotateCcw } from 'lucide-react';
import { Button, Textarea } from '@/components';
import { SpeechRecognition, SpeechRecognitionEvent } from '@/lib';
import type { SearchBarProps } from '@/lib';
declare global {
  interface Window {
    // eslint-disable-next-line
    webkitSpeechRecognition: any;
  }
}

export const SearchBar: FC<SearchBarProps> = ({ onSend, disabled = false }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const finalTranscriptRef = useRef<string>('');

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      // eslint-disable-next-line
      const recognition = new (window.webkitSpeechRecognition as any)();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const results = Array.from(event.results);
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          const transcript = result[0].transcript.trim();

          if (result.isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          finalTranscriptRef.current = finalTranscript.trim();
        }

        const displayText =
          finalTranscriptRef.current + (interimTranscript ? ' ' + interimTranscript : '');
        setValue(displayText.trim());
      };

      recognition.onend = () => {
        if (isRecording && recognitionRef.current) {
          recognitionRef.current.start();
        }
      };

      recognitionRef.current = recognition;

      // Cleanup function
      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
          recognitionRef.current = null;
        }
      };
    }
  }, []); // Empty dependency array - only run once on mount

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      finalTranscriptRef.current = '';
    } else {
      setValue('');
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };

  const handleSend = async () => {
    if (!value.trim() || isSending) return;

    setIsSending(true);
    await onSend(value);
    setValue('');
    setIsSending(false);
  };

  useEffect(() => {
    if (!isSending && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isSending]);

  const handleReset = () => {
    window.location.reload();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = '24px';
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 200;
    const newHeight = Math.min(scrollHeight, maxHeight);

    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [value]);

  return (
    <div className="group relative flex w-full flex-col gap-2 rounded-3xl bg-white border border-gray-200 px-4 py-3 shadow-sm transition-all duration-200 hover:border-custom-blue">
      <div className="px-2">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, 2000))}
          onKeyDown={handleKeyDown}
          placeholder="Ask Anything"
          className="w-full resize-none bg-transparent px-0 py-0 text-gray-800 placeholder:text-gray-400 border-none"
          rows={1}
          disabled={disabled}
        />
        <div className="flex justify-end mt-1">
          <span className="text-xs text-gray-400">{value.length}/2000</span>
        </div>
        <div className="flex items-center justify-between mt-6">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleRecording}
              disabled={disabled}
              className={`h-10 w-10 rounded-full ${isRecording ? 'bg-red-100 text-red-500 hover:bg-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isRecording ? <Square /> : <Mic />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              disabled={disabled}
              className="h-10 w-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw />
            </Button>
          </div>
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!value.trim() || isSending || disabled}
            className={`h-10 w-10 rounded-full bg-custom-green ${!value.trim() || isSending || disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Send />
          </Button>
        </div>
      </div>
    </div>
  );
};
