import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGenerateInvoices } from '@/features/billing/hooks/use-billing';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function GenerateInvoicesPage() {
  const navigate = useNavigate();
  const [periodStart, setPeriodStart] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split('T')[0]
  );
  const [periodEnd, setPeriodEnd] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      .toISOString()
      .split('T')[0]
  );
  const [dueDate, setDueDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5)
      .toISOString()
      .split('T')[0]
  );

  const generate = useGenerateInvoices();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generate.mutate(
      {
        periodStart,
        periodEnd,
        dueDate: dueDate || undefined,
      },
      {
        onSuccess: () => {
          navigate('/billing/invoices');
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/billing/invoices')}
          className="h-9 w-9 shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Generate Invoices
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Generate invoices for all active leases
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Generation</CardTitle>
          <CardDescription>
            Select the period for which you want to generate invoices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="periodStart">Period Start *</Label>
                <Input
                  id="periodStart"
                  type="date"
                  value={periodStart}
                  onChange={(e) => setPeriodStart(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="periodEnd">Period End *</Label>
                <Input
                  id="periodEnd"
                  type="date"
                  value={periodEnd}
                  onChange={(e) => setPeriodEnd(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Defaults to 5 days after period end
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/billing/invoices')}
              >
                Cancel
              </Button>
              <Button type="submit" loading={generate.isPending} disabled={generate.isPending}>
                {generate.isPending ? 'Generating...' : 'Generate Invoices'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}