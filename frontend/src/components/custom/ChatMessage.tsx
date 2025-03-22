// frontend/src/components/custom/ChatMessage.tsx

'use client';

import { FC, useState } from 'react';
import { Copy, User, Check, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components';
import type { ChatMessageProps } from '@/lib';

export const ChatMessage: FC<ChatMessageProps> = ({ role, content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 4000);
  };

  return (
    <div className="flex gap-4 py-4 w-full">
      <div className="">
        {role === 'user' ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-800 to-pink-800 flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Voyager Logo"
              width={40}
              height={40}
              className="object-cover w-full h-full rounded-full"
            />
          </div>
        )}
      </div>
      <div className="flex-1 w-full">
        <div className="font-medium text-zinc-500 mb-1">{role === 'user' ? 'You' : 'Voyager'}</div>
        <div className="prose prose-invert max-w-none w-full">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        {role === 'assistant' && (
          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="h-8 w-8 bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-700 transition-all"
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-zinc-700 bg-zinc-800 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-700 transition-all"
            >
              <MessageSquare className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
