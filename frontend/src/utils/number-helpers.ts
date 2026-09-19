export const toNumber = (value: unknown, fallback = 0): number => {
  if (value === null || value === undefined || value === '') return fallback;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
};

/**
 * Prisma serialises `Decimal` columns as strings over JSON, so every money
 * field arrives as `"12500.00"`. Everything numeric goes through here.
 */
export const decimal = (value: unknown): number => toNumber(value, 0);

export const sum = (values: Array<unknown>): number =>
  values.reduce<number>((total, value) => total + decimal(value), 0);

export const sumBy = <T>(items: T[], pick: (item: T) => unknown): number =>
  items.reduce((total, item) => total + decimal(pick(item)), 0);

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const round = (value: number, places = 2): number => {
  const factor = 10 ** places;
  return Math.round((value + Number.EPSILON) * factor) / factor;
};

/** Safe percentage — returns 0 rather than NaN/Infinity when the total is 0. */
export const percentage = (part: unknown, total: unknown, places = 1): number => {
  const t = decimal(total);
  if (t === 0) return 0;
  return round((decimal(part) / t) * 100, places);
};

export const percentChange = (current: unknown, previous: unknown): number => {
  const prev = decimal(previous);
  if (prev === 0) return decimal(current) === 0 ? 0 : 100;
  return round(((decimal(current) - prev) / Math.abs(prev)) * 100, 1);
};

export const average = (values: Array<unknown>): number => {
  if (values.length === 0) return 0;
  return round(sum(values) / values.length, 2);
};
