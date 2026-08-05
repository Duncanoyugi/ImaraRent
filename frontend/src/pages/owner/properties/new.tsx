import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PropertyForm } from '@/features/properties/components/property-form';
import { useCreateProperty } from '@/features/properties/hooks/use-properties';
import { AppLayout } from '@/components/layout/app-layout';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NewPropertyPage() {
  const navigate = useNavigate();
  const createProperty = useCreateProperty();

  const handleSubmit = (data: any) => {
    createProperty.mutate(data, {
      onSuccess: (property) => {
        navigate(`/properties/${property.id}`);
      },
    });
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl px-4">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/properties')}
            className="h-9 w-9 shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Add New Property
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Enter the details of your property to start managing it.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-neutral-200 dark:border-neutral-800">
          <CardHeader className="border-b border-neutral-100 px-6 py-5 dark:border-neutral-800">
            <CardTitle className="text-base">Property Information</CardTitle>
            <CardDescription>
              Fill in the details below to create your property.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <PropertyForm
              onSubmit={handleSubmit}
              isLoading={createProperty.isPending}
              submitLabel="Create Property"
            />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}