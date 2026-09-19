export type { User, UserRole } from '@/types/user.types';
export type { ManagerPropertyAssignment, InviteManagerData } from '../services/user.service';

/** Editable fields on `PATCH /users/:id`. */
export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  email?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}
