import React, { useEffect, useRef, useState } from 'react';

export type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  srcSet?: string;
  sizes?: string;
  lazy?: boolean; // use IntersectionObserver lazy-loading
  showSkeleton?: boolean; // show skeleton while loading
  showSpinner?: boolean; // show spinner overlay while loading
  priority?: boolean; // preload image (for hero images)
};

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  srcSet,
  sizes,
  lazy = true,
  showSkeleton = true,
  showSpinner = true,
  priority = false,
  style,
  ...rest
}) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(!lazy);
  const [loaded, setLoaded] = useState(false);

  // Preload if priority
  useEffect(() => {
    if (!priority) return;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    if (srcSet) link.setAttribute('imagesrcset', srcSet);
    document.head.appendChild(link);
    return () => {
      try {
        document.head.removeChild(link);
      } catch {
        // ignore
      }
    };
  }, [priority, src, srcSet]);

  // IntersectionObserver for lazy loading
  useEffect(() => {
    if (!lazy || isVisible) return;
    if (!wrapperRef.current) return;
    const el = wrapperRef.current;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            obs.disconnect();
          }
        });
      },
      { rootMargin: '200px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [lazy, isVisible]);

  const handleLoad = (ev: React.SyntheticEvent<HTMLImageElement>) => {
    setLoaded(true);
    if (rest.onLoad) rest.onLoad(ev);
  };

  const handleError = (ev: React.SyntheticEvent<HTMLImageElement>) => {
    if (rest.onError) rest.onError(ev as any);
  };

  const aspectStyle: React.CSSProperties | undefined =
    width && height
      ? { width: width + 'px', height: height + 'px', objectFit: 'cover', ...style }
      : style;

  return (
    <div ref={wrapperRef} className={`relative overflow-hidden ${className}`}>
      {showSkeleton && !loaded && (
        <div
          aria-hidden
          className="absolute inset-0 bg-muted animate-pulse"
          style={{ width: width ? width + 'px' : '100%', height: height ? height + 'px' : '100%' }}
        />
      )}

      {showSpinner && !loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-500 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      )}

      {isVisible && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          srcSet={srcSet}
          sizes={sizes}
          loading={lazy ? 'lazy' : 'eager'}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            ...aspectStyle,
            objectFit: (style?.objectFit as any) || 'cover',
          }}
          className="w-full h-full"
          {...rest}
        />
      )}
    </div>
  );
};

// Named export only to comply with project lint rules
