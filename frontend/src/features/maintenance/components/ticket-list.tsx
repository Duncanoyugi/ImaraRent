import { Link } from 'react-router-dom';
import { Plus, Wrench, Search, Filter } from 'lucide-react';
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
import { TicketStatusBadge } from './ticket-status-badge';
import { TicketPriorityBadge } from './ticket-priority-badge';
import { formatDate } from '@/lib/formatters';
import type { MaintenanceTicket } from '../types/maintenance.types';
import { useState } from 'react';

interface TicketListProps {
  tickets: MaintenanceTicket[];
  isLoading?: boolean;
  showCreate?: boolean;
  onAssign?: (id: string) => void;
  onComplete?: (id: string) => void;
  onStatusChange?: (id: string, status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED') => void;
}

export const TicketList = ({
  tickets,
  isLoading = false,
  showCreate = false,
  onAssign,
  onComplete,
  onStatusChange,
}: TicketListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredTickets = tickets.filter((ticket) => {
    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const titleMatch = ticket.title.toLowerCase().includes(search);
      const unitMatch = ticket.unit?.number.toLowerCase().includes(search) || false;
      const propertyMatch = ticket.unit?.property?.name.toLowerCase().includes(search) || false;
      if (!titleMatch && !unitMatch && !propertyMatch) return false;
    }

    // Status filter
    if (statusFilter !== 'ALL' && ticket.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const urgentCount = tickets.filter(t => t.priority === 'URGENT' && t.status !== 'COMPLETED' && t.status !== 'CLOSED').length;

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
            Maintenance Tickets
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {tickets.length} tickets • {urgentCount} urgent
          </p>
        </div>
        {showCreate && (
          <Button asChild>
            <Link to="/maintenance/new">
              <Plus className="mr-2 h-4 w-4" />
              New Ticket
            </Link>
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search tickets by title, unit, or property..."
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
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="ASSIGNED">Assigned</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Empty State */}
      {filteredTickets.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 p-12 dark:border-neutral-800">
          <Wrench className="h-12 w-12 text-neutral-400" />
          <h3 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">
            No tickets found
          </h3>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {searchTerm || statusFilter !== 'ALL'
              ? 'Try adjusting your filters'
              : 'No maintenance tickets have been created yet'}
          </p>
        </div>
      )}

      {/* Ticket Table */}
      {filteredTickets.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50 dark:bg-neutral-800/50">
                <TableHead>Title</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  className="cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  onClick={() => window.location.href = `/maintenance/${ticket.id}`}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-neutral-900 dark:text-white">
                        {ticket.title}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-1">
                        {ticket.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {ticket.unit ? (
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">
                          Unit {ticket.unit.number}
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {ticket.unit.property?.name}
                        </p>
                      </div>
                    ) : (
                      <span className="text-sm text-neutral-400">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <TicketPriorityBadge priority={ticket.priority} />
                  </TableCell>
                  <TableCell>
                    <TicketStatusBadge status={ticket.status} />
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{formatDate(ticket.createdAt)}</p>
                      {ticket.assignedTo && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          Assigned to: {ticket.assignedTo.firstName} {ticket.assignedTo.lastName}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      {ticket.status === 'OPEN' && onAssign && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onAssign(ticket.id)}
                        >
                          Assign
                        </Button>
                      )}
                      {(ticket.status === 'ASSIGNED' || ticket.status === 'IN_PROGRESS') && onComplete && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onComplete(ticket.id)}
                        >
                          Complete
                        </Button>
                      )}
                      {ticket.status !== 'CLOSED' && onStatusChange && (
                        <Select
                          onValueChange={(value) => onStatusChange(ticket.id, value as 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED')}
                        >
                          <SelectTrigger className="w-[100px] h-8">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="OPEN">Open</SelectItem>
                            <SelectItem value="ASSIGNED">Assigned</SelectItem>
                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="CLOSED">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/maintenance/${ticket.id}`}>View</Link>
                      </Button>
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