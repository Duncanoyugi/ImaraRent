import { Link } from 'react-router-dom';
import { Plus, Users, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TenantStatusBadge } from './tenant-status-badge';
import { formatDate, formatPhoneNumber } from '@/lib/formatters';
import { type Tenant } from '../types/tenant.types';
import { useState } from 'react';

interface TenantListProps {
  tenants: Tenant[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  onResend?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export const TenantList = ({
  tenants,
  isLoading = false,
  onDelete,
  onResend,
  onCancel,
}: TenantListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredTenants = tenants.filter((tenant) => {
    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const fullName = `${tenant.firstName} ${tenant.lastName}`.toLowerCase();
      const emailMatch = tenant.email.toLowerCase().includes(search);
      const phoneMatch = tenant.phone.includes(search);
      const nameMatch = fullName.includes(search);
      if (!emailMatch && !phoneMatch && !nameMatch) return false;
    }

    // Status filter
    if (statusFilter !== 'ALL' && tenant.status !== statusFilter) {
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
        <div className="rounded-2xl border border-neutral-200 p-8 dark:border-neutral-800">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="mb-4 h-16 animate-pulse rounded bg-neutral-200 dark:bg-neutral-800 last:mb-0" />
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
            Tenants
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {tenants.length} tenants in your portfolio
          </p>
        </div>
        <Button asChild>
          <Link to="/tenants/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Tenant
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search tenants by name, email, or phone..."
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
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="EXPIRED">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Empty State */}
      {filteredTenants.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 p-12 dark:border-neutral-800">
          <Users className="h-12 w-12 text-neutral-400" />
          <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">
            No tenants found
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {searchTerm || statusFilter !== 'ALL'
              ? 'Try adjusting your filters'
              : 'Get started by adding your first tenant'}
          </p>
          {!searchTerm && statusFilter === 'ALL' && (
            <Button asChild className="mt-4">
              <Link to="/tenants/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Tenant
              </Link>
            </Button>
          )}
        </div>
      )}

      {/* Tenant Table */}
      {filteredTenants.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50 dark:bg-neutral-800/50">
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Account</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.map((tenant) => (
                <TableRow
                  key={tenant.id}
                  className="cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  onClick={() => window.location.href = `/tenants/${tenant.id}`}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {tenant.firstName} {tenant.lastName}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {formatDate(tenant.createdAt)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm text-neutral-900 dark:text-white">
                        {tenant.email}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {formatPhoneNumber(tenant.phone)}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {tenant.unit ? (
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white">
                          Unit {tenant.unit.number}
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {tenant.unit.property.name}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-neutral-400">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <TenantStatusBadge status={tenant.status} />
                  </TableCell>
                  <TableCell>
                    {tenant.hasUserAccount ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="warning">No Account</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      {tenant.status === 'PENDING' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onResend?.(tenant.id)}
                          >
                            Resend
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onCancel?.(tenant.id)}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {tenant.status !== 'PENDING' && onDelete && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDelete(tenant.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};