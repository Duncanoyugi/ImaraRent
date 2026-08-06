import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTerminateLease } from '../hooks/use-leases';

interface LeaseTerminateButtonProps {
  leaseId: string;
  onSuccess?: () => void;
}

export const LeaseTerminateButton = ({ leaseId, onSuccess }: LeaseTerminateButtonProps) => {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const terminate = useTerminateLease();

  const handleTerminate = () => {
    terminate.mutate(
      { id: leaseId, reason: reason || undefined },
      {
        onSuccess: () => {
          setOpen(false);
          onSuccess?.();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="gap-2">
          <XCircle className="h-4 w-4" />
          Terminate Lease
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terminate Lease</DialogTitle>
          <DialogDescription>
            This will end the lease and make the unit vacant. This action can be reversed by creating a new lease.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Termination Reason (Optional)</Label>
            <Input
              id="reason"
              placeholder="e.g., Tenant moved out, Lease ended, etc."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleTerminate}
            loading={terminate.isPending}
            disabled={terminate.isPending}
          >
            {terminate.isPending ? 'Terminating...' : 'Confirm Termination'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};