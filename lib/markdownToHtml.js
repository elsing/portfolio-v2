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

import { marked } from 'marked';

// Configure marked options
marked.setOptions({
  gfm:    true,   // GitHub-flavoured markdown (tables, strikethrough, etc.)
  breaks: false,  // Don't convert single newlines to <br>
});

/**
 * Returns an HTML string from a markdown string.
 * Safe to call server-side (no window/document required).
 */
export function markdownToHtml(markdown) {
  if (!markdown) return '';
  return marked(markdown);
}
