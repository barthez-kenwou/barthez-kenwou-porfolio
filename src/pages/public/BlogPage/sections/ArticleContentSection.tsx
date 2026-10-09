import { FaMicroblog } from 'react-icons/fa';
import type { IBlog } from '@/entities/blogs';
import { useLanguageStore } from '@/shared/state/useLanguageStore';
import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from '@/shared/ui/code-block';
import {
  Info,
  Lightbulb,
  ChevronRight,
  Hash,
  HelpCircle,
  MessageCircle,
  Plus,
  Minus,
  Tag,
} from 'lucide-react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';

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
          <span className="text-sm md:text-base font-bold text-foreground/90">{question}</span>
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
              <div className="flex gap-3 rounded-md bg-muted/30 p-4 border-l-2 border-primary/30">
                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center text-primary/60">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground/90 italic">{answer}</p>
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // This could be used for a Table of Contents highlighting
            // Currently unused in this component
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' },
    );

    const headers = document.querySelectorAll('h2, h3');
    headers.forEach((header) => observer.observe(header));

    return () => observer.disconnect();
  }, [content]);

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
        className="prose prose-sm md:prose-base dark:prose-invert max-w-none 
          prose-headings:scroll-mt-32 prose-headings:font-bold prose-headings:tracking-tight
          prose-p:text-muted-foreground/80 prose-p:leading-relaxed prose-p:mb-6
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-semibold
          prose-strong:text-foreground prose-strong:font-bold
          prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:px-5 prose-blockquote:rounded-r-lg prose-blockquote:italic
          prose-img:rounded-sm prose-img:border prose-img:border-border/50
          prose-ul:list-none prose-ul:pl-0
          prose-ol:pl-5 marker:text-primary marker:font-bold
          mb-16"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ children }) => {
              const textContent = React.Children.toArray(children).join('');
              const isFAQ = textContent.toLowerCase().includes('faq');
              const id = slugify(textContent);

              return (
                <h2
                  id={id}
                  className={`group relative mt-12 mb-6 flex items-center gap-3 article-heading ${isFAQ ? 'text-primary' : ''}`}
                >
                  <a
                    href={`#${id}`}
                    className="absolute left-0 -translate-x-[110%] hidden sm:flex items-center opacity-0 transition-all group-hover:opacity-100 text-primary"
                  >
                    <Hash className="h-5 w-5" />
                  </a>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-mono ${isFAQ ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20' : 'bg-primary/10 text-primary'}`}
                  >
                    {isFAQ ? (
                      <HelpCircle className="h-4 w-4" />
                    ) : (
                      <FaMicroblog className="h-3.5 w-3.5" />
                    )}
                  </span>
                  {children}
                  {isFAQ && (
                    <span className="ml-2 h-1 w-12 bg-gradient-to-r from-primary to-transparent rounded-full" />
                  )}
                </h2>
              );
            },
            // Header 3
            h3: ({ children }) => {
              const id = slugify(React.Children.toArray(children).join(''));
              return (
                <h3 id={id} className="group flex items-center gap-2 mt-10 mb-4 article-subheading">
                  <ChevronRight className="h-4 w-4 shrink-0 text-primary/50 transition-transform group-hover:translate-x-1" />
                  {children}
                </h3>
              );
            },
            // Paragraph & Strategic Blocks
            p: ({ children }) => {
              const textContent = React.Children.toArray(children).join('');

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
                        <div className="text-foreground/90 text-sm md:text-sm leading-relaxed italic">
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
                  <div className="mb-6 p-4 bg-muted/30 border-l-2 border-muted rounded-r-lg text-muted-foreground italic">
                    <span className="text-foreground/60 font-bold not-italic mr-2">R:</span>{' '}
                    {textContent.replace(/^R\s*:\s*/g, '')}
                  </div>
                );
              }

              // Tags Detection (e.g. **Tags** : #... #... or just #Tag1 #Tag2)
              const hasManyHashtags = (textContent.match(/#\w+/g) || []).length >= 3;
              const isTagLine =
                textContent.toLowerCase().includes('tags') && textContent.includes('#');

              if (isTagLine || hasManyHashtags) {
                const tagsMatch = textContent.match(/#\w+/g);
                if (tagsMatch) {
                  return (
                    <div className="my-8 flex flex-wrap gap-2 items-center">
                      <div className="text-xs font-black uppercase tracking-widest text-primary/60">
                        <Tag className="h-3 w-3" />
                      </div>
                      {tagsMatch.map((tag, i) => (
                        <motion.span
                          key={i}
                          className="px-2 py-.5 text-[9px] md:text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 rounded-full cursor-default
                            transition-all shadow-sm "
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  );
                }
              }

              return (
                <p className="mb-6 leading-relaxed text-muted-foreground/90 text-sm md:text-sm">
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
              <li className="flex items-start gap-2 mb-0 group">
                <span className="mt-2 flex h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40 transition-all group-hover:scale-150 group-hover:bg-primary shadow-[0_0_6px_rgba(var(--primary),0.3)]" />
                <span className="text-muted-foreground/90 leading-relaxed text-sm">{children}</span>
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
              <td className="px-5 py-2 text-muted-foreground/80 group-hover/row:text-foreground/90 transition-colors">
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
