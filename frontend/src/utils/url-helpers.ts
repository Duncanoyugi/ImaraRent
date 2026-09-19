/** Fills `:id` style placeholders: `buildPath('/users/:id', { id: 'abc' })`. */
export const buildPath = (
  template: string,
  params: Record<string, string | number>
): string =>
  Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, encodeURIComponent(String(value))),
    template
  );

export const withQuery = (path: string, params: Record<string, unknown> = {}): string => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) value.forEach((v) => search.append(key, String(v)));
    else search.append(key, String(value));
  });
  const qs = search.toString();
  return qs ? `${path}?${qs}` : path;
};

export const parseQuery = (search: string): Record<string, string> =>
  Object.fromEntries(new URLSearchParams(search).entries());

/** Only allows same-origin relative paths — blocks open-redirect via `?next=`. */
export const safeRedirect = (target: string | null | undefined, fallback = '/dashboard'): string => {
  if (!target) return fallback;
  if (!target.startsWith('/') || target.startsWith('//')) return fallback;
  return target;
};
