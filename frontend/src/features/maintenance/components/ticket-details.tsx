import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Home,
  Calendar,
  UserPlus,
  Check,
  Camera,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TicketStatusBadge } from './ticket-status-badge';
import { TicketPriorityBadge } from './ticket-priority-badge';
import { formatDate, formatCurrency } from '@/lib/formatters';
import type { MaintenanceTicket } from '../types/maintenance.types';
import { useState } from 'react';

interface TicketDetailsProps {
  ticket: MaintenanceTicket;
  onAssign?: () => void;
  onComplete?: (resolutionNotes?: string) => void;
  onStatusChange?: (status: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED') => void;
}

export const TicketDetails = ({
  ticket,
  onAssign,
  onComplete,
  onStatusChange,
}: TicketDetailsProps) => {
  const navigate = useNavigate();
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/maintenance')}
            className="h-9 w-9 shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {ticket.title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <TicketStatusBadge status={ticket.status} />
              <TicketPriorityBadge priority={ticket.priority} />
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {ticket.status === 'OPEN' && onAssign && (
            <Button onClick={onAssign} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Assign
            </Button>
          )}
          {(ticket.status === 'ASSIGNED' || ticket.status === 'IN_PROGRESS') && onComplete && (
            <Button onClick={() => setShowCompleteDialog(true)} className="gap-2">
              <Check className="h-4 w-4" />
              Complete
            </Button>
          )}
          {ticket.status !== 'CLOSED' && onStatusChange && (
            <Button
              variant="outline"
              onClick={() => onStatusChange('CLOSED')}
              className="gap-2"
            >
              <XCircle className="h-4 w-4" />
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Created</p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {formatDate(ticket.createdAt)}
                </p>
                <p className="text-xs text-neutral-400">
                  by {ticket.createdBy?.firstName} {ticket.createdBy?.lastName}
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
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Unit</p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {ticket.unit?.number || 'N/A'}
                </p>
                <p className="text-xs text-neutral-400">
                  {ticket.unit?.property?.name}
                </p>
              </div>
              <div className="rounded-xl bg-neutral-100 p-2 dark:bg-neutral-800">
                <Home className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Tenant</p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {ticket.tenant ? `${ticket.tenant.firstName} ${ticket.tenant.lastName}` : 'N/A'}
                </p>
                <p className="text-xs text-neutral-400">
                  {ticket.tenant?.email}
                </p>
              </div>
              <div className="rounded-xl bg-neutral-100 p-2 dark:bg-neutral-800">
                <User className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Assigned To</p>
                <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {ticket.assignedTo ? `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}` : 'Unassigned'}
                </p>
                {ticket.completedAt && (
                  <p className="text-xs text-success-500">Completed: {formatDate(ticket.completedAt)}</p>
                )}
              </div>
              <div className="rounded-xl bg-neutral-100 p-2 dark:bg-neutral-800">
                <UserPlus className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-neutral-600 dark:text-neutral-300">
            {ticket.description}
          </p>
        </CardContent>
      </Card>

      {/* Photos */}
      {ticket.photos && ticket.photos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Camera className="h-4 w-4" />
              Photos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {ticket.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="aspect-square overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800"
                >
                  <img
                    src={photo.fileUrl}
                    alt="Maintenance photo"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cost */}
      {ticket.cost && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">
              {formatCurrency(ticket.cost)}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Complete Dialog */}
      {showCompleteDialog && onComplete && (
        <Card className="border-2 border-brand-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle className="h-5 w-5 text-brand-500" />
              Complete Ticket
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resolutionNotes">Resolution Notes</Label>
              <Textarea
                id="resolutionNotes"
                placeholder="Describe how the issue was resolved..."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                onComplete(resolutionNotes || undefined);
                setShowCompleteDialog(false);
              }}>
                Confirm Complete
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <div className="text-sm text-neutral-500 dark:text-neutral-400">
        <p>Ticket ID: {ticket.id}</p>
        <p>Last updated: {formatDate(ticket.updatedAt)}</p>
        {ticket.completedAt && (
          <p className="text-success-500">Completed: {formatDate(ticket.completedAt)}</p>
        )}
      </div>
    </div>
  );
};