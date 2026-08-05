// Role-based permission checks
export type UserRole = 'OWNER' | 'MANAGER' | 'TENANT';

export const permissions = {
  // Check if user has a specific role
  hasRole: (userRole: UserRole | undefined | null, requiredRole: UserRole): boolean => {
    if (!userRole) return false;
    return userRole === requiredRole;
  },

  // Check if user has any of the required roles
  hasAnyRole: (userRole: UserRole | undefined | null, requiredRoles: UserRole[]): boolean => {
    if (!userRole) return false;
    return requiredRoles.includes(userRole);
  },

  // Check if user is owner
  isOwner: (role: UserRole | undefined | null): boolean => {
    return role === 'OWNER';
  },

  // Check if user is manager
  isManager: (role: UserRole | undefined | null): boolean => {
    return role === 'MANAGER';
  },

  // Check if user is tenant
  isTenant: (role: UserRole | undefined | null): boolean => {
    return role === 'TENANT';
  },

  // Check if user can access owner features
  canAccessOwnerFeatures: (role: UserRole | undefined | null): boolean => {
    return role === 'OWNER';
  },

  // Check if user can access manager features
  canAccessManagerFeatures: (role: UserRole | undefined | null): boolean => {
    return role === 'OWNER' || role === 'MANAGER';
  },

  // Check if user can access tenant features
  canAccessTenantFeatures: (role: UserRole | undefined | null): boolean => {
    return role === 'TENANT';
  },
};