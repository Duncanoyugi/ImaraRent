import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateInvoice } from '@/features/billing/hooks/use-billing';
import { useLeases } from '@/features/leases/hooks/use-leases';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import type { CreateInvoiceData } from '@/types/invoice.types';

export default function NewInvoicePage() {
  const navigate = useNavigate();
  const createInvoice = useCreateInvoice();
  const { data: leases, isLoading: isLoadingLeases } = useLeases();

  const [formData, setFormData] = useState<CreateInvoiceData>({
    leaseId: '',
    dueDate: '',
    totalAmount: 0,
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createInvoice.mutate(formData, {
      onSuccess: () => {
        navigate('/billing/invoices');
      },
    });
  };

  const isLoading = createInvoice.isPending;

  return (
    <div className="mx-auto max-w-2xl">
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
            Create Manual Invoice
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Create a one-off invoice for a specific lease
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
          <CardDescription>
            Enter the invoice amount, due date, and select the lease.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="leaseId">
                Lease <span className="text-error-500">*</span>
              </Label>
              <Select
                value={formData.leaseId}
                onValueChange={(value) =>
                  setFormData({ ...formData, leaseId: value })
                }
                disabled={isLoadingLeases || isLoading}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select a lease" />
                </SelectTrigger>
                <SelectContent>
                  {leases?.map((lease) => (
                    <SelectItem key={lease.id} value={lease.id}>
                      {lease.tenant
                        ? `${lease.tenant.firstName} ${lease.tenant.lastName}`
                        : 'Unknown Tenant'}
                      {' - '}
                      {lease.unit
                        ? `Unit ${lease.unit.number} (${lease.unit.property.name})`
                        : lease.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="totalAmount">
                  Total Amount (KES) <span className="text-error-500">*</span>
                </Label>
                <Input
                  id="totalAmount"
                  type="number"
                  placeholder="e.g., 45000"
                  value={formData.totalAmount || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      totalAmount: Number(e.target.value),
                    })
                  }
                  required
                  min={0}
                  disabled={isLoading}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">
                  Due Date <span className="text-error-500">*</span>
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  required
                  disabled={isLoading}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., February 2024 Rent"
                value={formData.description || ''}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={isLoading}
                className="h-11"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/billing/invoices')}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isLoading}
                disabled={isLoading || !formData.leaseId || !formData.dueDate || formData.totalAmount <= 0}
                className="h-11"
              >
                {isLoading ? 'Creating...' : 'Create Invoice'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
