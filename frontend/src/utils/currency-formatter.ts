import { decimal } from './number-helpers';

const KES = (options: Intl.NumberFormatOptions = {}) =>
  new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options,
  });

/** `KSh 12,500` — the default for every amount shown in the app. */
export const money = (value: unknown): string => KES().format(decimal(value));

/** `KSh 12,500.00` — statements, receipts and invoice lines. */
export const moneyExact = (value: unknown): string =>
  KES({ minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(decimal(value));

/** `KSh 1.2M` — dashboard stat cards, where width is tight. */
export const moneyCompact = (value: unknown): string => {
  const n = decimal(value);
  if (Math.abs(n) < 10_000) return money(n);
  return KES({ notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 1 }).format(n);
};

/** Bare number, no currency symbol — for chart axes and table cells. */
export const amount = (value: unknown): string =>
  new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 }).format(decimal(value));

/** Signed, for balance movements: `+KSh 4,000` / `-KSh 4,000`. */
export const moneySigned = (value: unknown): string => {
  const n = decimal(value);
  return `${n > 0 ? '+' : n < 0 ? '-' : ''}${money(Math.abs(n))}`;
};

/** Strips formatting from a user-typed amount: `"KSh 12,500"` -> `12500`. */
export const parseAmount = (input: string): number => {
  const cleaned = input.replace(/[^0-9.-]/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
};
