import { TestimonialCard } from '@/entities/testimonies';
import { usePublicTestimonials } from '@/entities/testimonies/hooks/usePublicTestimonials';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { useThemeStore } from '@/shared/state/useThemeStore';
import { Image } from '@/shared/ui/Image';
import { AnimatedBlob } from '@/shared/ui/animated-blob';
import { Marquee } from '@/shared/ui/marquee';
import { cn } from '@/shared/lib';
import React from 'react';
import { Lens } from '@/shared/ui/lens';

const TESTIMONIALS_FLARE = '/images/testimonials-flare.webp';

export const TestimonialsSection: React.FC = () => {
  const { language } = useLanguageStore();
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';
  const testimonials = usePublicTestimonials();

  if (testimonials.length === 0) return null;

  const half = Math.max(1, Math.ceil(testimonials.length / 2));
  const firstRow = testimonials.slice(0, half);
  const secondRow = testimonials.slice(half);
  const thirdRow = firstRow;

  return (
    <section className="relative max-w-7xl mx-auto py-12 md:py-16 lg:py-20 px-4 md:px-10 lg:px-14 overflow-x-clip">
      {/* Ambient flare - painted before content; non-interactive */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
        aria-hidden
      >
        <div
          className={cn(
            'absolute -translate-y-1/2',
            // Mobile: centered behind the Marquee stack
            'left-1/2 top-[68%] -translate-x-1/2 w-[120%] max-w-[560px]',
            // Desktop: vertical middle, left side
            'md:left-[-8%] md:top-3/5 md:translate-x-0 md:w-[58%] md:max-w-[480px] lg:left-0 lg:w-[50%]',
          )}
        >
          <img
            src={TESTIMONIALS_FLARE}
            alt=""
            decoding="async"
            {...{ fetchpriority: 'high' }}
            draggable={false}
            className={cn(
              'w-full h-auto blur-2xl md:blur-3xl',
              'opacity-[0.28] dark:opacity-[0.42]',
              '[mask-image:linear-gradient(90deg,transparent_0%,black_28%,black_78%,transparent_100%),linear-gradient(180deg,transparent_0%,black_18%,black_82%,transparent_100%)]',
              '[-webkit-mask-image:linear-gradient(90deg,transparent_0%,black_28%,black_78%,transparent_100%),linear-gradient(180deg,transparent_0%,black_18%,black_82%,transparent_100%)]',
              '[mask-composite:intersect] [-webkit-mask-composite:source-in]',
            )}
            style={{
              mixBlendMode: isDark ? 'screen' : 'multiply',
              filter: isDark
                ? 'saturate(1.08) brightness(1.05)'
                : 'saturate(0.75) brightness(0.9) contrast(1.04)',
            }}
          />
        </div>
      </div>

      <div className="relative z-10 text-center mb-8 md:mb-12 lg:mb-16">
        <h2 className="section-title">
          <span className="gradient-text">
            {language === 'fr' ? 'Témoignages Clients' : 'Client Testimonials'}
          </span>
        </h2>
      </div>

      <div className="relative z-10 flex flex-col-reverse md:grid md:grid-cols-5 gap-12 md:gap-2">
        <style>{`
          .testimonials-3d {
            transform: translateX(0) translateY(0) translateZ(0) rotateX(2deg) rotateY(-4deg) rotateZ(3deg) scale(0.92);
          }
          @media (min-width: 768px) {
            .testimonials-3d {
              transform: translateX(-24px) translateY(0) translateZ(-60px) rotateX(8deg) rotateY(-8deg) rotateZ(8deg) scale(0.94);
            }
          }
        `}</style>

        {/* Testimonials Marquee */}
        <div className="md:col-span-4 relative flex h-[450px] md:h-110 w-full min-w-0 flex-row items-center justify-center gap-2 overflow-hidden [perspective:300px] mb-8 md:mb-0">
          <div className="flex flex-row items-center gap-0 testimonials-3d transition-transform duration-500">
            <Marquee pauseOnHover vertical className="[--duration:20s] scale-90">
              {firstRow.map((review) => (
                <TestimonialCard key={review.id} {...review} />
              ))}
            </Marquee>

            <Marquee
              reverse
              pauseOnHover
              className="[--duration:20s] md:scale-105 scale-95"
              vertical
            >
              {secondRow.map((review) => (
                <TestimonialCard key={review.id} {...review} />
              ))}
            </Marquee>

            <div className="hidden md:block">
              <Marquee reverse pauseOnHover className="[--duration:20s]" vertical>
                {thirdRow.map((review) => (
                  <TestimonialCard key={review.id} {...review} />
                ))}
              </Marquee>
            </div>
          </div>
          <div className="from-background pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b"></div>
          <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t"></div>
          <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l"></div>
        </div>

        <div className="relative md:col-span-1 w-full min-w-0 h-full flex flex-col items-center justify-center gap-6 md:gap-0 mt-4 md:-mt-10 overflow-x-visible">
          <div className="relative w-full flex items-center justify-center min-h-[240px] md:min-h-[350px]">
            <AnimatedBlob />

            <div className="relative z-30 w-[160px] sm:w-[180px] md:w-full max-w-[280px] aspect-square p-2 drop-shadow-lg overflow-hidden rounded-full md:rounded-[4rem] border-4 border-primary/20 bg-background/50 backdrop-blur-sm">
              <Lens zoomFactor={1.3} lensSize={110} isStatic={false} ariaLabel="Zoom Area">
                <Image
                  src="/images/barthez-kenwou-profil-assis.png"
                  alt="Barthez Kenwou"
                  className="object-cover w-full h-full rounded-full md:rounded-[3.5rem] scale-110 md:scale-120"
                />{' '}
              </Lens>
            </div>
          </div>

          <div className="relative w-full max-w-[380px] mx-auto bg-transparent opacity-90 hover:opacity-100 transition-opacity duration-500 px-4 md:px-0">
            <div className="absolute -top-6 left-2 md:left-0 text-5xl md:text-6xl text-primary/30 font-serif leading-none select-none">
              "
            </div>
            <p className="relative z-10 text-sm md:text-[15px] italic text-muted-foreground text-center font-medium leading-relaxed">
              {language === 'fr'
                ? "« Soyez une référence en matière de qualité. Certaines personnes ne sont pas habituées à un environnement où l'excellence est attendue. »"
                : "« Be a yardstick of quality. Some people aren't used to an environment where excellence is expected. »"}
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="w-10 h-[2px] bg-gradient-to-r from-transparent to-primary/50"></div>
              <span className="text-[10px] md:text-xs font-bold text-center text-foreground tracking-widest uppercase">
                Steve Jobs
              </span>
              <div className="w-10 h-[2px] bg-gradient-to-l from-transparent to-primary/50"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
