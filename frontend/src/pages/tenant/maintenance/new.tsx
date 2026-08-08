import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TicketForm } from '@/features/maintenance/components/ticket-form';
import { useCreateTicket } from '@/features/maintenance/hooks/use-maintenance';
import { AppLayout } from '@/components/layout/app-layout';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NewTicketPage() {
  const navigate = useNavigate();
  const createTicket = useCreateTicket();

  const handleSubmit = (data: { title: string; description: string; priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'; unitId: string }) => {
    createTicket.mutate(data, {
      onSuccess: (ticket) => {
        navigate(`/maintenance/${ticket.id}`);
      },
    });
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
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
              Report Maintenance Issue
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Describe the issue you're experiencing
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader className="border-b border-neutral-100 px-6 py-5 dark:border-neutral-800">
            <CardTitle className="text-base">Maintenance Request</CardTitle>
            <CardDescription>
              Fill in the details below to report a maintenance issue.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <TicketForm
              onSubmit={handleSubmit}
              isLoading={createTicket.isPending}
              submitLabel="Submit Ticket"
              units={[]}
              hideUnitSelect={true}
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}