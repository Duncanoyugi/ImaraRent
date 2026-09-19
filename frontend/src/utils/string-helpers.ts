export const capitalize = (value: string): string =>
  value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : '';

export const titleCase = (value: string): string =>
  value
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

/** `PARTIALLY_PAID` -> `Partially paid`. Used for every enum shown in the UI. */
export const humanizeEnum = (value: string | null | undefined): string => {
  if (!value) return '';
  const lower = value.toLowerCase().replace(/_/g, ' ');
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

export const initials = (...parts: Array<string | null | undefined>): string =>
  parts
    .filter(Boolean)
    .map((part) => String(part).trim().charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

export const fullName = (
  first?: string | null,
  last?: string | null,
  fallback = 'Unknown'
): string => [first, last].filter(Boolean).join(' ').trim() || fallback;

export const truncate = (value: string, max: number): string =>
  value.length <= max ? value : `${value.slice(0, Math.max(0, max - 1)).trimEnd()}\u2026`;

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const pluralize = (count: number, singular: string, plural?: string): string =>
  `${count} ${count === 1 ? singular : plural ?? `${singular}s`}`;

/** Case-insensitive "does this row match the search box" test. */
export const matchesSearch = (term: string, ...fields: Array<unknown>): boolean => {
  const needle = term.trim().toLowerCase();
  if (!needle) return true;
  return fields.some(
    (field) => field != null && String(field).toLowerCase().includes(needle)
  );
};

export const maskEmail = (email: string): string => {
  const [name, domain] = email.split('@');
  if (!domain) return email;
  const visible = name.slice(0, 2);
  return `${visible}${'*'.repeat(Math.max(1, name.length - 2))}@${domain}`;
};
