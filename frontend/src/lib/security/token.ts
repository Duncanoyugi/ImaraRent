import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  sub: string;
  email: string;
  role: string;
  organizationId: string;
  iat: number;
  exp: number;
}

export const tokenUtils = {
  decode: (token: string): DecodedToken | null => {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  },

  isExpired: (token: string): boolean => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch {
      return true;
    }
  },

  getExpiryTime: (token: string): number | null => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.exp;
    } catch {
      return null;
    }
  },

  getRemainingTime: (token: string): number => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const now = Math.floor(Date.now() / 1000);
      return Math.max(0, decoded.exp - now);
    } catch {
      return 0;
    }
  },
};