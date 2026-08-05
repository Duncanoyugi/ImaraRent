import { env } from './env';

export const featureFlags = {
  // Payment features
  mpesa: {
    enabled: env.ENABLE_MPESA,
    sandboxMode: !env.IS_PROD,
  },

  // Realtime features
  realtime: {
    enabled: env.ENABLE_REALTIME,
    websocketUrl: env.IS_PROD ? 'wss://api.imararent.com/ws' : 'ws://localhost:3000/ws',
  },

  // PWA features
  pwa: {
    enabled: env.ENABLE_PWA,
    cacheStrategy: 'network-first',
  },

  // Reporting features
  reports: {
    enabled: true,
    exportFormats: ['PDF', 'CSV', 'JSON'],
  },

  // Maintenance features
  maintenance: {
    photoUpload: true,
    priorityLevels: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
  },

  // Tenant portal features
  tenantPortal: {
    enabled: true,
    allowProfileEdit: true,
    allowMaintenanceTickets: true,
  },

  // Development features
  dev: {
    showDevTools: env.IS_DEV,
    mockApi: env.IS_DEV && import.meta.env.VITE_MOCK_API === 'true',
  },
};