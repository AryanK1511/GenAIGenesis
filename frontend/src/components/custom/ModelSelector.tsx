// frontend/src/components/custom/ModelSelector.tsx

import { FC } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components';
import { cn, AvailableModels } from '@/lib';
import type { ModelSelectorProps } from '@/lib';

export const ModelSelector: FC<ModelSelectorProps> = ({ currentModel, setCurrentModel }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center gap-1 rounded-md bg-zinc-800 p-6 text-sm text-zinc-200 hover:bg-zinc-700">
          {currentModel.name}
          <ChevronDown className="ml-1 h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[280px] rounded-lg border-zinc-700 bg-zinc-900 p-1 text-zinc-200"
      >
        <div className="px-3 py-2 text-xs font-medium text-zinc-400">Model</div>
        {AvailableModels.map((model) => (
          <DropdownMenuItem
            key={model.id}
            className={cn(
              'flex flex-col items-start gap-1 rounded-md px-3 py-2.5 focus:bg-zinc-800 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
              currentModel.id === model.id && 'bg-purple-900/30'
            )}
            onSelect={() => setCurrentModel(model)}
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{model.name}</span>
                {model.badge && (
                  <span className="rounded bg-gradient-to-r from-purple-600 to-pink-600 px-1 py-0.5 text-[10px] font-medium uppercase tracking-wider">
                    {model.badge.text}
                  </span>
                )}
              </div>
              {currentModel.id === model.id && <Check className="h-4 w-4 text-purple-400" />}
            </div>
            <span className="text-xs text-zinc-400">{model.description}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
