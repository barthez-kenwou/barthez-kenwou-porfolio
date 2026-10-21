import type { IBlog } from '@/entities/blogs';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import React from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from '@/shared/ui/code-block';
import { MarkdownFigure } from '@/shared/ui/markdown/MarkdownFigure';
import { Hash } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { toast } from 'sonner';
import { headingSlug } from '@/shared/lib/heading-slug';

function copySectionLink(id: string, isFr: boolean) {
  const path = `${window.location.pathname}${window.location.search}#${id}`;
  window.history.pushState(null, '', path);
  const absolute = `${window.location.origin}${path}`;
  void navigator.clipboard.writeText(absolute).then(
    () =>
      toast.success(isFr ? 'Lien de section copié' : 'Section link copied', {
        description: absolute,
      }),
    () => toast.error(isFr ? 'Impossible de copier' : 'Could not copy'),
  );
}

function isMarkdownFigureChild(node: React.ReactNode): boolean {
  return (
    React.isValidElement(node) &&
    typeof node.props === 'object' &&
    node.props !== null &&
    'data-md-figure' in node.props
  );
}

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  return (
    <details className="group my-3 border-b border-border/60 py-3 first:border-t">
      <summary className="cursor-pointer list-none text-sm font-semibold leading-snug text-foreground marker:content-none [&::-webkit-details-marker]:hidden md:text-[15px]">
        <span className="flex items-start justify-between gap-3">
          <span>{question}</span>
          <span
            className="mt-0.5 shrink-0 text-foreground/45 transition-transform group-open:rotate-45"
            aria-hidden
          >
            +
          </span>
        </span>
      </summary>
      <p className="mt-2.5 pr-6 text-sm leading-relaxed text-foreground/85">{answer}</p>
    </details>
  );
};

function Callout({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="my-6 border-l-2 border-primary/50 pl-4 py-1">
      <p className="mb-1 text-xs font-semibold text-foreground/70">{label}</p>
      <div className="text-sm leading-relaxed text-foreground/90">{children}</div>
    </aside>
  );
}

