/** Shared primitives used across every domain module. */

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface SelectOption<T extends string = string> {
  label: string;
  value: T;
  description?: string;
  disabled?: boolean;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export type LoadState = 'idle' | 'loading' | 'success' | 'error';

/** Every list screen funnels its controls through this shape. */
export interface ListFilters extends PaginationParams, SortParams {
  search?: string;
  status?: string;
  propertyId?: string;
  from?: string;
  to?: string;
}

export type Nullable<T> = T | null;
export type Maybe<T> = T | null | undefined;

/** Turns `{ a: 1, b: undefined }` into `?a=1` — undefined/empty keys are dropped. */
export const toQueryString = (params: Record<string, unknown> = {}): string => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) {
      value.forEach((v) => search.append(key, String(v)));
    } else {
      search.append(key, String(value));
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
};
