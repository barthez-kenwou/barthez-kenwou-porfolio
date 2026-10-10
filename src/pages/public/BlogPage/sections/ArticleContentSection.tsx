import type { IBlog } from '@/entities/blogs';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from '@/shared/ui/code-block';
import { MarkdownFigure } from '@/shared/ui/markdown/MarkdownFigure';
import { Hash } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';

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

export const ArticleContentSection: React.FC<{ post: IBlog }> = ({ post }) => {
  const { language } = useLanguageStore();
  const isFr = language === 'fr';
  const content = language === 'fr' ? post.contentFr : post.contentEn;

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 36,
    restDelta: 0.001,
  });

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

  return (
    <article className="relative max-w-none">
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 h-0.5 origin-left bg-primary"
        style={{ scaleX }}
        aria-hidden
      />

      <div
        className="prose prose-sm mb-8 max-w-none dark:prose-invert md:prose-base md:mb-10
          prose-headings:scroll-mt-28 prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground
          prose-p:mb-4 prose-p:leading-relaxed prose-p:text-foreground/90 md:prose-p:mb-5
          prose-a:font-medium prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:font-semibold prose-strong:text-foreground
          prose-blockquote:border-l-primary/40 prose-blockquote:bg-transparent prose-blockquote:px-4 prose-blockquote:py-0.5 prose-blockquote:not-italic prose-blockquote:text-foreground/85
          prose-ul:list-none prose-ul:pl-0
          prose-ol:pl-5 prose-ol:marker:font-medium prose-ol:marker:text-foreground/55"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ src, alt, title }) => (
              <MarkdownFigure src={src} alt={alt} title={title} />
            ),
            h2: ({ children }) => {
              const textContent = React.Children.toArray(children).join('');
              const id = slugify(textContent);

              return (
                <h2
                  id={id}
                  className="group relative mt-9 mb-3 text-lg font-semibold leading-snug tracking-tight text-foreground sm:mt-11 sm:mb-3.5 sm:text-xl md:text-[1.35rem]"
                >
                  <a
                    href={`#${id}`}
                    className="absolute top-1 left-0 hidden -translate-x-[110%] items-center text-foreground/35 opacity-0 transition-opacity group-hover:opacity-100 sm:flex"
                    aria-label={isFr ? 'Ancre de section' : 'Section anchor'}
                  >
                    <Hash className="size-3.5" />
                  </a>
                  <span className="min-w-0">{children}</span>
                </h2>
              );
            },
            h3: ({ children }) => {
              const id = slugify(React.Children.toArray(children).join(''));
              return (
                <h3
                  id={id}
                  className="mt-7 mb-2.5 border-l-2 border-border pl-3 text-base font-semibold leading-snug tracking-tight text-foreground sm:mt-8 sm:mb-3 sm:text-[1.05rem]"
                >
                  {children}
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
                kids.every((k) =>
                  typeof k === 'string' ? !k.trim() : isMarkdownFigureChild(k),
                )
              ) {
                return <>{kids}</>;
              }

              const textContent = kids.join('');

              if (textContent.startsWith('Astuce') || textContent.startsWith('Pro tip')) {
                return (
                  <Callout label={isFr ? 'Astuce' : 'Tip'}>{children}</Callout>
                );
              }

              if (textContent.startsWith('Important') || textContent.startsWith('Attention')) {
                return (
                  <Callout label={isFr ? 'Important' : 'Note'}>{children}</Callout>
                );
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

              // Markdown tag clouds are rendered via ArticleEndTags (post.tags) instead.
              const hasManyHashtags = (textContent.match(/#\w+/g) || []).length >= 3;
              const isTagLine =
                textContent.toLowerCase().includes('tags') && textContent.includes('#');
              if (isTagLine || hasManyHashtags) {
                return null;
              }

              return (
                <p className="mb-4 text-sm leading-relaxed text-foreground/90 md:mb-5">
                  {children}
                </p>
              );
            },
            pre: ({ children }) => <>{children}</>,
            code: ({ className, children, ...props }) => {
              const text = String(children).replace(/\n$/, '');
              const match = /language-(\w+)/.exec(className || '');
              const isBlock = Boolean(match) || text.includes('\n');

              if (isBlock) {
                return (
                  <CodeBlock
                    language={match?.[1] || ''}
                    value={text}
                    className="my-7 border-border"
                  />
                );
              }

              return (
                <code
                  className="rounded-sm border border-border/70 bg-muted/50 px-1 py-0.5 font-mono text-[0.85em] font-medium text-foreground"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            li: ({ children }) => (
              <li className="mb-1.5 flex items-start gap-2.5">
                <span
                  className="mt-[0.55em] size-1 shrink-0 rounded-full bg-foreground/40"
                  aria-hidden
                />
                <span className="text-sm leading-relaxed text-foreground/90">{children}</span>
              </li>
            ),
            table: ({ children }) => (
              <div className="my-6 w-full overflow-x-auto border border-border">
                <table className="w-full border-collapse text-left text-sm">{children}</table>
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
              <th className="px-3 py-2.5 text-left text-xs font-semibold tracking-normal text-foreground whitespace-nowrap md:px-4">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-3 py-2 text-sm text-foreground/90 md:px-4">{children}</td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </article>
  );
};