function createMarkdownComponents(isFr: boolean): Components {
  return {
    img: ({ src, alt, title }) => <MarkdownFigure src={src} alt={alt} title={title} />,
    h2: ({ children }) => {
      const textContent = React.Children.toArray(children).join('');
      const id = headingSlug(textContent);

      return (
        <h2
          id={id}
          className="group mt-9 mb-3 flex scroll-mt-28 items-start gap-1.5 text-lg font-semibold leading-snug tracking-tight text-foreground sm:mt-11 sm:mb-3.5 sm:text-xl md:text-[1.35rem]"
        >
          <a
            href={`#${id}`}
            className="mt-1 hidden shrink-0 items-center text-foreground/35 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 sm:inline-flex"
            aria-label={isFr ? 'Lien vers cette section' : 'Link to this section'}
            title={isFr ? 'Copier le lien de la section' : 'Copy section link'}
            onClick={(e) => {
              e.preventDefault();
              copySectionLink(id, isFr);
            }}
          >
            <Hash className="size-3.5" />
          </a>
          <span className="min-w-0 break-words">{children}</span>
        </h2>
      );
    },
    h3: ({ children }) => {
      const id = headingSlug(React.Children.toArray(children).join(''));
      return (
        <h3
          id={id}
          className="group mt-7 mb-2.5 flex scroll-mt-28 items-start gap-1.5 border-l-2 border-border pl-3 text-base font-semibold leading-snug tracking-tight text-foreground sm:mt-8 sm:mb-3 sm:text-[1.05rem]"
        >
          <a
            href={`#${id}`}
            className="mt-0.5 hidden shrink-0 items-center text-foreground/35 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 sm:inline-flex"
            aria-label={isFr ? 'Lien vers cette section' : 'Link to this section'}
            title={isFr ? 'Copier le lien de la section' : 'Copy section link'}
            onClick={(e) => {
              e.preventDefault();
              copySectionLink(id, isFr);
            }}
          >
            <Hash className="size-3.5" />
          </a>
          <span className="min-w-0 break-words">{children}</span>
        </h3>
      );
    },
    p: ({ children }) => {
      const kids = React.Children.toArray(children);
      if (kids.length === 1 && isMarkdownFigureChild(kids[0])) {
        return <>{kids[0]}</>;
      }
      if (
        kids.length > 0 &&
        kids.every((k) => (typeof k === 'string' ? !k.trim() : isMarkdownFigureChild(k)))
      ) {
        return <>{kids}</>;
      }

      const textContent = kids.join('');

      if (textContent.startsWith('Astuce') || textContent.startsWith('Pro tip')) {
        return <Callout label={isFr ? 'Astuce' : 'Tip'}>{children}</Callout>;
      }

      if (textContent.startsWith('Important') || textContent.startsWith('Attention')) {
        return <Callout label={isFr ? 'Important' : 'Note'}>{children}</Callout>;
      }

      if (textContent.includes('Q :') && textContent.includes('R :')) {
        const parts = textContent.split(/R\s*:/);
        const question = parts[0]
          .replace(/\*\*Q\s*:\s*/g, '')
          .replace(/\*\*/g, '')
          .trim();
        const answer = parts[1]?.trim();
        if (question && answer) {
          return <FAQItem question={question} answer={answer} />;
        }
      }

      if (textContent.startsWith('**Q :') || textContent.startsWith('Q :')) {
        return (
          <p className="mt-5 mb-1 text-sm font-semibold text-foreground">
            <span className="text-foreground/55">Q.</span>{' '}
            {textContent.replace(/\*\*?Q\s*:\s*/g, '').replace(/\*\*/g, '')}
          </p>
        );
      }

      if (textContent.startsWith('R :')) {
        return (
          <p className="mb-5 text-sm leading-relaxed text-foreground/85">
            {textContent.replace(/^R\s*:\s*/g, '')}
          </p>
        );
      }

      const hasManyHashtags = (textContent.match(/#\w+/g) || []).length >= 3;
      const isTagLine =
        textContent.toLowerCase().includes('tags') && textContent.includes('#');
      if (isTagLine || hasManyHashtags) {
        return null;
      }

      return (
        <p className="mb-4 max-w-full text-sm leading-relaxed break-words text-foreground/90 md:mb-5">
          {children}
        </p>
      );
    },
    a: ({ href, children, ...props }) => (
      <a
        href={href}
        className="break-words font-medium text-primary no-underline hover:underline [overflow-wrap:anywhere]"
        {...props}
      >
        {children}
      </a>
    ),
    pre: ({ children }) => <>{children}</>,
    code: ({ className, children, ...props }) => {
      const text = String(children).replace(/\n$/, '');
      const match = /language-(\w+)/.exec(className || '');
      const isBlock = Boolean(match) || text.includes('\n');

      if (isBlock) {
        return (
          <CodeBlock language={match?.[1] || ''} value={text} className="my-7 max-w-full border-border" />
        );
      }

      return (
        <code
          className="rounded-sm border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.85em] font-medium break-all text-foreground [overflow-wrap:anywhere]"
          {...props}
        >
          {children}
        </code>
      );
    },
    li: ({ children }) => (
      <li className="mb-1.5 flex min-w-0 items-start gap-2.5">
        <span
          className="mt-[0.55em] size-1 shrink-0 rounded-full bg-foreground/40"
          aria-hidden
        />
        <span className="min-w-0 flex-1 text-sm leading-relaxed break-words text-foreground/90 [overflow-wrap:anywhere]">
          {children}
        </span>
      </li>
    ),
    table: ({ children }) => (
      <div className="my-6 max-w-full overflow-x-auto border border-border">
        <table className="w-full min-w-0 border-collapse text-left text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="border-b border-border bg-muted/40">{children}</thead>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-border/60">{children}</tbody>
    ),
    tr: ({ children }) => <tr>{children}</tr>,
    th: ({ children }) => (
      <th className="px-3 py-2.5 text-left text-xs font-semibold tracking-normal whitespace-nowrap text-foreground md:px-4">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-3 py-2 text-sm text-foreground/90 md:px-4">{children}</td>
    ),
  };
}

// Module-stable maps: a new `components` object identity makes ReactMarkdown
// remount every CodeBlock (spinner → height collapse → scroll jump).
const MARKDOWN_COMPONENTS = {
  fr: createMarkdownComponents(true),
  en: createMarkdownComponents(false),
} as const;

function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 36,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-0.5 origin-left bg-primary"
      style={{ scaleX }}
      aria-hidden
    />
  );
}

export const ArticleContentSection: React.FC<{ post: IBlog }> = React.memo(({ post }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const content = isFr ? post.contentFr : post.contentEn;
  const components = isFr ? MARKDOWN_COMPONENTS.fr : MARKDOWN_COMPONENTS.en;

  return (
    <article className="relative min-w-0 max-w-full">
      <ReadingProgressBar />

      <div
        className="prose prose-sm mb-8 min-w-0 max-w-full dark:prose-invert md:prose-base md:mb-10
          prose-headings:scroll-mt-28 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground
          prose-p:mb-4 prose-p:max-w-full prose-p:leading-relaxed prose-p:break-words prose-p:text-foreground/90 md:prose-p:mb-5
          prose-a:font-medium prose-a:break-words prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:font-semibold prose-strong:text-foreground
          prose-code:break-all
          prose-blockquote:border-l-primary/40 prose-blockquote:bg-transparent prose-blockquote:px-4 prose-blockquote:py-0.5 prose-blockquote:not-italic prose-blockquote:text-foreground/85
          prose-ul:list-none prose-ul:pl-0
          prose-ol:min-w-0 prose-ol:pl-5 prose-ol:marker:font-medium prose-ol:marker:text-foreground/55"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {content}
        </ReactMarkdown>
      </div>
    </article>
  );
});

ArticleContentSection.displayName = 'ArticleContentSection';
