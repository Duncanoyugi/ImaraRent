import { Link } from 'react-router-dom';
import { Home, Users, Bed, Bath, Square, CreditCard, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UnitStatusBadge } from './unit-status-badge';
import { formatCurrency } from '@/lib/formatters';
import { type Unit } from '../types/unit.types';

interface UnitCardProps {
  unit: Unit;
  onDelete?: (id: string) => void;
}

export const UnitCard = ({ unit, onDelete }: UnitCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <CardContent className="p-0">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Unit {unit.number}
                </h3>
                {unit.floor && (
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    • {unit.floor}
                  </span>
                )}
              </div>
              {unit.property && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {unit.property.name}
                </p>
              )}
            </div>
            <UnitStatusBadge status={unit.status} />
          </div>

          {/* Details Grid */}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {unit.bedrooms !== null && unit.bedrooms !== undefined && (
              <div className="flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2 dark:bg-neutral-800/50">
                <Bed className="h-4 w-4 text-neutral-400" />
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {unit.bedrooms} {unit.bedrooms === 1 ? 'Bed' : 'Beds'}
                </span>
              </div>
            )}
            {unit.bathrooms !== null && unit.bathrooms !== undefined && (
              <div className="flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2 dark:bg-neutral-800/50">
                <Bath className="h-4 w-4 text-neutral-400" />
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {unit.bathrooms} {unit.bathrooms === 1 ? 'Bath' : 'Baths'}
                </span>
              </div>
            )}
            {unit.squareFeet !== null && unit.squareFeet !== undefined && (
              <div className="flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2 dark:bg-neutral-800/50">
                <Square className="h-4 w-4 text-neutral-400" />
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {unit.squareFeet} sq ft
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2 dark:bg-neutral-800/50">
              <CreditCard className="h-4 w-4 text-neutral-400" />
              <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                {formatCurrency(unit.rentAmount)}
              </span>
            </div>
          </div>

          {/* Tenant Info */}
          {unit.currentTenant && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 dark:bg-brand-950/20">
              <Users className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                {unit.currentTenant.firstName} {unit.currentTenant.lastName}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex gap-2 border-t border-neutral-100 pt-4 dark:border-neutral-800">
            <Button asChild variant="default" size="sm" className="flex-1">
              <Link to={`/units/${unit.id}`}>
                <Home className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to={`/units/${unit.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(unit.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};