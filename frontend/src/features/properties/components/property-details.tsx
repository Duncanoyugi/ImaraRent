import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Home,
  CreditCard,
  Edit,
  Trash2,
  ArrowLeft,
  Plus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { type Property } from '../types/property.types';
import { useDeleteProperty } from '../hooks/use-properties';

interface PropertyDetailsProps {
  property: Property;
}

export const PropertyDetails = ({ property }: PropertyDetailsProps) => {
  const navigate = useNavigate();
  const deleteProperty = useDeleteProperty();

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${property.name}"? This action cannot be undone.`)) {
      deleteProperty.mutate(property.id, {
        onSuccess: () => navigate('/properties'),
      });
    }
  };

  const stats = property.stats || {
    totalUnits: property.units?.length || 0,
    occupiedUnits: property.units?.filter((u) => u.status === 'OCCUPIED').length || 0,
    vacantUnits: property.units?.filter((u) => u.status === 'VACANT').length || 0,
    maintenanceUnits: property.units?.filter((u) => u.status === 'MAINTENANCE').length || 0,
    totalRent: property.units?.reduce((sum, u) => sum + u.rentAmount, 0) || 0,
    occupancyRate: 0,
  };

  const occupancyRate = stats.totalUnits > 0
    ? (stats.occupiedUnits / stats.totalUnits) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/properties')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
              {property.name}
            </h1>
            <p className="mt-1 flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
              <MapPin className="h-4 w-4" />
              {property.address}, {property.city}, {property.county}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to={`/properties/${property.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteProperty.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleteProperty.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Units</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {stats.totalUnits}
                </p>
              </div>
              <div className="rounded-xl bg-neutral-100 p-2 dark:bg-neutral-800">
                <Building2 className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Occupancy Rate</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {occupancyRate.toFixed(0)}%
                </p>
              </div>
              <div className="rounded-xl bg-success-100 p-2 dark:bg-success-900/30">
                <Home className="h-5 w-5 text-success-600 dark:text-success-400" />
              </div>
            </div>
            <p className="mt-1 text-xs text-neutral-400">
              {stats.occupiedUnits} occupied / {stats.vacantUnits} vacant
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Total Monthly Rent</p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                  {formatCurrency(stats.totalRent)}
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
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Created</p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {formatDate(property.createdAt)}
                </p>
              </div>
              <div className="rounded-xl bg-neutral-100 p-2 dark:bg-neutral-800">
                <Building2 className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {property.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-600 dark:text-neutral-300">
              {property.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Units Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Units</CardTitle>
          <Button asChild size="sm">
            <Link to={`/properties/${property.id}/units/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Unit
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {property.units && property.units.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800">
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      Unit
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-neutral-500 dark:text-neutral-400">
                      Rent
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {property.units.map((unit) => (
                    <tr
                      key={unit.id}
                      className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
                    >
                      <td className="px-4 py-3 font-medium text-neutral-900 dark:text-white">
                        {unit.number}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            unit.status === 'OCCUPIED'
                              ? 'success'
                              : unit.status === 'VACANT'
                              ? 'default'
                              : unit.status === 'MAINTENANCE'
                              ? 'warning'
                              : 'info'
                          }
                        >
                          {unit.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-neutral-900 dark:text-white">
                        {formatCurrency(unit.rentAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <Home className="h-12 w-12 text-neutral-400" />
              <p className="mt-2 text-neutral-500 dark:text-neutral-400">
                No units added yet
              </p>
              <Button asChild variant="link" className="mt-2">
                <Link to={`/properties/${property.id}/units/new`}>
                  Add your first unit
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Metadata */}
      <div className="text-sm text-neutral-500 dark:text-neutral-400">
        <p>Property ID: {property.id}</p>
        <p>Organization ID: {property.organizationId}</p>
        <p>Last updated: {formatDate(property.updatedAt)}</p>
      </div>
    </div>
  );
};