import { PageHeader } from '@/components/shared/page-header';
import { UserProfile } from '@/features/users/components/user-profile';

export default function OwnerProfilePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Your profile"
        description="Your contact details and password."
      />
      <UserProfile />
    </div>
  );
}
