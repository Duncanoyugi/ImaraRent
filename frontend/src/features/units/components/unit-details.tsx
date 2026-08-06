import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Home,
  Bed,
  Bath,
  Square,
  CreditCard,
  Edit,
  Trash2,
  User,
  Building2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UnitStatusBadge } from './unit-status-badge';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { type Unit } from '../types/unit.types';
import { useDeleteUnit } from '../hooks/use-units';

interface UnitDetailsProps {
  unit: Unit;
}

export const UnitDetails = ({ unit }: UnitDetailsProps) => {
  const navigate = useNavigate();
  const deleteUnit = useDeleteUnit();

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete Unit ${unit.number}? This action cannot be undone.`)) {
      deleteUnit.mutate(unit.id, {
        onSuccess: () => navigate('/units'),
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/units')}
            className="h-9 w-9 shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Unit {unit.number}
            </h1>
            {unit.property && (
              <div className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
                <Building2 className="h-4 w-4" />
                <Link
                  to={`/properties/${unit.property.id}`}
                  className="hover:text-brand-600 dark:hover:text-brand-400"
                >
                  {unit.property.name}
                </Link>
                {unit.floor && <span>• {unit.floor}</span>}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to={`/units/${unit.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteUnit.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleteUnit.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      {/* Status & Quick Info */}
      <div className="flex flex-wrap items-center gap-4">
        <UnitStatusBadge status={unit.status} className="text-sm px-4 py-1" />
        {unit.hasActiveLease && (
          <Badge variant="success" className="gap-1">
            <Home className="h-3 w-3" />
            Active Lease
          </Badge>
        )}
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          Created {formatDate(unit.createdAt)}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Rent Amount</p>
                <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                  {formatCurrency(unit.rentAmount)}
                </p>
              </div>
              <div className="rounded-xl bg-brand-100 p-2 dark:bg-brand-900/30">
                <CreditCard className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {unit.bedrooms !== null && unit.bedrooms !== undefined && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Bedrooms</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {unit.bedrooms}
                  </p>
                </div>
                <div className="rounded-xl bg-neutral-100 p-2 dark:bg-neutral-800">
                  <Bed className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {unit.bathrooms !== null && unit.bathrooms !== undefined && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Bathrooms</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {unit.bathrooms}
                  </p>
                </div>
                <div className="rounded-xl bg-neutral-100 p-2 dark:bg-neutral-800">
                  <Bath className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {unit.squareFeet !== null && unit.squareFeet !== undefined && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">Square Feet</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                    {unit.squareFeet}
                  </p>
                </div>
                <div className="rounded-xl bg-neutral-100 p-2 dark:bg-neutral-800">
                  <Square className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Current Tenant */}
      {unit.currentTenant && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Current Tenant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Name</p>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {unit.currentTenant.firstName} {unit.currentTenant.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Email</p>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {unit.currentTenant.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Phone</p>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {unit.currentTenant.phone}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <div className="text-sm text-neutral-500 dark:text-neutral-400">
        <p>Unit ID: {unit.id}</p>
        <p>Property ID: {unit.propertyId}</p>
        <p>Last updated: {formatDate(unit.updatedAt)}</p>
      </div>
    </div>
  );
};