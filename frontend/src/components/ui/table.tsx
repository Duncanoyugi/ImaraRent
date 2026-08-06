import { cn } from '@/lib/utils';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}

const Table = ({ className, ...props }: TableProps) => (
  <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
);

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableHeader = ({ className, ...props }: TableHeaderProps) => (
  <thead className={cn('border-b border-neutral-200 dark:border-neutral-800', className)} {...props} />
);

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableBody = ({ className, ...props }: TableBodyProps) => (
  <tbody className={cn('', className)} {...props} />
);

interface TableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {}

const TableFooter = ({ className, ...props }: TableFooterProps) => (
  <tfoot className={cn('border-t border-neutral-200 dark:border-neutral-800', className)} {...props} />
);

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}

const TableRow = ({ className, ...props }: TableRowProps) => (
  <tr className={cn('border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50', className)} {...props} />
);

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}

const TableHead = ({ className, ...props }: TableHeadProps) => (
  <th className={cn('px-4 py-3 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400', className)} {...props} />
);

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

const TableCell = ({ className, ...props }: TableCellProps) => (
  <td className={cn('px-4 py-3', className)} {...props} />
);

interface TableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {}

const TableCaption = ({ className, ...props }: TableCaptionProps) => (
  <caption className={cn('mt-4 text-sm text-neutral-500 dark:text-neutral-400', className)} {...props} />
);

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
