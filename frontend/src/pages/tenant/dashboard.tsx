import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function TenantDashboardPage() {
  return (
    <div className="container-center py-8">
      <Card>
        <CardHeader>
          <CardTitle>Tenant Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner size="md" />
          <p className="mt-4 text-neutral-500">Dashboard coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}