export const isEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

/**
 * Kenyan mobile numbers. Accepts the four forms people actually type:
 * `0712345678`, `712345678`, `254712345678`, `+254712345678`.
 */
export const isKenyanPhone = (value: string): boolean => {
  const digits = value.replace(/[\s-]/g, '');
  return /^(?:\+?254|0)?7\d{8}$/.test(digits) || /^(?:\+?254|0)?1\d{8}$/.test(digits);
};

/** Normalises any accepted form to the `2547XXXXXXXX` that Daraja requires. */
export const toMsisdn = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('254')) return digits.slice(0, 12);
  if (digits.startsWith('0')) return `254${digits.slice(1, 10)}`;
  if (digits.length === 9) return `254${digits}`;
  return digits;
};

export const isNationalId = (value: string): boolean => /^\d{7,9}$/.test(value.replace(/\s/g, ''));

export const isStrongPassword = (value: string): boolean =>
  value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  hints: string[];
}

export const passwordStrength = (value: string): PasswordStrength => {
  const hints: string[] = [];
  let score = 0;

  if (value.length >= 8) score += 1;
  else hints.push('Use at least 8 characters');

  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  else hints.push('Mix upper and lower case');

  if (/\d/.test(value)) score += 1;
  else hints.push('Add a number');

  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  else hints.push('Add a symbol');

  const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
  return { score: score as PasswordStrength['score'], label: labels[score], hints };
};

export const isPositiveAmount = (value: unknown): boolean => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0;
};

export const isUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

/** End date must not precede start date — leases and report ranges. */
export const isValidRange = (start?: string | null, end?: string | null): boolean => {
  if (!start || !end) return true;
  return new Date(end).getTime() >= new Date(start).getTime();
};
