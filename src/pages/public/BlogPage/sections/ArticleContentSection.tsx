import { FaMicroblog } from 'react-icons/fa';
import type { IBlog } from '@/entities/blogs';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from '@/shared/ui/code-block';
import { MarkdownFigure } from '@/shared/ui/markdown/MarkdownFigure';
import {
  Info,
  Lightbulb,
  ChevronRight,
  Hash,
  HelpCircle,
  MessageCircle,
  Plus,
  Minus,
} from 'lucide-react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';

function isMarkdownFigureChild(node: React.ReactNode): boolean {
  return (
    React.isValidElement(node) &&
    typeof node.props === 'object' &&
    node.props !== null &&
    'data-md-figure' in node.props
  );
}

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="my-4 overflow-hidden rounded-md border border-border/50 bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-primary/20"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-primary/5"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <HelpCircle className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-foreground md:text-base">{question}</span>
        </div>
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border transition-transform duration-300 ${isOpen ? 'rotate-180 bg-primary border-primary text-primary-foreground' : ''}`}
        >
          {isOpen ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-4 pb-4 pt-0">
              <div className="flex gap-3 rounded-md border-l-2 border-primary/40 bg-muted/40 p-4">
                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center text-primary">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">{answer}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const ArticleContentSection: React.FC<{ post: IBlog }> = ({ post }) => {
  const { language } = useLanguageStore();

  const content = language === 'fr' ? post.contentFr : post.contentEn;

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Function to slugify text for anchors
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  return (
    <article className="relative max-w-none">
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="prose prose-sm md:prose-base dark:prose-invert mb-8 max-w-none md:mb-12
          prose-headings:scroll-mt-28 prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
          prose-p:mb-4 prose-p:leading-relaxed prose-p:text-foreground/90 md:prose-p:mb-5
          prose-a:font-semibold prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:font-bold prose-strong:text-foreground
          prose-blockquote:rounded-r-lg prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:px-4 prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:text-foreground/90
          prose-ul:list-none prose-ul:pl-0
          prose-ol:pl-5 marker:font-bold marker:text-primary"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ src, alt, title }) => (
              <MarkdownFigure src={src} alt={alt} title={title} />
            ),
            h2: ({ children }) => {
              const textContent = React.Children.toArray(children).join('');
              const isFAQ = textContent.toLowerCase().includes('faq');
              const id = slugify(textContent);

              return (
                <h2
                  id={id}
                  className={`group relative mt-8 mb-3 flex items-start gap-2.5 text-lg font-bold leading-snug tracking-tight sm:mt-10 sm:mb-4 sm:text-xl md:text-2xl ${isFAQ ? 'text-primary' : 'text-foreground'}`}
                >
                  <a
                    href={`#${id}`}
                    className="absolute top-1 left-0 hidden -translate-x-[110%] items-center text-primary opacity-0 transition-all group-hover:opacity-100 sm:flex"
                    aria-label="Anchor"
                  >
                    <Hash className="size-4" />
                  </a>
                  <span
                    className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md sm:size-7 ${isFAQ ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}
                  >
                    {isFAQ ? (
                      <HelpCircle className="size-3.5" />
                    ) : (
                      <FaMicroblog className="size-3" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">{children}</span>
                </h2>
              );
            },
            h3: ({ children }) => {
              const id = slugify(React.Children.toArray(children).join(''));
              return (
                <h3
                  id={id}
                  className="group mt-6 mb-2.5 flex items-start gap-1.5 text-base font-semibold leading-snug tracking-tight text-foreground sm:mt-8 sm:mb-3 sm:text-lg"
                >
                  <ChevronRight className="mt-1 size-3.5 shrink-0 text-primary/80 transition-transform group-hover:translate-x-0.5" />
                  <span className="min-w-0 flex-1">{children}</span>
                </h3>
              );
            },
            // Paragraph & Strategic Blocks
            p: ({ children }) => {
              const kids = React.Children.toArray(children);
              // Avoid invalid <p><figure> — bare markdown images become block figures.
              if (kids.length === 1 && isMarkdownFigureChild(kids[0])) {
                return <>{kids[0]}</>;
              }
              if (
                kids.length > 0 &&
                kids.every((k) => typeof k === 'string' ? !k.trim() : isMarkdownFigureChild(k))
              ) {
                return <>{kids}</>;
              }

              const textContent = kids.join('');

              if (textContent.startsWith('Astuce') || textContent.startsWith('Pro tip')) {
                return (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="my-8 overflow-hidden relative rounded-sm border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-3 md:p-4"
                  >
                    <div className="absolute top-0 right-0 p-3 opacity-5">
                      <Lightbulb className="h-16 w-16 text-primary" />
                    </div>
                    <div className="relative flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-primary/20 text-primary">
                        <Lightbulb className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1.5 block">
                          {language === 'fr' ? 'Astuce de Pro' : 'Pro Tip'}
                        </span>
                        <div className="text-sm leading-relaxed text-foreground md:text-sm">
                          {children}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              if (textContent.startsWith('Important') || textContent.startsWith('Attention')) {
                return (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="my-8 overflow-hidden relative rounded-sm border border-primary/25 bg-gradient-to-br from-primary/10 to-transparent p-5 md:p-6"
                  >
                    <div className="absolute top-0 right-0 p-3 opacity-5">
                      <Info className="h-16 w-16 text-primary" />
                    </div>
                    <div className="relative flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary">
                        <Info className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1.5 block">
                          {language === 'fr' ? 'Attention' : 'Important'}
                        </span>
                        <div className="text-foreground/90 text-sm md:text-sm leading-relaxed font-medium">
                          {children}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              }

              // Dynamic FAQ Detection
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

              // Individual Q or R (if separate)
              if (textContent.startsWith('**Q :') || textContent.startsWith('Q :')) {
                return (
                  <div className="mt-6 p-4 bg-primary/5 border-l-2 border-primary rounded-r-lg font-bold text-foreground">
                    <span className="text-primary mr-2">Q:</span>{' '}
                    {textContent.replace(/\*\*?Q\s*:\s*/g, '').replace(/\*\*/g, '')}
                  </div>
                );
              }

              if (textContent.startsWith('R :')) {
                return (
                  <div className="mb-6 rounded-r-lg border-l-2 border-border bg-muted/40 p-4 text-foreground/90">
                    <span className="mr-2 font-bold text-foreground">R:</span>{' '}
                    {textContent.replace(/^R\s*:\s*/g, '')}
                  </div>
                );
              }

              // Bottom hashtag clouds are redundant with header tags — hide them.
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
            // react-markdown v9+ dropped `inline`. Fenced blocks are pre>code;
            // unwrap pre so CodeBlock (div) is never nested in <pre> or <p>.
            pre: ({ children }) => <>{children}</>,
            code: ({ className, children, ...props }) => {
              const text = String(children).replace(/\n$/, '');
              const match = /language-(\w+)/.exec(className || '');
              // Fence: language-* class, or multiline body (``` without lang)
              const isBlock = Boolean(match) || text.includes('\n');

              if (isBlock) {
                return (
                  <CodeBlock
                    language={match?.[1] || ''}
                    value={text}
                    className="my-8 shadow-sm shadow-primary/5 border-primary/10"
                  />
                );
              }

              return (
                <code
                  className="rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[0.8em] font-bold text-primary border border-primary/20"
                  {...props}
                >
                  {children}
                </code>
              );
            },

            // Lists
            li: ({ children }) => (
              <li className="group mb-0 flex items-start gap-2">
                <span className="mt-2 flex h-1.5 w-1.5 shrink-0 rounded-full bg-primary transition-transform group-hover:scale-125" />
                <span className="text-sm leading-relaxed text-foreground/90">{children}</span>
              </li>
            ),
            // Tables
            table: ({ children }) => (
              <div className="relative my-6 w-full overflow-hidden rounded-sm border border-border/50 bg-card/30 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-sm hover:border-primary/20 group/table-container">
                {/* Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/50 via-primary/20 to-transparent" />

                <div className="overflow-x-auto scrollbar-hide relative group/table">
                  <table className="w-full border-collapse text-left text-sm md:text-sm">
                    {children}
                  </table>

                  {/* Mobile Scroll Indicator */}
                  <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background/20 to-transparent pointer-events-none md:hidden opacity-0 group-hover/table:opacity-100 transition-opacity" />
                </div>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-primary/5 border-b border-border/50">{children}</thead>
            ),
            tbody: ({ children }) => (
              <tbody className="divide-y divide-border/10"> {children} </tbody>
            ),
            tr: ({ children }) => (
              <tr className="transition-colors hover:bg-primary/5 even:bg-muted/10 group/row">
                {children}
              </tr>
            ),
            th: ({ children }) => (
              <th className="px-5 py-3 font-bold text-foreground/90 uppercase tracking-widest text-[10px] md:text-[11px] whitespace-nowrap">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-5 py-2 text-foreground/90 transition-colors group-hover/row:text-foreground">
                {children}
              </td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </motion.div>
    </article>
  );
};
