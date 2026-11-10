import DOMPurify from 'dompurify';

export const useSanitize = () => {
  const sanitizeHtml = (html: string): string => {
    if (!html) return '';
    
    return DOMPurify.sanitize(html, {
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
    });
  };

  return {
    sanitizeHtml,
  };
};
