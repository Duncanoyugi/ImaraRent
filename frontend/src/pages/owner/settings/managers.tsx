import { useState } from 'react';
import { UserPlus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useProperties } from '@/features/properties/hooks/use-properties';
import {
  useAssignManagerProperties,
  useInviteManager,
  useManagerProperties,
  useUsers,
} from '@/features/users/hooks/use-users';

const initialForm = { firstName: '', lastName: '', email: '', phone: '' };

export default function OwnerManagersPage() {
  const { data: users, isLoading: usersLoading } = useUsers();
  const { data: properties, isLoading: propertiesLoading } = useProperties();
  const [form, setForm] = useState(initialForm);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [selectedManagerId, setSelectedManagerId] = useState<string>();
  const [assignmentIds, setAssignmentIds] = useState<string[]>([]);
  const [emailSent, setEmailSent] = useState<boolean>();
  const inviteManager = useInviteManager();
  const assignProperties = useAssignManagerProperties();
  const { data: assignments } = useManagerProperties(selectedManagerId);

  const managers = users?.filter((user) => user.role === 'MANAGER') ?? [];

  const selectManager = (managerId: string | undefined) => {
    setSelectedManagerId(managerId);
    setAssignmentIds([]);
  };

  const currentAssignmentIds = selectedManagerId
    ? (assignmentIds.length > 0 || assignments === undefined
      ? assignmentIds
      : assignments.filter((assignment) => assignment.isActive).map((assignment) => assignment.propertyId))
    : [];

  const toggleProperty = (propertyId: string, setter: (ids: string[]) => void, ids: string[]) => {
    setter(ids.includes(propertyId) ? ids.filter((id) => id !== propertyId) : [...ids, propertyId]);
  };

  const handleInvite = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = await inviteManager.mutateAsync({ ...form, propertyIds: selectedProperties });
    setEmailSent(result.emailSent);
    setForm(initialForm);
    setSelectedProperties([]);
  };

  const handleSaveAssignments = async () => {
    if (!selectedManagerId) return;
    await assignProperties.mutateAsync({ managerId: selectedManagerId, propertyIds: currentAssignmentIds });
    setAssignmentIds(currentAssignmentIds);
  };

  const propertyList = properties ?? [];
  const loading = usersLoading || propertiesLoading;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Manager access</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Invite managers and control the properties they can operate.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-lg">Invite manager</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input required placeholder="First name" value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} />
                <Input required placeholder="Last name" value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} />
              </div>
              <Input required type="email" placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
              <Input placeholder="Phone (optional)" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium text-neutral-900 dark:text-white">Assign properties</legend>
                <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
                  {propertyList.map((property) => (
                    <label key={property.id} className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                      <input type="checkbox" checked={selectedProperties.includes(property.id)} onChange={() => toggleProperty(property.id, setSelectedProperties, selectedProperties)} />
                      <span>{property.name}</span>
                    </label>
                  ))}
                  {!loading && propertyList.length === 0 && <p className="text-sm text-neutral-500">Create a property first.</p>}
                </div>
              </fieldset>
              <Button type="submit" loading={inviteManager.isPending}><UserPlus className="mr-2 h-4 w-4" />Invite manager</Button>
              {emailSent !== undefined && <p className="rounded-lg bg-success-50 p-3 text-sm text-success-700 dark:bg-success-950 dark:text-success-300">{emailSent ? 'Invitation sent by email.' : 'Manager created, but email delivery is not configured.'}</p>}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Property assignments</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <select className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-900" value={selectedManagerId ?? ''} onChange={(event) => selectManager(event.target.value || undefined)}>
              <option value="">Select a manager</option>
              {managers.map((manager) => <option key={manager.id} value={manager.id}>{manager.firstName} {manager.lastName}</option>)}
            </select>
            {selectedManagerId && <>
              <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
                {propertyList.map((property) => (
                  <label key={property.id} className="flex items-center gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <input type="checkbox" checked={currentAssignmentIds.includes(property.id)} onChange={() => toggleProperty(property.id, setAssignmentIds, currentAssignmentIds)} />
                    <span>{property.name}</span>
                  </label>
                ))}
              </div>
              <Button onClick={handleSaveAssignments} loading={assignProperties.isPending}><Save className="mr-2 h-4 w-4" />Save assignments</Button>
            </>}
            {!selectedManagerId && <p className="text-sm text-neutral-500">Select a manager to edit their properties.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}