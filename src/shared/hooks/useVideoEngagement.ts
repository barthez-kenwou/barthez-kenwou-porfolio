import { useEffect, useRef } from 'react';
import {
  trackVideoComplete,
  trackVideoPlay,
  trackVideoProgress,
} from '@/app/lib/analytics';

/**
 * Attach to a media element (HTML5 video or listen to custom events from embeds).
 */
export function useVideoEngagement(
  videoId: string,
  mediaRef: React.RefObject<HTMLMediaElement | null>,
) {
  const bound = useRef(false);

  useEffect(() => {
    const el = mediaRef.current;
    if (!el || bound.current) return;
    bound.current = true;

    const onPlay = () => trackVideoPlay(videoId);
    const onTimeUpdate = () => {
      if (!el.duration || !Number.isFinite(el.duration)) return;
      const pct = Math.floor((el.currentTime / el.duration) * 100);
      if (pct >= 25) trackVideoProgress(videoId, 25);
      if (pct >= 50) trackVideoProgress(videoId, 50);
      if (pct >= 75) trackVideoProgress(videoId, 75);
    };
    const onEnded = () => trackVideoComplete(videoId);

    el.addEventListener('play', onPlay);
    el.addEventListener('timeupdate', onTimeUpdate);
    el.addEventListener('ended', onEnded);

    return () => {
      el.removeEventListener('play', onPlay);
      el.removeEventListener('timeupdate', onTimeUpdate);
      el.removeEventListener('ended', onEnded);
      bound.current = false;
    };
  }, [videoId, mediaRef]);
}
