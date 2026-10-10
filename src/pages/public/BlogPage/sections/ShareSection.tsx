import type { IBlog } from '@/entities/blogs';
import { trackShare } from '@/app/lib/analytics';
import { getBlogPathSlug } from '@/shared/lib/entity-slug';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import { Share2, Twitter, Linkedin } from 'lucide-react';
import React from 'react';

export const ShareSection: React.FC<{ post: IBlog }> = ({ post }) => {
  const { language } = useLanguageStore();
  const slug = getBlogPathSlug(post);

  const shareUrl = window.location.href;
  const shareText = language === 'fr' ? post.titleFr : post.titleEn;

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 p-2 md:px-4 md:py-2 rounded-sm bg-secondary/20 border border-border/40 mb-8 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-center gap-2 relative z-10 text-left">
        <div className="h-8 w-8 flex items-center justify-center rounded-sm bg-primary text-primary-foreground shadow-sm shadow-primary/10">
          <Share2 className="h-4 w-4" />
        </div>

        <div>
          <span className="block text-foreground font-black uppercase tracking-[0.1em] text-[10px]">
            {language === 'fr' ? "Partager l'article" : 'Share the article'}
          </span>
          <span className="text-xs text-muted-foreground">
            {language === 'fr' ? 'Diffusez le savoir' : 'Spread the knowledge'}
          </span>
        </div>
      </div>

      <div className="flex gap-2 md:ml-auto relative z-10 w-full md:w-auto">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-sm bg-sky-500 text-white font-bold text-[11px] hover:bg-sky-600 transition-all shadow-sm active:scale-95"
          onClick={() => trackShare('twitter', 'blog', slug)}
        >
          <Twitter className="h-3.5 w-3.5" />
          Twitter
        </a>

        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-sm bg-[#0077b5] text-white font-bold text-[11px] hover:bg-[#0077b5]/90 transition-all shadow-sm active:scale-95"
          onClick={() => trackShare('linkedin', 'blog', slug)}
        >
          <Linkedin className="h-3.5 w-3.5" />
          LinkedIn
        </a>
      </div>
    </div>
  );
};
