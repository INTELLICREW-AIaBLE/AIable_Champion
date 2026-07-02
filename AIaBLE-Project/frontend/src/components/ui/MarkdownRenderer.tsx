'use client';

import React, { useMemo } from 'react';
import { Marked } from 'marked';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Instantiate marked with custom extensions for LaTeX parsing to avoid backslash escaping issues
const customMarked = new Marked({
  gfm: true,
  breaks: true,
  extensions: [
    {
      name: 'math-block',
      level: 'block',
      start(src) {
        const idx1 = src.indexOf('$$');
        const idx2 = src.indexOf('\\[');
        const idx3 = src.indexOf('\\begin{');
        const indices = [idx1, idx2, idx3].filter(idx => idx !== -1);
        return indices.length > 0 ? Math.min(...indices) : -1;
      },
      tokenizer(src) {
        const rule = /^(?:\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\]|\\begin\{([a-zA-Z*]+)\}([\s\S]*?)\\end\{\3\})/;
        const match = rule.exec(src);
        if (match) {
          let text = '';
          if (match[1] !== undefined) text = match[1];
          else if (match[2] !== undefined) text = match[2];
          else if (match[3] !== undefined && match[4] !== undefined) {
            text = `\\begin{${match[3]}}${match[4]}\\end{${match[3]}}`;
          }
          return {
            type: 'math-block',
            raw: match[0],
            text: text.trim()
          };
        }
      },
      renderer(token) {
        try {
          const html = katex.renderToString(token.text, { 
            displayMode: true, 
            throwOnError: false,
            trust: true 
          });
          return `<div class="math-block-container my-4 overflow-x-auto text-center w-full select-all ignore-dark-mode">${html}</div>`;
        } catch (e) {
          return `<pre class="katex-error p-2 bg-red-50 text-red-600 rounded text-xs overflow-x-auto">${token.raw}</pre>`;
        }
      }
    },
    {
      name: 'math-inline',
      level: 'inline',
      start(src) {
        const idx1 = src.indexOf('$');
        const idx2 = src.indexOf('\\(');
        const indices = [idx1, idx2].filter(idx => idx !== -1);
        return indices.length > 0 ? Math.min(...indices) : -1;
      },
      tokenizer(src) {
        const rule = /^(?:\$([^\$\s](?:[^\$]*?[^\$\s])?)\$|\\\(([\s\S]*?)\\\))/;
        const match = rule.exec(src);
        if (match) {
          return {
            type: 'math-inline',
            raw: match[0],
            text: (match[1] || match[2] || '').trim()
          };
        }
      },
      renderer(token) {
        try {
          const html = katex.renderToString(token.text, { 
            displayMode: false, 
            throwOnError: false,
            trust: true
          });
          return `<span class="math-inline-container inline-block px-1 select-all ignore-dark-mode">${html}</span>`;
        } catch (e) {
          return `<code class="katex-error px-1 bg-red-50 text-red-600 rounded text-xs">${token.raw}</code>`;
        }
      }
    }
  ]
});

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const renderedHtml = useMemo(() => {
    if (!content) return '';
    try {
      return customMarked.parse(content) as string;
    } catch (e) {
      console.error('Markdown rendering error:', e);
      return content;
    }
  }, [content]);

  return (
    <div 
      className={`prose prose-sm prose-slate max-w-none text-slate-800 dark:text-slate-200 leading-relaxed break-words ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedHtml }}
    />
  );
}

export default MarkdownRenderer;
