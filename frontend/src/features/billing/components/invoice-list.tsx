import { Link } from 'react-router-dom';
import { Plus, Receipt, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { InvoiceStatusBadge } from './invoice-status-badge';
import { formatDate, formatCurrency } from '@/lib/formatters';
import type { Invoice } from '../types/billing.types';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface InvoiceListProps {
  invoices: Invoice[];
  isLoading?: boolean;
  showGenerate?: boolean;
  onGenerate?: () => void;
  onVoid?: (id: string, reason?: string) => void;
}

export const InvoiceList = ({
  invoices,
  isLoading = false,
  showGenerate = false,
  onGenerate,
  onVoid,
}: InvoiceListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredInvoices = invoices.filter((invoice) => {
    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const tenantName = invoice.tenant 
        ? `${invoice.tenant.firstName} ${invoice.tenant.lastName}`.toLowerCase()
        : '';
      const numberMatch = invoice.invoiceNumber.toLowerCase().includes(search);
      const tenantMatch = tenantName.includes(search);
      if (!numberMatch && !tenantMatch) return false;
    }

    // Status filter
    if (statusFilter !== 'ALL' && invoice.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const totalBalance = filteredInvoices.reduce((sum, inv) => sum + Number(inv.balance), 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-10 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="rounded-2xl border border-neutral-200 p-8 dark:border-neutral-800">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="mb-4 h-16 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 last:mb-0" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Invoices
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {invoices.length} invoices • Total Balance: {formatCurrency(totalBalance)}
          </p>
        </div>
        <div className="flex gap-2">
          {showGenerate && onGenerate && (
            <Button onClick={onGenerate} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Generate Invoices
            </Button>
          )}
          <Button asChild>
            <Link to="/billing/invoices/new">
              <Plus className="mr-2 h-4 w-4" />
              Manual Invoice
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search invoices by number or tenant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="PARTIALLY_PAID">Partially Paid</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="OVERDUE">Overdue</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Empty State */}
      {filteredInvoices.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 p-12 dark:border-neutral-800">
          <Receipt className="h-12 w-12 text-neutral-400" />
          <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">
            No invoices found
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {searchTerm || statusFilter !== 'ALL'
              ? 'Try adjusting your filters'
              : 'Get started by generating or creating an invoice'}
          </p>
        </div>
      )}

      {/* Invoice Table */}
      {filteredInvoices.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50 dark:bg-neutral-800/50">
                <TableHead>Invoice</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className="cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  onClick={() => window.location.href = `/billing/invoices/${invoice.id}`}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {invoice.invoiceNumber}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {formatDate(invoice.issueDate)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {invoice.tenant ? (
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">
                          {invoice.tenant.firstName} {invoice.tenant.lastName}
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {invoice.tenant.email}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-neutral-400">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {formatCurrency(invoice.totalAmount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      'font-medium',
                      Number(invoice.balance) > 0 
                        ? 'text-error-600 dark:text-error-400'
                        : 'text-success-600 dark:text-success-400'
                    )}>
                      {formatCurrency(invoice.balance)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm text-neutral-900 dark:text-white">
                        {formatDate(invoice.dueDate)}
                      </p>
                      {new Date(invoice.dueDate) < new Date() && invoice.status !== 'PAID' && (
                        <Badge variant="destructive" className="text-[10px]">
                          Overdue
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <InvoiceStatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      {invoice.status !== 'PAID' && invoice.status !== 'CANCELLED' && onVoid && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const reason = window.prompt('Reason for voiding this invoice:');
                            if (reason !== null) {
                              onVoid(invoice.id, reason || undefined);
                            }
                          }}
                        >
                          Void
                        </Button>
                      )}
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/billing/invoices/${invoice.id}`}>
                          View
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};