// frontend/src/components/custom/ChatMessage.tsx

'use client';

import { FC, useState } from 'react';
import { Copy, User, Check } from 'lucide-react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components';
import { SourceImages } from './SourceImages';
import type { ChatMessageProps } from '@/lib';

export const ChatMessage: FC<ChatMessageProps> = ({ role, content, sourceImages }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 4000);
  };

  return (
    <div className="flex gap-4 py-4 w-full text-white">
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
      <div className="flex-1 space-y-4">
        {role === 'assistant' && sourceImages && sourceImages.length > 0 && (
          <SourceImages images={sourceImages} />
        )}
        <div className="prose prose-slate max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-500 hover:text-slate-700"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
