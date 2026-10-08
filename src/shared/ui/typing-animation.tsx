'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, MotionProps, useInView } from 'motion/react';

import { cn } from '@/lib/utils';

interface TypingAnimationProps extends MotionProps {
  children?: string;
  words?: string[];
  className?: string;
  duration?: number;
  typeSpeed?: number;
  deleteSpeed?: number;
  delay?: number;
  pauseDelay?: number;
  loop?: boolean;
  as?: React.ElementType;
  startOnView?: boolean;
  showCursor?: boolean;
  blinkCursor?: boolean;
  cursorStyle?: 'line' | 'block' | 'underscore' | 'hand';
  cursorSrc?: string;
}

export function TypingAnimation({
  children,
  words,
  className,
  duration = 100,
  typeSpeed,
  deleteSpeed,
  delay = 0,
  pauseDelay = 1000,
  loop = false,
  as: Component = 'span',
  startOnView = true,
  showCursor = true,
  blinkCursor = true,
  cursorStyle = 'line',
  cursorSrc = '/images/typing-hand.png',
  ...props
}: TypingAnimationProps) {
  const MotionComponent = motion.create(Component, {
    forwardMotionProps: true,
  });

  const [displayedText, setDisplayedText] = useState<string>('');
  const [isWriting, setIsWriting] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(elementRef as React.RefObject<Element>, {
    amount: 0.2,
    once: true,
  });

  const wordsKey = Array.isArray(words) ? words.join('\u0001') : '';
  const wordsToAnimate = useMemo(
    () => words || (children ? [children] : []),
    // wordsKey tracks content; avoids reset when parent passes a fresh array literal
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [children, wordsKey],
  );

  const longestWord = useMemo(() => {
    if (wordsToAnimate.length === 0) return '';
    return wordsToAnimate.reduce((a, b) => (Array.from(a).length >= Array.from(b).length ? a : b));
  }, [wordsToAnimate]);

  const typingSpeed = typeSpeed || duration;
  const deletingSpeed = deleteSpeed || typingSpeed / 2;
  const shouldStart = startOnView ? isInView : true;

  const phaseRef = useRef<'typing' | 'pause' | 'deleting'>('typing');
  const wordIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const wordsRef = useRef(wordsToAnimate);

  wordsRef.current = wordsToAnimate;

  useEffect(() => {
    if (!shouldStart || wordsToAnimate.length === 0) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    phaseRef.current = 'typing';
    wordIndexRef.current = 0;
    charIndexRef.current = 0;
    setDisplayedText('');
    setIsWriting(false);

    const tick = () => {
      if (cancelled) return;

      const list = wordsRef.current;
      if (list.length === 0) return;

      const word = list[wordIndexRef.current] || '';
      const graphemes = Array.from(word);
      const phase = phaseRef.current;
      let wait = typingSpeed;

      if (phase === 'typing') {
        if (charIndexRef.current < graphemes.length) {
          charIndexRef.current += 1;
          setDisplayedText(graphemes.slice(0, charIndexRef.current).join(''));
          setIsWriting(true);
          wait = typingSpeed;
        } else if (list.length > 1 || loop) {
          phaseRef.current = 'pause';
          setIsWriting(false);
          wait = pauseDelay;
        } else {
          setIsWriting(false);
          return;
        }
      } else if (phase === 'pause') {
        phaseRef.current = 'deleting';
        setIsWriting(true);
        wait = deletingSpeed;
      } else {
        if (charIndexRef.current > 0) {
          charIndexRef.current -= 1;
          setDisplayedText(graphemes.slice(0, charIndexRef.current).join(''));
          setIsWriting(true);
          wait = deletingSpeed;
        } else {
          wordIndexRef.current = (wordIndexRef.current + 1) % list.length;
          phaseRef.current = 'typing';
          setIsWriting(false);
          wait = Math.max(typingSpeed, 120);
        }
      }

      timeoutId = setTimeout(tick, wait);
    };

    timeoutId = setTimeout(tick, delay > 0 ? delay : typingSpeed);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [shouldStart, wordsToAnimate, loop, typingSpeed, deletingSpeed, pauseDelay, delay]);

  const currentWord = wordsToAnimate[wordIndexRef.current] || '';
  const isComplete =
    !loop && wordsToAnimate.length <= 1 && displayedText.length >= Array.from(currentWord).length;

  const shouldShowCursor = Boolean(
    showCursor && (loop || wordsToAnimate.length > 1 || !isComplete),
  );

  const getCursorChar = () => {
    switch (cursorStyle) {
      case 'block':
        return '▌';
      case 'underscore':
        return '_';
      case 'line':
      default:
        return '|';
    }
  };

  const cursorNode =
    shouldShowCursor && cursorStyle === 'hand' ? (
      <motion.img
        src={cursorSrc}
        alt=""
        aria-hidden
        draggable={false}
        className={cn(
          'ml-px inline-block h-[1.15em] w-auto shrink-0 select-none align-baseline',
          'origin-[8%_92%]',
          'brightness-0 dark:brightness-100',
        )}
        animate={
          isWriting
            ? {
                x: [0, 1.4, 0.2, 1.1, 0],
                y: [0, -1.2, 0.35, -0.7, 0],
                rotate: [0, -5, 1.5, -3, 0],
              }
            : {
                x: 0,
                y: [0, -0.5, 0],
                rotate: 0,
                opacity: blinkCursor ? [1, 0.65, 1] : 1,
              }
        }
        transition={
          isWriting
            ? { duration: 0.36, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 1.15, repeat: Infinity, ease: 'easeInOut' }
        }
      />
    ) : shouldShowCursor ? (
      <span className={cn('inline-block', blinkCursor && 'animate-pulse')}>{getCursorChar()}</span>
    ) : null;

  return (
    <MotionComponent
      ref={elementRef}
      className={cn(
        // Invisible longest word reserves width + height → no collapse blip when empty
        'relative inline-grid leading-[1.35] tracking-[-0.02em] align-middle',
        className,
      )}
      {...props}
    >
      <span aria-hidden className="invisible col-start-1 row-start-1 whitespace-pre">
        {longestWord}
        {cursorStyle === 'hand' ? (
          <span className="ml-px inline-block h-[1.15em] w-[1.35em] align-baseline" />
        ) : (
          <span className="inline-block w-[0.5ch]">|</span>
        )}
      </span>

      <span className="col-start-1 row-start-1 inline-flex min-w-0 items-baseline justify-start whitespace-pre">
        <span>{displayedText}</span>
        {cursorNode}
      </span>
    </MotionComponent>
  );
}
