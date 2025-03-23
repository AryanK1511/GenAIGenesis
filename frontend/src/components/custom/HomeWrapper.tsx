// frontend/src/components/custom/HomeWrapper.tsx

'use client';
import { FC } from 'react';
import { motion } from 'framer-motion';
import { Navbar, Hero } from '@/components';

export const HomeWrapper: FC = () => {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <Navbar />
      <div className="w-full">
        <Hero />
      </div>
    </motion.div>
  );
};
