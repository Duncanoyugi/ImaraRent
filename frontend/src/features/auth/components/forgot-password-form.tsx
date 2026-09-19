import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

/**
 * Password recovery.
 *
 * IMPORTANT: self-service reset is NOT available in this release. The API
 * exposes no `/auth/forgot-password` endpoint — delivering one needs a
 * reset-token table, an expiry policy and a transactional email template,
 * none of which exist yet. (`authService.forgotPassword` is present in the
 * client but has nothing to call.)
 *
 * Rather than render a form that silently fails, this screen tells the user
 * the truth and points them at the person who can actually help: an owner or
 * manager can revoke and re-invite an account, which issues a fresh
 * set-your-password link.
 *
 * When the endpoint ships, replace this with a react-hook-form + Zod form
 * posting `forgotPasswordSchema` to `authService.forgotPassword`, and use
 * `reset-password-form.tsx`, which is already written against the contract.
 */
export const ForgotPasswordForm = () => (
  <div className="space-y-5">
    <Alert variant="info">
      <AlertTitle>Resetting your own password is not available yet</AlertTitle>
      <AlertDescription>
        We cannot email you a reset link in this version of ImaraRent.
      </AlertDescription>
    </Alert>

    <div className="space-y-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
      <p>To get back into your account:</p>
      <ul className="list-disc space-y-1.5 pl-5">
        <li>
          <strong className="text-neutral-900 dark:text-neutral-100">Tenants</strong> — contact
          your property manager. They can send you a fresh invitation link, which lets you
          choose a new password.
        </li>
        <li>
          <strong className="text-neutral-900 dark:text-neutral-100">Managers</strong> — contact
          the property owner, who can re-issue your invitation.
        </li>
        <li>
          <strong className="text-neutral-900 dark:text-neutral-100">Owners</strong> — contact
          your system administrator, who can reset the password directly against the database.
        </li>
      </ul>
      <p>
        If you do remember your password, you can change it at any time from{' '}
        <strong className="text-neutral-900 dark:text-neutral-100">Your profile</strong> once
        signed in.
      </p>
    </div>

    <div className="flex flex-col gap-2 sm:flex-row">
      <Button variant="outline" asChild className="flex-1 gap-2">
        <Link to="/login">
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </Button>
      <Button asChild className="flex-1 gap-2">
        <a href="mailto:support@imararent.com?subject=Password%20help">
          <Mail className="h-4 w-4" />
          Email support
        </a>
      </Button>
    </div>
  </div>
);

ForgotPasswordForm.displayName = 'ForgotPasswordForm';
