// frontend/src/components/custom/Navbar.tsx

'use client';

import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const Navbar: FC = () => {
  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-24 w-full items-center justify-between px-4 max-w-full mx-auto bg-white">
      <div className="flex items-center gap-4">
        <Link href="/" onClick={handleLogoClick}>
          <Image
            src="/images/logo.png"
            alt="Voyager Logo"
            width={70}
            height={70}
            className="object-contain"
          />
        </Link>
      </div>
    </header>
  );
};
