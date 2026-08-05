// Simple encryption wrapper for sensitive data
// Note: For production, consider using a proper encryption library
export const secureStorage = {
  // Simple base64 encoding (not encryption - just obfuscation)
  // For production, use a proper encryption library like crypto-js
  encrypt: (data: string): string => {
    return btoa(encodeURIComponent(data));
  },

  decrypt: (encoded: string): string => {
    try {
      return decodeURIComponent(atob(encoded));
    } catch {
      return '';
    }
  },

  set: (key: string, value: any): void => {
    try {
      const encrypted = secureStorage.encrypt(JSON.stringify(value));
      localStorage.setItem(`secure_${key}`, encrypted);
    } catch (error) {
      console.error(`Error storing secure data for key "${key}":`, error);
    }
  },

  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(`secure_${key}`);
      if (!item) return null;
      const decrypted = secureStorage.decrypt(item);
      return JSON.parse(decrypted) as T;
    } catch (error) {
      return null;
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(`secure_${key}`);
    } catch (error) {
      console.error(`Error removing secure data for key "${key}":`, error);
    }
  },
};