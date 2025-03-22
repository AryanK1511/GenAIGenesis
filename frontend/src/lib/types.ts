// frontend/src/lib/types.ts

import { LucideIcon } from 'lucide-react';

export type Model = {
  id: string;
  name: string;
  description: string;
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  };
};

export type PromptCard = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
}

export interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export type SourceImage = {
  page_number: string;
  image_path: string;
  score: number;
};

export interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  sourceImages?: SourceImage[];
}

export type Message = {
  role: 'user' | 'assistant';
  content: string;
  sourceImages?: SourceImage[];
};

export type ModelSelectorProps = {
  currentModel: Model;
  setCurrentModel: (model: Model) => void;
};

export type NavbarProps = {
  currentModel: Model;
  setCurrentModel: (model: Model) => void;
};

export type SearchBarProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

export type HeroProps = {
  currentModel: Model;
};
