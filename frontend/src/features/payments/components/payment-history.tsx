import { Link } from 'react-router-dom';
import { CreditCard, Search, Filter } from 'lucide-react';
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
import { PaymentStatusBadge } from './payment-status-badge';
import { formatDate, formatCurrency } from '@/lib/formatters';
import type { Payment } from '../types/payment.types';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface PaymentHistoryProps {
  payments: Payment[];
  isLoading?: boolean;
  showManualPayment?: boolean;
  onManualPayment?: () => void;
}

const methodLabels = {
  MPESA: 'M-Pesa',
  CASH: 'Cash',
  BANK_TRANSFER: 'Bank Transfer',
  CARD: 'Card',
};

export const PaymentHistory = ({
  payments,
  isLoading = false,
  showManualPayment = false,
  onManualPayment,
}: PaymentHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredPayments = payments.filter((payment) => {
    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const tenantName = payment.tenant 
        ? `${payment.tenant.firstName} ${payment.tenant.lastName}`.toLowerCase()
        : '';
      const referenceMatch = (payment.reference || '').toLowerCase().includes(search);
      const tenantMatch = tenantName.includes(search);
      if (!referenceMatch && !tenantMatch) return false;
    }

    // Status filter
    if (statusFilter !== 'ALL' && payment.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const totalAmount = filteredPayments.reduce(
    (sum, p) => p.status === 'COMPLETED' ? sum + Number(p.amount) : sum, 
    0
  );

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
            Payments
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {payments.length} payments • Total Collected: {formatCurrency(totalAmount)}
          </p>
        </div>
        {showManualPayment && onManualPayment && (
          <Button onClick={onManualPayment}>
            <CreditCard className="mr-2 h-4 w-4" />
            Record Manual Payment
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search payments by tenant or reference..."
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
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="REFUNDED">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Empty State */}
      {filteredPayments.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 p-12 dark:border-neutral-800">
          <CreditCard className="h-12 w-12 text-neutral-400" />
          <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">
            No payments found
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {searchTerm || statusFilter !== 'ALL'
              ? 'Try adjusting your filters'
              : 'Payments will appear here once processed'}
          </p>
        </div>
      )}

      {/* Payment Table */}
      {filteredPayments.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50 dark:bg-neutral-800/50">
                <TableHead>Reference</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow
                  key={payment.id}
                  className="cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  onClick={() => window.location.href = `/payments/${payment.id}`}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {payment.reference || 'N/A'}
                      </p>
                      {payment.mpesaTransactionId && (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          M-Pesa: {payment.mpesaTransactionId}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {payment.tenant ? (
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">
                          {payment.tenant.firstName} {payment.tenant.lastName}
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {payment.tenant.email}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-neutral-400">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {formatCurrency(payment.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {methodLabels[payment.method]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm text-neutral-900 dark:text-white">
                        {formatDate(payment.paymentDate)}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {formatDate(payment.createdAt, { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={payment.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/payments/${payment.id}`}>
                        View
                      </Link>
                    </Button>
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