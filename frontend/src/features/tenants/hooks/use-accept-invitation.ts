/**
 * Tenant invitation acceptance.
 *
 * Separate from the tenant CRUD hooks because this runs *unauthenticated* —
 * the invitee has no session until the moment it succeeds — so it must not
 * touch any of the authenticated tenant caches.
 */
import { useMutation, useQuery } from '@tanstack/react-query';
import { tenantService } from '../services/tenant.service';
import { showToast } from '@/app/providers/toast-provider';
import { errorMessage } from '@/utils/error-handlers';
import type { AcceptInvitationData } from '../types/tenant.types';

/** Checks the token behind an invitation link before showing the form. */
export const useValidateInvitationToken = (token: string | null | undefined) =>
  useQuery({
    queryKey: ['tenant-invitation', token],
    queryFn: () => tenantService.validateInvitationToken(token!),
    enabled: !!token,
    retry: false,
    staleTime: Infinity,
  });

export const useAcceptTenantInvitation = () =>
  useMutation({
    mutationFn: (data: AcceptInvitationData) => tenantService.acceptInvitation(data),
    onSuccess: () => showToast.success('Welcome to ImaraRent', 'Your account is ready.'),
    onError: (error) =>
      showToast.error(
        'Could not accept the invitation',
        errorMessage(error, 'The link may have expired. Ask for a new invitation.')
      ),
  });
