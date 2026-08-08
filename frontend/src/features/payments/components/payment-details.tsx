import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Calendar,
  User,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PaymentStatusBadge } from './payment-status-badge';
import { formatDate, formatCurrency } from '@/lib/formatters';
import type { Payment } from '../types/payment.types';
import { cn } from '@/lib/utils';

interface PaymentDetailsProps {
  payment: Payment;
}

const methodLabels = {
  MPESA: 'M-Pesa',
  CASH: 'Cash',
  BANK_TRANSFER: 'Bank Transfer',
  CARD: 'Card',
};

const methodIcons = {
  MPESA: Smartphone,
  CASH: CreditCard,
  BANK_TRANSFER: FileText,
  CARD: CreditCard,
};

export const PaymentDetails = ({ payment }: PaymentDetailsProps) => {
  const navigate = useNavigate();
  const MethodIcon = methodIcons[payment.method];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/payments')}
            className="h-9 w-9 shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Payment Details
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <PaymentStatusBadge status={payment.status} />
              <Badge variant="outline" className="gap-1">
                <MethodIcon className="h-3 w-3" />
                {methodLabels[payment.method]}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Amount</p>
                <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                  {formatCurrency(payment.amount)}
                </p>
              </div>
              <div className="rounded-xl bg-brand-100 p-2 dark:bg-brand-900/30">
                <CreditCard className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Payment Date</p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {formatDate(payment.paymentDate)}
                </p>
                <p className="text-xs text-neutral-400">
                  {formatDate(payment.paymentDate, { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <div className="rounded-xl bg-neutral-100 p-2 dark:bg-neutral-800">
                <Calendar className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Reference</p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {payment.reference || 'N/A'}
                </p>
                {payment.mpesaTransactionId && (
                  <p className="text-xs text-neutral-400">
                    M-Pesa: {payment.mpesaTransactionId}
                  </p>
                )}
              </div>
              <div className="rounded-xl bg-neutral-100 p-2 dark:bg-neutral-800">
                <FileText className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Status</p>
                <div className="mt-1">
                  <PaymentStatusBadge status={payment.status} />
                </div>
              </div>
              <div className={cn(
                'rounded-xl p-2',
                payment.status === 'COMPLETED' 
                  ? 'bg-success-100 dark:bg-success-900/30'
                  : payment.status === 'PENDING'
                  ? 'bg-warning-100 dark:bg-warning-900/30'
                  : 'bg-error-100 dark:bg-error-900/30'
              )}>
                {payment.status === 'COMPLETED' && (
                  <CheckCircle className="h-5 w-5 text-success-600 dark:text-success-400" />
                )}
                {payment.status === 'PENDING' && (
                  <Clock className="h-5 w-5 text-warning-600 dark:text-warning-400" />
                )}
                {payment.status === 'FAILED' && (
                  <XCircle className="h-5 w-5 text-error-600 dark:text-error-400" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tenant Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4" />
            Tenant Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {payment.tenant ? (
            <div className="space-y-2">
              <p className="font-medium text-neutral-900 dark:text-white">
                {payment.tenant.firstName} {payment.tenant.lastName}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {payment.tenant.email}
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {payment.tenant.phone}
              </p>
              <Button asChild variant="link" className="px-0">
                <Link to={`/tenants/${payment.tenantId}`}>
                  View Tenant Profile
                </Link>
              </Button>
            </div>
          ) : (
            <p className="text-sm text-neutral-500">Tenant information not available</p>
          )}
        </CardContent>
      </Card>

      {/* Allocations */}
      {payment.allocations && payment.allocations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Invoice Allocations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {payment.allocations.map((allocation) => (
                <div
                  key={allocation.id}
                  className="flex items-center justify-between rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50"
                >
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">
                      {allocation.invoice?.invoiceNumber || 'Invoice'}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Allocated: {formatDate(allocation.allocatedAt)}
                    </p>
                  </div>
                  <p className="font-medium text-brand-600 dark:text-brand-400">
                    {formatCurrency(allocation.amount)}
                  </p>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex items-center justify-between font-bold">
                <span className="text-neutral-900 dark:text-white">Total Allocated</span>
                <span className="text-brand-600 dark:text-brand-400">
                  {formatCurrency(payment.amount)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <div className="text-sm text-neutral-500 dark:text-neutral-400">
        <p>Payment ID: {payment.id}</p>
        <p>Created: {formatDate(payment.createdAt)}</p>
        {payment.mpesaTransactionId && (
          <p>M-Pesa Transaction ID: {payment.mpesaTransactionId}</p>
        )}
        {payment.bankReference && (
          <p>Bank Reference: {payment.bankReference}</p>
        )}
      </div>
    </div>
  );
};