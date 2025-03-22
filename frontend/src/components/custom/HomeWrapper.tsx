// frontend/src/components/custom/HomeWrapper.tsx

'use client';

import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar, Hero } from '@/components';
import { AvailableModels } from '@/lib';

export const HomeWrapper: FC = () => {
  const [currentModel, setCurrentModel] = useState(AvailableModels[0]);

  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
      className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <Navbar currentModel={currentModel} setCurrentModel={setCurrentModel} />
      <div className="w-full">
        <Hero currentModel={currentModel} />
      </div>
    </motion.div>
  );
};
