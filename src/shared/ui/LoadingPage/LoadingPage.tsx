import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuroraBackground } from '../aurora-background';
import { loadingTexts } from '@/shared/constants/loading.const';
import { AmbientFlareBackdrop } from '@/shared/ui/AmbientFlareBackdrop';

export const LoadingPage: React.FC = () => {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuroraBackground
      showRadialGradient
      className="fixed inset-0 z-50 !min-h-svh h-svh w-full justify-center"
    >
      {/* Same ambient flare as error / 404 - under the loader chrome */}
      <AmbientFlareBackdrop intensity="soft" vignette className="z-[1]" />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-10 px-4">
        <div className="relative flex items-center justify-center w-32 h-32">
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-2 rounded-full border-t-2 border-primary/60"
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl font-black tracking-tighter text-foreground z-10 select-none"
          >
            <span className="font-display text-foreground">BK</span>
          </motion.div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="h-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={textIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="text-xs sm:text-sm font-bold text-muted-foreground uppercase tracking-[0.3em] text-center"
              >
                {loadingTexts[textIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="w-48 h-[2px] bg-secondary/30 rounded-full overflow-hidden relative">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-primary to-transparent"
              animate={{
                width: ['20%', '40%', '20%'],
                left: ['-20%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 text-[10px] tracking-[0.5em] text-muted-foreground/50 uppercase font-medium"
        >
          Barthez Kenwou
        </motion.div>
      </div>
    </AuroraBackground>
  );
};
