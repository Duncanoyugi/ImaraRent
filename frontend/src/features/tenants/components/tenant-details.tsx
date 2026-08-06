import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Edit,
  Trash2,
  Send,
  XCircle,
  CheckCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TenantStatusBadge } from './tenant-status-badge';
import { formatDate, formatPhoneNumber, formatCurrency } from '@/lib/formatters';
import { type Tenant } from '../types/tenant.types';

interface TenantDetailsProps {
  tenant: Tenant;
  onResend?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
}

export const TenantDetails = ({
  tenant,
  onResend,
  onCancel,
  onDelete,
}: TenantDetailsProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/tenants')}
            className="h-9 w-9 shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {tenant.firstName} {tenant.lastName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <TenantStatusBadge status={tenant.status} />
              {tenant.hasUserAccount ? (
                <Badge variant="success" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Account Active
                </Badge>
              ) : (
                <Badge variant="warning" className="gap-1">
                  <XCircle className="h-3 w-3" />
                  No Account
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {tenant.status === 'PENDING' && (
            <>
              {onResend && (
                <Button variant="outline" onClick={onResend}>
                  <Send className="mr-2 h-4 w-4" />
                  Resend Invitation
                </Button>
              )}
              {onCancel && (
                <Button variant="destructive" onClick={onCancel}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancel Invitation
                </Button>
              )}
            </>
          )}
          <Button asChild variant="outline">
            <Link to={`/tenants/${tenant.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          {onDelete && tenant.status !== 'PENDING' && (
            <Button variant="destructive" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-brand-100 p-2 dark:bg-brand-900/30">
                <Mail className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Email</p>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {tenant.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-info-100 p-2 dark:bg-info-900/30">
                <Phone className="h-4 w-4 text-info-600 dark:text-info-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Phone</p>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {formatPhoneNumber(tenant.phone)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-neutral-100 p-2 dark:bg-neutral-800">
                <Calendar className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Joined</p>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {formatDate(tenant.createdAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tenant.nationalId && (
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">National ID</p>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {tenant.nationalId}
                </p>
              </div>
            )}
            {tenant.dateOfBirth && (
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Date of Birth</p>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {formatDate(tenant.dateOfBirth)}
                </p>
              </div>
            )}
            {!tenant.nationalId && !tenant.dateOfBirth && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                No additional personal information provided
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Unit & Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tenant.unit ? (
              <>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Unit</p>
                  <p className="font-medium text-neutral-900 dark:text-white">
                    <Link
                      to={`/units/${tenant.unit.id}`}
                      className="hover:text-brand-600 dark:hover:text-brand-400"
                    >
                      Unit {tenant.unit.number}
                    </Link>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Property</p>
                  <p className="font-medium text-neutral-900 dark:text-white">
                    <Link
                      to={`/properties/${tenant.unit.property.id}`}
                      className="hover:text-brand-600 dark:hover:text-brand-400"
                    >
                      {tenant.unit.property.name}
                    </Link>
                  </p>
                </div>
                {tenant.activeLease && (
                  <div className="rounded-lg bg-brand-50 p-3 dark:bg-brand-950/20">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Active Lease</p>
                    <p className="font-medium text-brand-600 dark:text-brand-400">
                      {formatCurrency(tenant.activeLease.rentAmount)}/month
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      {formatDate(tenant.activeLease.startDate)} - {formatDate(tenant.activeLease.endDate)}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                No unit assigned
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Metadata */}
      <div className="text-sm text-neutral-500 dark:text-neutral-400">
        <p>Tenant ID: {tenant.id}</p>
        <p>Organization ID: {tenant.organizationId}</p>
        <p>Last updated: {formatDate(tenant.updatedAt)}</p>
        {tenant.invitationToken && (
          <p className="text-warning-500">Invitation Token: {tenant.invitationToken}</p>
        )}
      </div>
    </div>
  );
};