// frontend/src/components/custom/Chat.tsx

import { FC, useEffect, useRef, useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { SearchBar } from './SearchBar';
import type { Message } from '@/lib';
import Image from 'next/image';

export const Chat: FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentSourceImages, setCurrentSourceImages] = useState<Array<{
    page_number: string;
    image_path: string;
    score: number;
  }> | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  const handleSend = async (message: string) => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    setStreamingContent('');
    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setCurrentSourceImages(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: message,
          history: messages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      let currentResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'source_images') {
              setCurrentSourceImages(data.images);
            } else if (data.type === 'response') {
              currentResponse += data.content;
              setStreamingContent(currentResponse);
            }
          }
        }
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: currentResponse }]);
      setStreamingContent('');
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, there was an error processing your request.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            role={message.role}
            content={message.content}
            sourceImages={
              message.role === 'assistant' && index === messages.length - 1
                ? currentSourceImages || undefined
                : undefined
            }
          />
        ))}
        {isLoading && (
          <div className="flex gap-4 py-4 w-full text-gray-700">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center border border-purple-200">
                <Image
                  src="/images/logo.png"
                  alt="Assistant"
                  width={32}
                  height={32}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="prose prose-slate max-w-none">
                <div className="flex items-center">
                  <span className="text-custom-green">Thinking</span>
                  <span className="ml-2 inline-flex">
                    <span className="animate-pulse text-custom-green delay-0">.</span>
                    <span className="animate-pulse text-custom-green delay-300">.</span>
                    <span className="animate-pulse text-custom-green delay-600">.</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-slate-200">
        <SearchBar onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
};
