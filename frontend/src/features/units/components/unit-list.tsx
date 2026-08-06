import { Link } from 'react-router-dom';
import { Plus, Home, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UnitCard } from './unit-card';
import { type Unit } from '../types/unit.types';
import { useState } from 'react';

interface UnitListProps {
  units: Unit[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  propertyId?: string;
}

export const UnitList = ({
  units,
  isLoading = false,
  onDelete,
  propertyId,
}: UnitListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredUnits = units.filter((unit) => {
    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const matchesNumber = unit.number.toLowerCase().includes(search);
      const matchesProperty = unit.property?.name.toLowerCase().includes(search) || false;
      if (!matchesNumber && !matchesProperty) return false;
    }

    // Status filter
    if (statusFilter !== 'ALL' && unit.status !== statusFilter) {
      return false;
    }

    return true;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-10 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
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
            Units
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {units.length} units in your portfolio
          </p>
        </div>
        <Button asChild>
          <Link to={propertyId ? `/properties/${propertyId}/units/new` : '/units/new'}>
            <Plus className="mr-2 h-4 w-4" />
            Add Unit
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search units by number or property..."
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
            <SelectItem value="VACANT">Vacant</SelectItem>
            <SelectItem value="OCCUPIED">Occupied</SelectItem>
            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
            <SelectItem value="RESERVED">Reserved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Empty State */}
      {filteredUnits.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 p-12 dark:border-neutral-800">
          <Home className="h-12 w-12 text-neutral-400" />
          <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">
            No units found
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {searchTerm || statusFilter !== 'ALL'
              ? 'Try adjusting your filters'
              : 'Get started by adding your first unit'}
          </p>
          {!searchTerm && statusFilter === 'ALL' && (
            <Button asChild className="mt-4">
              <Link to={propertyId ? `/properties/${propertyId}/units/new` : '/units/new'}>
                <Plus className="mr-2 h-4 w-4" />
                Add Unit
              </Link>
            </Button>
          )}
        </div>
      )}

      {/* Unit Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredUnits.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};