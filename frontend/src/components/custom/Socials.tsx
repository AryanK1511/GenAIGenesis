// frontend/src/components/custom/Socials.tsx

import { FC } from 'react';
import Link from 'next/link';
import { Github } from 'lucide-react';

export const Socials: FC = () => {
  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-dark-background">
      <div className="flex flex-wrap justify-center gap-2">
        <Link
          href="https://github.com/AryanK1511/voyager"
          target="_blank"
          className="flex items-center justify-center w-10 h-10 rounded bg-gradient-to-r from-purple-500/70 to-pink-500/70"
        >
          <Github className="w-5 h-5 text-white" />
        </Link>
      </div>
    </div>
  );
};
