import { cn } from '@/lib/utils';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Star } from 'lucide-react';
import { ITestimonial } from '../model/testimonial.types';

export const TestimonialCard = ({
  id,
  rating,
  textFr,
  textEn,
  nameFr,
  nameEn,
  roleFr,
  roleEn,
}: ITestimonial) => {
  const { language } = useLanguageStore();

  return (
    <figure
      key={id}
      className={cn(
        'max-w-sm relative h-full w-fit cursor-pointer overflow-hidden border p-5 rounded-md bg-card border-border hover:border-primary/30 transition-colors',
      )}
    >
      {/* Stars */}
      <div className="flex gap-1 mb-3">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
        ))}
      </div>

      {/* testimonial Text */}
      <blockquote className="mb-3 text-[13px] leading-relaxed text-foreground/80 italic">
        "{language === 'fr' ? textFr : textEn}"
      </blockquote>

      {/* About the speaker */}
      <div className="space-y-0.5">
        <p className="font-semibold text-foreground text-[13px]">
          {language === 'fr' ? nameFr : nameEn}
        </p>
        <p className="text-[11px] text-muted-foreground">{language === 'fr' ? roleFr : roleEn}</p>
      </div>
    </figure>
  );
};
