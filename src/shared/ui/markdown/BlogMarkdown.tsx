import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { cn } from '@/shared/lib/utils';
import {
  BLOG_MARKDOWN_COMPONENTS,
  BLOG_PROSE_CLASSNAME,
} from './blogMarkdownComponents';

/** Allow only safe inline style spans (focus dock color / font wraps). */
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    span: [...(defaultSchema.attributes?.span || []), ['style']],
    mark: [...(defaultSchema.attributes?.mark || []), ['style']],
  },
  tagNames: [...(defaultSchema.tagNames || []), 'span', 'mark'],
};

export type BlogMarkdownProps = {
  content: string;
  /** Content language — drives FR/EN callouts and FAQ copy */
  isFr: boolean;
  /**
   * `article` — public page (hash links).
   * `preview` — CMS aperçu: same typography/spacing, no section-link chrome.
   */
  variant?: 'article' | 'preview';
  className?: string;
  emptyLabel?: string;
};

/**
 * Single markdown pipeline for published articles and the admin “Aperçu” tab.
 * Spacing, headings, lists, tables, code blocks, and figures stay in sync.
 */
export const BlogMarkdown: React.FC<BlogMarkdownProps> = ({
  content,
  isFr,
  variant = 'article',
  className,
  emptyLabel,
}) => {
  const trimmed = content.trim();
  if (!trimmed) {
    return emptyLabel ? (
      <p className="text-sm text-muted-foreground">{emptyLabel}</p>
    ) : null;
  }

  const components =
    variant === 'preview'
      ? isFr
        ? BLOG_MARKDOWN_COMPONENTS.frPreview
        : BLOG_MARKDOWN_COMPONENTS.enPreview
      : isFr
        ? BLOG_MARKDOWN_COMPONENTS.fr
        : BLOG_MARKDOWN_COMPONENTS.en;

  return (
    <div className={cn(BLOG_PROSE_CLASSNAME, className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
