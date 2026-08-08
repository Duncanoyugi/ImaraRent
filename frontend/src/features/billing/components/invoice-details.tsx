import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Receipt,
  Calendar,
  User,
  Building2,
  CreditCard,
  Download,
  FileText,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { InvoiceStatusBadge } from './invoice-status-badge';
import { formatDate, formatCurrency } from '@/lib/formatters';
import type { Invoice } from '../types/billing.types';
import { cn } from '@/lib/utils';

interface InvoiceDetailsProps {
  invoice: Invoice;
  onVoid?: () => void;
  onPay?: () => void;
}

export const InvoiceDetails = ({ invoice, onVoid, onPay }: InvoiceDetailsProps) => {
  const navigate = useNavigate();

  const isOverdue = new Date(invoice.dueDate) < new Date() && invoice.status !== 'PAID';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/billing/invoices')}
            className="h-9 w-9 shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Invoice {invoice.invoiceNumber}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <InvoiceStatusBadge status={invoice.status} />
              {isOverdue && (
                <Badge variant="destructive" className="gap-1">
                  <XCircle className="h-3 w-3" />
                  Overdue
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {invoice.status !== 'PAID' && invoice.status !== 'CANCELLED' && (
            <>
              {onPay && (
                <Button onClick={onPay} className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  Pay Now
                </Button>
              )}
              {onVoid && (
                <Button variant="destructive" onClick={onVoid} className="gap-2">
                  <XCircle className="h-4 w-4" />
                  Void Invoice
                </Button>
              )}
            </>
          )}
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Amount</p>
                <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                  {formatCurrency(invoice.totalAmount)}
                </p>
              </div>
              <div className="rounded-xl bg-brand-100 p-2 dark:bg-brand-900/30">
                <Receipt className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Paid Amount</p>
                <p className="text-2xl font-bold text-success-600 dark:text-success-400">
                  {formatCurrency(invoice.paidAmount)}
                </p>
              </div>
              <div className="rounded-xl bg-success-100 p-2 dark:bg-success-900/30">
                <CreditCard className="h-5 w-5 text-success-600 dark:text-success-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Balance</p>
                <p className={cn(
                  'text-2xl font-bold',
                  Number(invoice.balance) > 0 
                    ? 'text-error-600 dark:text-error-400'
                    : 'text-success-600 dark:text-success-400'
                )}>
                  {formatCurrency(invoice.balance)}
                </p>
              </div>
              <div className={cn(
                'rounded-xl p-2',
                Number(invoice.balance) > 0 
                  ? 'bg-error-100 dark:bg-error-900/30'
                  : 'bg-success-100 dark:bg-success-900/30'
              )}>
                <FileText className={cn(
                  'h-5 w-5',
                  Number(invoice.balance) > 0 
                    ? 'text-error-600 dark:text-error-400'
                    : 'text-success-600 dark:text-success-400'
                )} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Due Date</p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {formatDate(invoice.dueDate)}
                </p>
                {isOverdue && (
                  <p className="text-xs text-error-500">Overdue</p>
                )}
              </div>
              <div className="rounded-xl bg-neutral-100 p-2 dark:bg-neutral-800">
                <Calendar className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tenant & Lease Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" />
              Tenant Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {invoice.tenant ? (
              <div className="space-y-2">
                <p className="font-medium text-neutral-900 dark:text-white">
                  {invoice.tenant.firstName} {invoice.tenant.lastName}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {invoice.tenant.email}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {invoice.tenant.phone}
                </p>
                <Button asChild variant="link" className="px-0">
                  <Link to={`/tenants/${invoice.tenantId}`}>
                    View Tenant Profile
                  </Link>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-neutral-500">Tenant information not available</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4" />
              Lease & Unit Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {invoice.lease ? (
              <div className="space-y-2">
                <p className="font-medium text-neutral-900 dark:text-white">
                  Unit {invoice.lease.unit.number}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {invoice.lease.unit.property.name}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {invoice.lease.unit.property.address}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Rent: {formatCurrency(invoice.lease.rentAmount)}/month
                </p>
                <Button asChild variant="link" className="px-0">
                  <Link to={`/leases/${invoice.leaseId}`}>
                    View Lease
                  </Link>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-neutral-500">Lease information not available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Invoice Lines */}
      {invoice.lines && invoice.lines.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Invoice Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {invoice.lines.map((line) => (
                <div
                  key={line.id}
                  className="flex items-center justify-between rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50"
                >
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">
                      {line.description}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {line.type}
                    </p>
                  </div>
                  <p className="font-medium text-neutral-900 dark:text-white">
                    {formatCurrency(line.amount)}
                  </p>
                </div>
              ))}
              <Separator className="my-2" />
              <div className="flex items-center justify-between font-bold">
                <span className="text-neutral-900 dark:text-white">Total</span>
                <span className="text-brand-600 dark:text-brand-400">
                  {formatCurrency(invoice.totalAmount)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Description */}
      {invoice.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-600 dark:text-neutral-300">
              {invoice.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <div className="text-sm text-neutral-500 dark:text-neutral-400">
        <p>Invoice ID: {invoice.id}</p>
        <p>Created: {formatDate(invoice.createdAt)}</p>
        <p>Issue Date: {formatDate(invoice.issueDate)}</p>
      </div>
    </div>
  );
};