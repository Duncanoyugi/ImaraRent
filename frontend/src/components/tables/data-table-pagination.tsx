import { Pagination, type PaginationProps } from '@/components/ui/pagination';

export type DataTablePaginationProps = PaginationProps;

/**
 * Table-scoped alias for the pagination control.
 *
 * Kept as a named export so table code imports from `components/tables` and
 * the underlying control can be swapped without touching call sites.
 */
export const DataTablePagination = (props: DataTablePaginationProps) => (
  <Pagination {...props} />
);

DataTablePagination.displayName = 'DataTablePagination';
