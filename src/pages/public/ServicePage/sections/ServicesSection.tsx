import { mapServiceDtoToCard, ServiceCard, usePublicServices } from '@/entities/services';
import type { IServices } from '@/entities/services';
import { QueryState } from '@/shared/ui/QueryState';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { CurrencyToggle } from './CurrencyToggle';

function ServicesMobileRail({ services }: { services: IServices[] }) {
  const spacerRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [maxShift, setMaxShift] = useState(0);
  const [progress, setProgress] = useState(0);
  const [spacerHeight, setSpacerHeight] = useState(900);

  const measure = () => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;
    const shift = Math.max(0, track.scrollWidth - pin.clientWidth);
    setMaxShift(shift);
    setSpacerHeight(Math.max(window.innerHeight * 0.9, shift + window.innerHeight * 0.55));
  };

  useLayoutEffect(() => {
    measure();
  }, [services.length]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [services.length]);

  useEffect(() => {
    const spacer = spacerRef.current;
    if (!spacer) return;

    let raf = 0;
    const update = () => {
      const rect = spacer.getBoundingClientRect();
      const total = Math.max(1, spacer.offsetHeight - window.innerHeight);
      const raw = -rect.top / total;
      setProgress(Math.min(1, Math.max(0, raw)));
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [maxShift, services.length]);

  return (
    <div
      ref={spacerRef}
      className="relative md:hidden"
      style={{ height: `${spacerHeight}px` }}
    >
      <div
        ref={pinRef}
        className="sticky top-20 flex h-[min(78svh,640px)] items-center overflow-hidden px-4"
      >
        <div
          ref={trackRef}
          className="flex w-max gap-4 will-change-transform pr-6"
          style={{ transform: `translate3d(${-progress * maxShift}px, 0, 0)` }}
        >
          {services.map((service, index) => {
            const focus = progress * Math.max(1, services.length - 1);
            const dist = Math.abs(focus - index);
            const lift = Math.max(0, 1 - dist) * 10;
            const opacity = 0.68 + Math.max(0, 1 - dist * 0.55) * 0.32;

            return (
              <div
                key={service.id ?? index}
                className="w-[min(82vw,340px)] shrink-0 transition-[opacity,transform] duration-150"
                style={{
                  transform: `translateY(${-lift}px)`,
                  opacity,
                }}
              >
                <ServiceCard Service={service} />
              </div>
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-x-4 bottom-3 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-border/50">
            <div
              className="h-full rounded-full bg-primary/70"
              style={{ width: `${Math.max(6, progress * 100)}%` }}
            />
          </div>
          <span className="text-[10px] font-medium tabular-nums text-muted-foreground">
            {Math.min(
              services.length,
              Math.max(1, Math.round(progress * Math.max(0, services.length - 1)) + 1),
            )}
            /{services.length}
          </span>
        </div>
      </div>
    </div>
  );
}

export const ServicesSection: React.FC = () => {
  const { data, isPending, isError, error } = usePublicServices();

  const services = useMemo(
    () => (data?.data.items ?? []).map(mapServiceDtoToCard),
    [data],
  );

  return (
    <section className="relative z-10 -mt-4 py-4 md:-mt-6">
      <CurrencyToggle />

      <QueryState
        isPending={isPending}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        source={data?.source}
        empty={!isPending && services.length === 0}
        className="mb-10 md:mb-14"
      >
        {services.length > 0 ? (
          <>
            <ServicesMobileRail services={services} />
            <div className="mb-10 hidden gap-5 px-4 md:mb-14 md:grid md:grid-cols-2 md:gap-6 md:px-10 lg:grid-cols-3 lg:px-14">
              {services.map((service, index) => (
                <ServiceCard key={service.id ?? index} Service={service} />
              ))}
            </div>
          </>
        ) : null}
      </QueryState>
    </section>
  );
};
