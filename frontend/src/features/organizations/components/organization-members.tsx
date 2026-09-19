import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { UserList } from '@/features/users/components/user-list';
import { UserInviteForm } from '@/features/users/components/user-invite-form';
import { useOrganizationUsers } from '../hooks/use-organization';

/** Roster card for Settings: who has access, plus the invite flow. */
export const OrganizationMembers = () => {
  const { data: members, isLoading } = useOrganizationUsers();
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle>Team access</CardTitle>
              <CardDescription>
                Owners see everything. Managers only see the properties you assign them.
              </CardDescription>
            </div>
            <Button size="sm" className="gap-2" onClick={() => setInviteOpen(true)}>
              <UserPlus className="h-4 w-4" />
              Invite manager
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-0 pb-0">
          <UserList users={members} isLoading={isLoading} />
        </CardContent>
      </Card>

      <Modal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        title="Invite a manager"
        description="They receive an email with a link to set their own password."
        size="lg"
      >
        <UserInviteForm onInvited={() => setInviteOpen(false)} />
      </Modal>
    </>
  );
};

OrganizationMembers.displayName = 'OrganizationMembers';
