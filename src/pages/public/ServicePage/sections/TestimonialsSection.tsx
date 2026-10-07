import { usePublicTestimonials } from '@/entities/testimonies/hooks/usePublicTestimonials';
import React from 'react';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { useThemeStore } from '@/shared/state/useThemeStore';
import { Marquee } from '@/shared/ui/marquee';
import { TestimonialCard } from '@/entities/testimonies';
import { AnimatedBlob } from '@/shared/ui/animated-blob';
import { Lens } from '@/shared/ui/lens';
import { Image } from '@/shared/ui/Image';
import { cn } from '@/shared/lib';

const SERVICES_TESTIMONIALS_ORBIT = '/images/services-testimonials-orbit.webp';

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
    <section className="relative mx-auto max-w-7xl overflow-x-clip px-4 py-12 md:px-10 md:py-16 lg:px-14 lg:py-20">
      <div className="relative z-10 mb-8 text-center md:mb-12 lg:mb-16">
        <h2 className="section-title">
          <span className="gradient-text">
            {language === 'fr' ? 'Ce Que Disent Mes Clients' : 'What My Clients Say'}
          </span>
        </h2>
      </div>

      <div className="relative z-10 flex flex-col-reverse gap-12 md:grid md:grid-cols-5 md:gap-2">
        <style>{`
          .service-testimonials-3d {
            transform: translateX(0) translateY(0) translateZ(0) rotateX(2deg) rotateY(-4deg) rotateZ(3deg) scale(0.92);
          }
          @media (min-width: 768px) {
            .service-testimonials-3d {
              transform: translateX(-24px) translateY(0) translateZ(-60px) rotateX(8deg) rotateY(-8deg) rotateZ(8deg) scale(0.94);
            }
          }
        `}</style>

        <div className="relative mt-4 flex h-full w-full min-w-0 flex-col items-center justify-center gap-6 overflow-x-visible md:col-span-1 md:mt-[-2.5rem] md:gap-0">
          <div className="relative flex min-h-[240px] w-full items-center justify-center md:min-h-[350px]">
            <AnimatedBlob />

            <div className="relative z-30 aspect-square w-[160px] max-w-[280px] overflow-hidden rounded-full border-4 border-primary/20 bg-background/50 p-2 drop-shadow-lg backdrop-blur-sm sm:w-[180px] md:w-full md:rounded-[4rem]">
              <Lens zoomFactor={1.3} lensSize={110} isStatic={false} ariaLabel="Zoom Area">
                <Image
                  src="/images/profile.jpeg"
                  alt="Barthez Kenwou"
                  priority
                  className="h-full w-full scale-110 rounded-full object-cover md:scale-120 md:rounded-[3.5rem]"
                />
              </Lens>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[380px] bg-transparent px-4 opacity-90 transition-opacity duration-500 hover:opacity-100 md:px-0">
            <div className="pointer-events-none absolute -top-6 left-2 select-none font-serif text-5xl leading-none text-primary/30 md:left-0 md:text-6xl">
              "
            </div>
            <p className="relative z-10 text-center text-sm leading-relaxed font-medium text-muted-foreground italic md:text-[15px]">
              {language === 'fr'
                ? 'Les deux jours les plus importants de votre vie sont le jour où vous êtes né et le jour où vous en découvrez la raison.'
                : 'The two most important days in your life are the day you are born and the day you find out why.'}
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <div className="h-[2px] w-10 bg-gradient-to-r from-transparent to-primary/50" />
              <span className="text-center text-[10px] font-bold tracking-widest text-foreground uppercase md:text-xs">
                Mark Twain
              </span>
              <div className="h-[2px] w-10 bg-gradient-to-l from-transparent to-primary/50" />
            </div>
          </div>
        </div>

        <div className="relative mb-8 flex h-[450px] w-full min-w-0 flex-row items-center justify-center gap-2 overflow-hidden [perspective:300px] md:col-span-4 md:mb-0 md:h-110">
          {/* Orbit flare - behind the testimonial marquee (centered on mobile) */}
          <div
            className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
            aria-hidden
          >
            <div
              className={cn(
                // Mobile: centered behind the marquee stack
                'absolute left-1/2 top-1/2 w-[135%] max-w-[640px] -translate-x-1/2 -translate-y-1/2',
                // Desktop: anchor in the empty right gutter, bleed left behind marquees
                'md:left-auto md:right-[-22%] md:top-1/2 md:w-[92%] md:max-w-[680px] md:translate-x-0 md:-translate-y-1/2 lg:right-[-20%] lg:w-[88%] lg:max-w-[720px]',
              )}
            >
              <img
                src={SERVICES_TESTIMONIALS_ORBIT}
                alt=""
                decoding="async"
                draggable={false}
                className={cn(
                  'h-auto w-full',
                  'opacity-[0.22] dark:opacity-[0.34]',
                  'blur-[1.5px] md:blur-[2px]',
                  '[mask-image:radial-gradient(ellipse_70%_65%_at_50%_50%,black_20%,transparent_78%)]',
                  '[-webkit-mask-image:radial-gradient(ellipse_70%_65%_at_50%_50%,black_20%,transparent_78%)]',
                )}
                style={{
                  mixBlendMode: isDark ? 'screen' : 'multiply',
                  filter: isDark
                    ? 'hue-rotate(85deg) saturate(0.9) brightness(1.02)'
                    : 'hue-rotate(85deg) saturate(0.55) brightness(0.9) contrast(1.04)',
                }}
              />
            </div>
          </div>

          <div className="service-testimonials-3d relative z-10 flex flex-row items-center gap-0 transition-transform duration-500">
            <Marquee pauseOnHover vertical className="[--duration:20s] scale-90">
              {firstRow.map((review) => (
                <TestimonialCard key={review.id} {...review} />
              ))}
            </Marquee>

            <Marquee
              reverse
              pauseOnHover
              className="[--duration:20s] scale-95 md:scale-105"
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

          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-1/4 bg-gradient-to-b from-background" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-1/4 bg-gradient-to-t from-background" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-1/4 bg-gradient-to-l from-background" />
        </div>
      </div>
    </section>
  );
};
