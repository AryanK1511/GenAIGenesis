// frontend/src/components/custom/ChatMessage.tsx

'use client';

import { FC, useState, memo } from 'react';
import { Copy, User, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components';
import { SourceImages } from './SourceImages';
import type { ChatMessageProps } from '@/lib';
import Image from 'next/image';

export const ChatMessage: FC<ChatMessageProps> = memo(({ role, content, sourceImages }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 4000);
  };

  return (
    <div className="flex gap-4 py-4 w-full text-gray-700">
      <div className="flex-shrink-0">
        {role === 'user' ? (
          <div className="w-8 h-8 rounded-full bg-custom-blue flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src="/images/logo.png"
              alt="Voyager"
              className="w-full h-full object-cover"
              width={32}
              height={32}
            />
          </div>
        )}
      </div>
      <div className="flex-1 space-y-2">
        {role === 'assistant' ? (
          <div className="font-medium text-green-700/70 outfit-font">Voyager</div>
        ) : (
          <div className="font-medium text-custom-blue outfit-font">You</div>
        )}
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
});

ChatMessage.displayName = 'ChatMessage';
