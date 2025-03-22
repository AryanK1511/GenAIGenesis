// frontend/src/components/custom/Navbar.tsx

'use client';

import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ModelSelector, Socials } from '@/components';
import type { NavbarProps } from '@/lib';

export const Navbar: FC<NavbarProps> = ({ currentModel, setCurrentModel }) => {
  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-24 w-full items-center justify-between px-4 max-w-5xl mx-auto bg-dark-background">
      <div className="flex items-center gap-4">
        <Link href="/" onClick={handleLogoClick}>
          <Image
            src="/images/logo.png"
            alt="Voyager Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </Link>
        <ModelSelector currentModel={currentModel} setCurrentModel={setCurrentModel} />
      </div>
      <div className="flex items-center gap-2">
        <Socials />
      </div>
    </header>
  );
};
