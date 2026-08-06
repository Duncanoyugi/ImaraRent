import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Home,
  User,
  CreditCard,
  FileText,
  CheckCircle,
  XCircle,
  Edit,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LeaseStatusBadge } from './lease-status-badge';
import { formatDate, formatCurrency } from '@/lib/formatters';
import { type Lease } from '../types/lease.types';

interface LeaseDetailsProps {
  lease: Lease;
  onActivate?: () => void;
  onTerminate?: () => void;
}

export const LeaseDetails = ({ lease, onActivate, onTerminate }: LeaseDetailsProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/leases')}
            className="h-9 w-9 shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Lease Details
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <LeaseStatusBadge status={lease.status} />
              {lease.isActive && (
                <Badge variant="success" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Active
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {lease.status === 'DRAFT' && onActivate && (
            <Button onClick={onActivate}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Activate Lease
            </Button>
          )}
          {lease.isActive && onTerminate && (
            <Button variant="destructive" onClick={onTerminate}>
              <XCircle className="mr-2 h-4 w-4" />
              Terminate Lease
            </Button>
          )}
          {lease.status === 'DRAFT' && (
            <Button asChild variant="outline">
              <Link to={`/leases/${lease.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Key Info Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Rent Amount</p>
                <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                  {formatCurrency(lease.rentAmount)}
                </p>
                <p className="text-xs text-neutral-400">per month</p>
              </div>
              <div className="rounded-xl bg-brand-100 p-2 dark:bg-brand-900/30">
                <CreditCard className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {lease.depositAmount && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Deposit</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {formatCurrency(lease.depositAmount)}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {lease.depositPaid ? 'Paid ✓' : 'Not paid'}
                  </p>
                </div>
                <div className="rounded-xl bg-neutral-100 p-2 dark:bg-neutral-800">
                  <FileText className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Start Date</p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {formatDate(lease.startDate)}
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
                <p className="text-sm text-neutral-500 dark:text-neutral-400">End Date</p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {lease.endDate ? formatDate(lease.endDate) : 'Open-ended'}
                </p>
              </div>
              <div className="rounded-xl bg-neutral-100 p-2 dark:bg-neutral-800">
                <Calendar className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tenant & Unit Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" />
              Tenant Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lease.tenant ? (
              <div className="space-y-2">
                <p className="font-medium text-neutral-900 dark:text-white">
                  {lease.tenant.firstName} {lease.tenant.lastName}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {lease.tenant.email}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {lease.tenant.phone}
                </p>
                <Button asChild variant="link" className="px-0">
                  <Link to={`/tenants/${lease.tenantId}`}>
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
              <Home className="h-4 w-4" />
              Unit Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lease.unit ? (
              <div className="space-y-2">
                <p className="font-medium text-neutral-900 dark:text-white">
                  Unit {lease.unit.number}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {lease.unit.property?.name}
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {lease.unit.property?.address}
                </p>
                <Button asChild variant="link" className="px-0">
                  <Link to={`/units/${lease.unitId}`}>
                    View Unit Details
                  </Link>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-neutral-500">Unit information not available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Created By & Metadata */}
      <div className="text-sm text-neutral-500 dark:text-neutral-400">
        <p>Created by: {lease.createdBy?.firstName} {lease.createdBy?.lastName} ({lease.createdBy?.email})</p>
        <p>Created: {formatDate(lease.createdAt)}</p>
        <p>Last updated: {formatDate(lease.updatedAt)}</p>
        {lease.terminatedAt && (
          <p className="text-error-500">Terminated: {formatDate(lease.terminatedAt)}</p>
        )}
        {lease.terminationReason && (
          <p className="text-error-500">Reason: {lease.terminationReason}</p>
        )}
        <p className="text-xs">Lease ID: {lease.id}</p>
      </div>
    </div>
  );
};