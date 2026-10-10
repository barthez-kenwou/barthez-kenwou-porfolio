import { mapServiceDtoToCard, ServiceCard, usePublicServices } from '@/entities/services';
import type { IServices } from '@/entities/services';
import { QueryState } from '@/shared/ui/QueryState';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { CurrencyToggle } from './CurrencyToggle';

const CARD_GAP_PX = 12; // gap-3
const CARD_WIDTH_CLASS = 'w-[min(86vw,320px)]';

function ServicesMobileRail({ services }: { services: IServices[] }) {
  const spacerRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [maxShift, setMaxShift] = useState(0);
  const [progress, setProgress] = useState(0);
  const [spacerHeight, setSpacerHeight] = useState(560);

  const measure = () => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;

    const slide = track.querySelector<HTMLElement>('[data-service-slide]');
    if (!slide) return;

    const cardW = slide.getBoundingClientRect().width;
    const pinW = pin.clientWidth;
    const pad = Math.max(16, (pinW - cardW) / 2);

    // Side padding so the active card can sit centered (first → last).
    track.style.paddingLeft = `${pad}px`;
    track.style.paddingRight = `${pad}px`;

    const shift = Math.max(0, (services.length - 1) * (cardW + CARD_GAP_PX));
    setMaxShift(shift);

    // One comfortable scroll "step" per card — long enough to feel, not a dead zone.
    const step = Math.min(380, Math.max(240, window.innerHeight * 0.42));
    setSpacerHeight(step * Math.max(1, services.length - 1) + window.innerHeight * 0.2);
  };

  useLayoutEffect(() => {
    measure();
  }, [services.length]);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;

    const onResize = () => measure();
    window.addEventListener('resize', onResize, { passive: true });

    const ro = new ResizeObserver(onResize);
    ro.observe(pin);
    ro.observe(track);

    return () => {
      window.removeEventListener('resize', onResize);
      ro.disconnect();
    };
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

  const activeIndex = Math.min(
    services.length,
    Math.max(1, Math.round(progress * Math.max(0, services.length - 1)) + 1),
  );

  return (
    <div
      ref={spacerRef}
      className="relative md:hidden"
      style={{ height: `${spacerHeight}px` }}
    >
      <div
        ref={pinRef}
        className="sticky top-40 overflow-hidden pb-9 pt-3 sm:top-28"
      >
        <div
          ref={trackRef}
          className="flex w-max items-stretch will-change-transform"
          style={{
            gap: CARD_GAP_PX,
            transform: `translate3d(${-progress * maxShift}px, 0, 0)`,
          }}
        >
          {services.map((service, index) => {
            const focus = progress * Math.max(1, services.length - 1);
            const dist = Math.abs(focus - index);
            // Soft focus — no vertical lift (keeps equal heights stable while scrolling).
            const opacity = 0.55 + Math.max(0, 1 - dist * 0.7) * 0.45;
            const scale = 0.97 + Math.max(0, 1 - dist) * 0.03;

            return (
              <div
                key={service.id ?? index}
                data-service-slide
                className={`${CARD_WIDTH_CLASS} flex shrink-0 flex-col transition-[opacity,transform] duration-150`}
                style={{
                  opacity,
                  transform: `scale(${scale})`,
                  transformOrigin: 'center center',
                }}
              >
                <div className="flex h-full min-h-0 flex-1 flex-col">
                  <ServiceCard Service={service} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pointer-events-none absolute inset-x-4 bottom-2.5 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-border/50">
            <div
              className="h-full rounded-full bg-primary/70 transition-[width] duration-150"
              style={{ width: `${Math.max(8, progress * 100)}%` }}
            />
          </div>
          <span className="text-[10px] font-medium tabular-nums text-muted-foreground">
            {activeIndex}/{services.length}
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
    <section className="relative z-10 -mt-8 py-1 md:-mt-6 md:py-4">
      <CurrencyToggle />

      <QueryState
        isPending={isPending}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        source={data?.source}
        empty={!isPending && services.length === 0}
        className="mb-4 md:mb-14"
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
