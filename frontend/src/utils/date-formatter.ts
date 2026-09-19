const toDate = (value: string | Date | null | undefined): Date | null => {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

const fmt = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-KE', options);

/** `12 Mar 2026` */
export const shortDate = (value: string | Date | null | undefined, fallback = '—'): string => {
  const d = toDate(value);
  return d ? fmt({ day: 'numeric', month: 'short', year: 'numeric' }).format(d) : fallback;
};

/** `Thursday, 12 March 2026` */
export const longDate = (value: string | Date | null | undefined, fallback = '—'): string => {
  const d = toDate(value);
  return d
    ? fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d)
    : fallback;
};

/** `12 Mar 2026, 14:30` */
export const dateTime = (value: string | Date | null | undefined, fallback = '—'): string => {
  const d = toDate(value);
  return d
    ? fmt({
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d)
    : fallback;
};

/** `March 2026` — billing periods and report headers. */
export const monthYear = (value: string | Date | null | undefined, fallback = '—'): string => {
  const d = toDate(value);
  return d ? fmt({ month: 'long', year: 'numeric' }).format(d) : fallback;
};

/** `yyyy-MM-dd` — what every `<input type="date">` and API query expects. */
export const toInputDate = (value: string | Date | null | undefined): string => {
  const d = toDate(value);
  if (!d) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/** ISO string at local midnight — avoids the timezone off-by-one on date inputs. */
export const toApiDate = (value: string | Date | null | undefined): string | undefined => {
  const d = toDate(value);
  if (!d) return undefined;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0).toISOString();
};

export const relativeTime = (value: string | Date | null | undefined): string => {
  const d = toDate(value);
  if (!d) return '';
  const diffMs = Date.now() - d.getTime();
  const abs = Math.abs(diffMs);
  const mins = Math.round(abs / 60_000);
  const hours = Math.round(abs / 3_600_000);
  const days = Math.round(abs / 86_400_000);
  const past = diffMs >= 0;
  const phrase = (n: number, unit: string) =>
    past ? `${n} ${unit}${n === 1 ? '' : 's'} ago` : `in ${n} ${unit}${n === 1 ? '' : 's'}`;

  if (mins < 1) return past ? 'Just now' : 'In a moment';
  if (mins < 60) return phrase(mins, 'minute');
  if (hours < 24) return phrase(hours, 'hour');
  if (days < 30) return phrase(days, 'day');
  return shortDate(d);
};

/** Negative when overdue. Used for invoice due dates and lease expiry. */
export const daysUntil = (value: string | Date | null | undefined): number | null => {
  const d = toDate(value);
  if (!d) return null;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - start.getTime()) / 86_400_000);
};

export const isPast = (value: string | Date | null | undefined): boolean => {
  const d = toDate(value);
  return d ? d.getTime() < Date.now() : false;
};

/** Human phrasing for a due date: `Due in 5 days`, `Overdue by 3 days`, `Due today`. */
export const duePhrase = (value: string | Date | null | undefined): string => {
  const days = daysUntil(value);
  if (days === null) return '';
  if (days === 0) return 'Due today';
  if (days > 0) return `Due in ${days} day${days === 1 ? '' : 's'}`;
  const overdue = Math.abs(days);
  return `Overdue by ${overdue} day${overdue === 1 ? '' : 's'}`;
};

/** First and last day of a month, as ISO strings — used by report filters. */
export const monthBounds = (year: number, month: number) => {
  const start = new Date(year, month, 1, 12);
  const end = new Date(year, month + 1, 0, 12);
  return { startDate: start.toISOString(), endDate: end.toISOString() };
};

export const currentMonthBounds = () => {
  const now = new Date();
  return monthBounds(now.getFullYear(), now.getMonth());
};
