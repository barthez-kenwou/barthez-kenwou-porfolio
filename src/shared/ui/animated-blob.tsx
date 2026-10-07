import { cn } from '@/shared/lib';
import React, { useEffect } from 'react';

export const AnimatedBlob = ({ className }: { className?: string }) => {
  useEffect(() => {
    // Inject keyframes dynamically if not present
    if (!document.getElementById('animated-blob-style')) {
      const style = document.createElement('style');
      style.id = 'animated-blob-style';
      style.textContent = `
        @keyframes morph-shape-1 {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }
        @keyframes morph-shape-2 {
          0%, 100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
          50% { border-radius: 70% 30% 40% 60% / 60% 40% 50% 70%; }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div
      className={cn(
        'absolute inset-0 z-0 flex items-center justify-center overflow-visible pointer-events-none',
        className,
      )}
    >
      <div className="relative w-full aspect-square max-w-[240px] md:max-w-[350px] flex items-center justify-center">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-primary/20 dark:bg-primary/20 rounded-full filter blur-3xl scale-110"></div>

        {/* Morphing blob 1 */}
        <div
          className="absolute inset-[-10%] bg-gradient-to-tr from-primary/80 to-primary/30 opacity-50 dark:opacity-35"
          style={{
            animation: 'morph-shape-1 8s ease-in-out infinite, spin-slow 12s linear infinite',
          }}
        ></div>

        {/* Morphing blob 2 */}
        <div
          className="absolute inset-[-5%] bg-gradient-to-bl from-primary/70 to-primary/20 opacity-40 dark:opacity-25 mix-blend-overlay"
          style={{
            animation:
              'morph-shape-2 10s ease-in-out infinite reverse, spin-slow 15s linear infinite reverse',
          }}
        ></div>
      </div>
    </div>
  );
};
