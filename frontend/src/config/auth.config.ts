export const authConfig = {
  // Token storage keys
  storage: {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    user: 'user',
    organization: 'organization',
  },

  // Token expiration (in seconds)
  token: {
    accessTokenExpiry: 15 * 60, // 15 minutes
    refreshTokenExpiry: 7 * 24 * 60 * 60, // 7 days
  },

  // Redirect paths
  redirect: {
    login: '/login',
    register: '/register',
    home: '/dashboard',
    ownerDashboard: '/dashboard',
    managerDashboard: '/dashboard',
    tenantDashboard: '/dashboard',
    acceptInvitation: '/accept-invitation',
  },

  // Role-based redirects
  roleRedirects: {
    OWNER: '/dashboard',
    MANAGER: '/dashboard',
    TENANT: '/dashboard',
  },
};