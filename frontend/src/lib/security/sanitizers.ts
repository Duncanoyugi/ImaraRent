// Input sanitization utilities
export const sanitizers = {
  // Sanitize email
  sanitizeEmail: (email: string): string => {
    return email.trim().toLowerCase();
  },

  // Sanitize phone number (remove non-digits)
  sanitizePhone: (phone: string): string => {
    return phone.replace(/\D/g, '');
  },

  // Sanitize string (remove extra spaces)
  sanitizeString: (str: string): string => {
    return str.trim().replace(/\s+/g, ' ');
  },

  // Escape HTML
  escapeHtml: (str: string): string => {
    const htmlMap: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;',
    };
    return str.replace(/[&<>"'/]/g, (char) => htmlMap[char] || char);
  },

  // Validate and sanitize URL
  sanitizeUrl: (url: string): string => {
    try {
      const parsed = new URL(url);
      return parsed.toString();
    } catch {
      return '';
    }
  },

  // Truncate with ellipsis
  truncate: (str: string, maxLength: number): string => {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + '...';
  },

  // Check if string is valid email
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Check if string is valid phone number (Kenya)
  isValidKenyanPhone: (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    const phoneRegex = /^[0-9]{9,12}$/;
    return phoneRegex.test(cleaned);
  },
};