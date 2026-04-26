import DOMPurify from 'dompurify';

export class Sanitizer {
  /**
   * Sanitize HTML content to prevent XSS
   * @param {string} dirty - Unsanitized HTML
   * @returns {string} Clean HTML
   */
  static sanitizeHTML(dirty) {
    return DOMPurify.sanitize(dirty, {
      ALLOWED_TAGS: ['div', 'span', 'strong', 'br', 'sup', 'sub'],
      ALLOWED_ATTR: ['style', 'class']
    });
  }

  /**
   * Sanitize mathematical expression
   * @param {string} expr - Math expression
   * @returns {string} Sanitized expression
   */
  static sanitizeMathExpression(expr) {
    // Allow only valid math characters
    const allowedPattern = /^[0-9+\-*/^().eπτφ\s,a-z]+$/i;
    if (!allowedPattern.test(expr)) {
      throw new Error('Invalid characters in expression');
    }
    return expr.trim();
  }

  /**
   * Escape HTML entities for safe text display
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  static escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}