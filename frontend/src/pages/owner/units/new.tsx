import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UnitForm } from '@/features/units/components/unit-form';
import { UnitBulkForm } from '@/features/units/components/unit-bulk-form';
import { useCreateUnit, useBulkCreateUnits } from '@/features/units/hooks/use-units';
import { useProperties } from '@/features/properties/hooks/use-properties';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

export default function NewUnitPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId') || undefined;
  const [activeTab, setActiveTab] = useState('single');

  const { data: properties } = useProperties();
  const createUnit = useCreateUnit();
  const bulkCreateUnits = useBulkCreateUnits();

  const handleSingleSubmit = (data: any) => {
    createUnit.mutate(data, {
      onSuccess: (unit: any) => {
        navigate(`/units/${unit.id}`);
      },
    });
  };

  const handleBulkSubmit = (data: any) => {
    bulkCreateUnits.mutate(data, {
      onSuccess: () => {
        navigate('/units');
      },
    });
  };

  const selectedProperty = properties?.find((p) => p.id === propertyId);

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/units')}
          className="h-9 w-9 shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Add New Unit
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {selectedProperty
              ? `Adding unit to ${selectedProperty.name}`
              : 'Add a new unit to your portfolio'}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader className="border-b border-neutral-100 px-6 py-5 dark:border-neutral-800">
          <CardTitle className="text-base">Unit Information</CardTitle>
          <CardDescription>
            Fill in the details below to create your unit.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single">Single Unit</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Add</TabsTrigger>
            </TabsList>

            <TabsContent value="single">
              <UnitForm
                onSubmit={handleSingleSubmit}
                isLoading={createUnit.isPending}
                submitLabel="Create Unit"
                properties={properties}
                selectedPropertyId={propertyId}
                hidePropertySelect={!!propertyId}
              />
            </TabsContent>

            <TabsContent value="bulk">
              <UnitBulkForm
                onSubmit={handleBulkSubmit}
                isLoading={bulkCreateUnits.isPending}
                properties={properties}
                selectedPropertyId={propertyId}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}