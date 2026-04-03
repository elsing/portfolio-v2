/**
 * Converts raw markdown to HTML.
 *
 * Uses the `marked` library — install with:
 *   npm install marked
 *
 * marked is small, fast, and has zero transitive dependencies.
 * It handles: headings, paragraphs, bold, italic, code blocks,
 * inline code, blockquotes, lists, tables, horizontal rules, links.
 */

import { marked }       from 'marked';
import sanitizeHtml    from 'sanitize-html';

// Configure marked options
marked.setOptions({
  gfm:    true,   // GitHub-flavoured markdown (tables, strikethrough, etc.)
  breaks: false,  // Don't convert single newlines to <br>
});

const SANITIZE_OPTS = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'del',
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img:  ['src', 'alt', 'title', 'width', 'height'],
    code: ['class'],  // for syntax highlighting class names
    pre:  ['class'],
    a:    ['href', 'title', 'target', 'rel'],
  },
  allowedSchemes: ['https', 'http', 'mailto'],
};

/**
 * Returns a sanitized HTML string from a markdown string.
 * Safe to call server-side (no window/document required).
 */
export function markdownToHtml(markdown) {
  if (!markdown) return '';
  return sanitizeHtml(marked(markdown), SANITIZE_OPTS);
}
