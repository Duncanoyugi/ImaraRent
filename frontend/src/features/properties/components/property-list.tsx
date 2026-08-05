import { Link } from 'react-router-dom';
import { Plus, Building2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PropertyCard } from './property-card';
import { type Property } from '../types/property.types';
import { useState } from 'react';

interface PropertyListProps {
  properties: Property[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
}

export const PropertyList = ({ properties, isLoading = false, onDelete }: PropertyListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProperties = properties.filter((property) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      property.name.toLowerCase().includes(search) ||
      property.city.toLowerCase().includes(search) ||
      property.county.toLowerCase().includes(search) ||
      property.address.toLowerCase().includes(search)
    );
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
          <div className="h-10 w-32 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-neutral-200 dark:bg-neutral-800" />
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
            Properties
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {properties.length} properties in your portfolio
          </p>
        </div>
        <Button asChild>
          <Link to="/properties/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <Input
          placeholder="Search properties by name, city, or county..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Empty State */}
      {filteredProperties.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 p-12 dark:border-neutral-800">
          <Building2 className="h-12 w-12 text-neutral-400" />
          <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">
            No properties found
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {searchTerm
              ? 'Try adjusting your search terms'
              : 'Get started by adding your first property'}
          </p>
          {!searchTerm && (
            <Button asChild className="mt-4">
              <Link to="/properties/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Property
              </Link>
            </Button>
          )}
        </div>
      )}

      {/* Property Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};