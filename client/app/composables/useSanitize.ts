import DOMPurify from 'isomorphic-dompurify';

const SANITIZE_OPTIONS = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 's',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote',
    'a',
    'img',
    'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
    'span', 'div'
  ],
  ALLOWED_ATTR: [
    'href', 'src', 'alt', 'title', 'target', 'rel',
    'class', 'style', 'width', 'height'
  ],
  ALLOW_DATA_ATTR: false,
} as const;

export const useSanitize = () => {
  /**
   * isomorphic-dompurify exposes a working sanitizer both in the browser and
   * during SSR (where plain `dompurify` has no DOM and throws
   * "DOMPurify.sanitize is not a function").
   */
  const sanitizeHtml = (html: string): string => {
    if (!html) return '';

    return DOMPurify.sanitize(html, SANITIZE_OPTIONS);
  };

  return {
    sanitizeHtml,
  };
};
