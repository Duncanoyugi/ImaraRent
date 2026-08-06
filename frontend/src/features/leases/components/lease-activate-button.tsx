import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useActivateLease } from '../hooks/use-leases';

interface LeaseActivateButtonProps {
  leaseId: string;
  onSuccess?: () => void;
}

export const LeaseActivateButton = ({ leaseId, onSuccess }: LeaseActivateButtonProps) => {
  const activate = useActivateLease();

  const handleActivate = () => {
    if (window.confirm('Are you sure you want to activate this lease? This will occupy the unit.')) {
      activate.mutate(leaseId, {
        onSuccess: onSuccess,
      });
    }
  };

  return (
    <Button
      onClick={handleActivate}
      loading={activate.isPending}
      disabled={activate.isPending}
      className="gap-2"
    >
      <CheckCircle className="h-4 w-4" />
      {activate.isPending ? 'Activating...' : 'Activate Lease'}
    </Button>
  );
};