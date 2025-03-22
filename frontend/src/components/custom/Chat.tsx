import { FC, useEffect, useRef, useState } from 'react';
import { ChatMessage } from './ChatMessage';
import { SearchBar } from './SearchBar';
import type { Message } from '@/lib';

export const Chat: FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
  }, [messages]);

  const handleSend = async (message: string) => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
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
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

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
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: 'assistant',
                  content: currentResponse,
                };
                return newMessages;
              });
            }
          }
        }
      }
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
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-slate-200">
        <SearchBar onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
};
