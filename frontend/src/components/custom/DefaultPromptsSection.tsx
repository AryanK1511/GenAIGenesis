// frontend/src/components/custom/DefaultPromptsSection.tsx

import { FC } from 'react';
import { cn } from '@/lib/utils/shadcn';
import { DefaultPrompts } from '@/lib';

export const DefaultPromptsSection: FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-8">
      {DefaultPrompts.map((prompt, index) => {
        const Icon = prompt.icon;
        const isLastItem = index === DefaultPrompts.length - 1;
        return (
          <div
            key={index}
            className={cn(
              'group bg-zinc-800/40 backdrop-blur-lg px-4 py-3 rounded-lg flex flex-col items-center text-center hover:scale-[1.02] hover:shadow-purple-500/30 cursor-pointer',
              isLastItem && 'sm:col-span-2 lg:col-span-1'
            )}
          >
            <div className="w-8 h-8 flex items-center justify-center mb-2 rounded-full bg-purple-500/10 group-hover:bg-purple-500/20">
              <Icon className="w-4 h-4 text-purple-500" />
            </div>
            <h3 className="text-white font-medium my-2 mb-3 text-sm group-hover:text-purple-400">
              {prompt.title}
            </h3>
            <p className="text-zinc-400 text-xs group-hover:text-zinc-300">{prompt.description}</p>
          </div>
        );
      })}
    </div>
  );
};
