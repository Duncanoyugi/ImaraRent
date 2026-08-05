import { Link } from 'react-router-dom';
import { Building2, MapPin, Home, Users, CreditCard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/formatters';
import { type Property } from '../types/property.types';

interface PropertyCardProps {
  property: Property;
  onDelete?: (id: string) => void;
}

export const PropertyCard = ({ property, onDelete }: PropertyCardProps) => {
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
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <CardContent className="p-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-400 p-4 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{property.name}</h3>
              <p className="text-sm text-brand-50 flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" />
                {property.city}, {property.county}
              </p>
            </div>
            <Badge variant="brand" className="bg-white/20 text-white border-0">
              {stats.totalUnits} Units
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-neutral-400" />
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Occupancy</span>
              </div>
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                {occupancyRate.toFixed(0)}%
              </p>
              <p className="text-xs text-neutral-400">
                {stats.occupiedUnits} / {stats.totalUnits} occupied
              </p>
            </div>
            <div className="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-800/50">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-neutral-400" />
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Monthly Rent</span>
              </div>
              <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                {formatCurrency(stats.totalRent)}
              </p>
              <p className="text-xs text-neutral-400">
                Average: {formatCurrency(stats.totalRent / (stats.totalUnits || 1))}
              </p>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="success" className="gap-1">
              <Users className="h-3 w-3" />
              {stats.occupiedUnits} Occupied
            </Badge>
            <Badge variant="default" className="gap-1">
              <Home className="h-3 w-3" />
              {stats.vacantUnits} Vacant
            </Badge>
            {stats.maintenanceUnits > 0 && (
              <Badge variant="warning" className="gap-1">
                <Building2 className="h-3 w-3" />
                {stats.maintenanceUnits} Maintenance
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 flex gap-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
            <Button asChild variant="default" size="sm" className="flex-1">
              <Link to={`/properties/${property.id}`}>
                View Details
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to={`/properties/${property.id}/edit`}>
                Edit
              </Link>
            </Button>
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(property.id)}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};