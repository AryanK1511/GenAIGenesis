// frontend/src/components/custom/Hero.tsx

'use client';

import { FC, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { DefaultPromptsSection, SearchBar, AuroraText, ChatMessage } from '@/components';
import { ApiHelper } from '@/lib';
import type { HeroProps, Message, SourceImage } from '@/lib';

export const Hero: FC<HeroProps> = ({ currentModel }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isChatMode, setIsChatMode] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isWaitingForStream, setIsWaitingForStream] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiHelper = useRef(new ApiHelper());

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamedContent]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMessage]);
    setIsChatMode(true);
    setIsWaitingForStream(true);
    setIsStreaming(false);
    setStreamedContent('');

    try {
      const response = await apiHelper.current.post('chat', {
        query: message,
        model: currentModel.id,
        history: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
      });

      if (!response.status) {
        throw new Error(response.message || 'Failed to fetch response');
      }

      const responseData = response.data as Response;
      if (!responseData) {
        throw new Error('No response data available');
      }

      const reader = responseData.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      setIsWaitingForStream(false);
      setIsStreaming(true);

      const decoder = new TextDecoder();
      let accumulatedContent = '';
      let currentSourceImages: SourceImage[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const content = line.slice(6);
            try {
              const data = JSON.parse(content);
              if (data.type === 'source_images') {
                currentSourceImages = data.images;
              } else if (data.type === 'response') {
                accumulatedContent += data.content;
                setStreamedContent(accumulatedContent);
              }
            } catch (error) {
              console.warn('Failed to parse streaming data:', error);
              // If parsing fails, treat it as plain text
              accumulatedContent += content;
              setStreamedContent(accumulatedContent);
            }
          }
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: accumulatedContent,
          sourceImages: currentSourceImages,
        },
      ]);
      setStreamedContent('');
    } catch (error) {
      console.error('Error streaming response:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, there was an error processing your request. Please try again.',
        },
      ]);
    } finally {
      setIsWaitingForStream(false);
      setIsStreaming(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-24 overflow-hidden">
      <AnimatePresence mode="wait">
        {!isChatMode ? (
          <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="w-full max-w-4xl mx-auto text-center space-y-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4, ease: 'easeInOut' }}
                className="space-y-4"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-300">
                  Welcome to <AuroraText>Voyager</AuroraText>
                </h1>
                <p className="text-md sm:text-lg lg-text-xl text-zinc-500 max-w-2xl mx-auto">
                  A personalized AI chatbot designed to know everything about{' '}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4, ease: 'easeInOut' }}
                className="w-full max-w-4xl mx-auto"
              >
                <DefaultPromptsSection />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.4, ease: 'easeInOut' }}
                className="w-full max-w-2xl mx-auto"
              >
                <SearchBar onSend={handleSendMessage} />
                <p className="mt-2 text-xs text-zinc-500 text-center">
                  Note: Voyager can make mistakes. Please verify important information and consider
                  double-checking critical details.
                </p>
              </motion.div>
            </div>
          </div>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="flex-1 flex flex-col w-full"
          >
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto w-full flex justify-center"
            >
              <div className="w-full max-w-2xl px-4 mt-6">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="w-full"
                    >
                      <ChatMessage
                        role={message.role}
                        content={message.content}
                        sourceImages={message.sourceImages}
                      />
                    </motion.div>
                  ))}
                  {(isWaitingForStream || (isStreaming && streamedContent)) && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="w-full"
                    >
                      <div className="flex gap-4 py-4 w-full">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <Image
                              src="/images/logo.png"
                              alt="Voyager Logo"
                              width={32}
                              height={32}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </div>
                        <div className="flex-1 w-full">
                          <div className="font-medium text-zinc-300 mb-1">Voyager</div>
                          <div className="prose prose-invert max-w-none w-full">
                            {isWaitingForStream ? (
                              <div className="flex items-center">
                                <span className="text-zinc-400">Thinking</span>
                                <span className="ml-2 inline-flex">
                                  <span className="animate-pulse text-purple-400 delay-0">.</span>
                                  <span className="animate-pulse text-purple-400 delay-300">.</span>
                                  <span className="animate-pulse text-purple-400 delay-600">.</span>
                                </span>
                              </div>
                            ) : (
                              <ReactMarkdown>{streamedContent}</ReactMarkdown>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} className="h-48" />
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4, ease: 'easeInOut' }}
              className="fixed bottom-0 left-0 right-0 p-4 bg-dark-background flex justify-center"
            >
              <div className="w-full max-w-2xl">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-xs text-zinc-400">
                    Using model:{' '}
                    <span className="text-purple-400 font-medium">{currentModel.name}</span>
                  </span>
                </div>
                <SearchBar onSend={handleSendMessage} disabled={isStreaming} />
                <p className="mt-2 text-xs text-zinc-500 text-center">
                  Note: Voyager can make mistakes. Please verify important information and consider
                  double-checking critical details.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
