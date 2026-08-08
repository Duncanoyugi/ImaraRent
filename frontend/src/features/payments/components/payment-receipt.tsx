import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDate, formatCurrency } from '@/lib/formatters';
import type { Payment } from '../types/payment.types';
import { CheckCircle } from 'lucide-react';

interface PaymentReceiptProps {
  payment: Payment;
}

export const PaymentReceipt = ({ payment }: PaymentReceiptProps) => {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full bg-success-100 p-3 dark:bg-success-900/30">
            <CheckCircle className="h-8 w-8 text-success-600 dark:text-success-400" />
          </div>
          <CardTitle className="text-2xl">Payment Receipt</CardTitle>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Payment confirmed and processed successfully
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Receipt Header */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Receipt Number</p>
            <p className="font-mono font-medium text-neutral-900 dark:text-white">
              {payment.reference || 'N/A'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Date</p>
            <p className="font-medium text-neutral-900 dark:text-white">
              {formatDate(payment.paymentDate)}
            </p>
          </div>
        </div>

        <Separator />

        {/* Payment Details */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-neutral-500 dark:text-neutral-400">Amount Paid</span>
            <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">
              {formatCurrency(payment.amount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500 dark:text-neutral-400">Payment Method</span>
            <span className="font-medium text-neutral-900 dark:text-white">
              {payment.method}
            </span>
          </div>
          {payment.mpesaTransactionId && (
            <div className="flex justify-between">
              <span className="text-neutral-500 dark:text-neutral-400">M-Pesa Transaction</span>
              <span className="font-mono text-sm text-neutral-900 dark:text-white">
                {payment.mpesaTransactionId}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-neutral-500 dark:text-neutral-400">Status</span>
            <Badge variant="success">Completed</Badge>
          </div>
        </div>

        <Separator />

        {/* Tenant Info */}
        {payment.tenant && (
          <div>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Paid By</p>
            <p className="font-medium text-neutral-900 dark:text-white">
              {payment.tenant.firstName} {payment.tenant.lastName}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {payment.tenant.email}
            </p>
          </div>
        )}

        {/* Invoice Allocations */}
        {payment.allocations && payment.allocations.length > 0 && (
          <div>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Applied To</p>
            <div className="mt-2 space-y-1">
              {payment.allocations.map((allocation) => (
                <div key={allocation.id} className="flex justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-300">
                    {allocation.invoice?.invoiceNumber || 'Invoice'}
                  </span>
                  <span className="font-medium text-neutral-900 dark:text-white">
                    {formatCurrency(allocation.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center text-xs text-neutral-400 dark:text-neutral-500 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <p>This is an official receipt from ImaraRent</p>
          <p>Payment ID: {payment.id}</p>
        </div>
      </CardContent>
    </Card>
  );
};