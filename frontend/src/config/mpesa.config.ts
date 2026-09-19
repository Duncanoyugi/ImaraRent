import { env } from './env';

/**
 * M-Pesa (Safaricom Daraja) client-side configuration.
 *
 * Secrets — consumer key/secret, passkey — live only on the backend. The
 * frontend needs the shopfront details for copy, and the polling cadence for
 * the STK-push wait screen.
 */
export const mpesaConfig = {
  enabled: env.ENABLE_MPESA,
  environment: env.IS_PROD ? 'production' : 'sandbox',

  /** Paybill/Till shown to tenants who prefer to pay manually. */
  shortCode: import.meta.env.VITE_MPESA_SHORTCODE || '',
  accountLabel: import.meta.env.VITE_MPESA_ACCOUNT_LABEL || 'Your unit number',

  limits: {
    /** Daraja rejects amounts outside this range. */
    min: 1,
    max: 250_000,
  },

  /**
   * After the STK push the phone shows a PIN prompt. We poll for the result
   * rather than wait on a socket, because the callback lands on the backend.
   */
  polling: {
    intervalMs: 3_000,
    timeoutMs: 120_000,
    get maxAttempts() {
      return Math.ceil(this.timeoutMs / this.intervalMs);
    },
  },

  /** Copy shown while the tenant is being prompted on their handset. */
  messages: {
    prompting: 'Check your phone for the M-Pesa prompt and enter your PIN.',
    pending: 'Waiting for confirmation from M-Pesa…',
    success: 'Payment received. Your balance has been updated.',
    timeout:
      'We have not heard back from M-Pesa yet. If your PIN was accepted the payment will appear shortly.',
    cancelled: 'The M-Pesa request was cancelled on your phone.',
    failed: 'M-Pesa could not process that payment.',
  },
} as const;

/** Daraja result codes the tenant-facing UI distinguishes between. */
export const MPESA_RESULT_CODES = {
  SUCCESS: 0,
  INSUFFICIENT_FUNDS: 1,
  CANCELLED_BY_USER: 1032,
  TIMEOUT: 1037,
  WRONG_PIN: 2001,
} as const;

export const mpesaResultMessage = (code: number | undefined): string => {
  switch (code) {
    case MPESA_RESULT_CODES.SUCCESS:
      return mpesaConfig.messages.success;
    case MPESA_RESULT_CODES.INSUFFICIENT_FUNDS:
      return 'There was not enough money in the M-Pesa account.';
    case MPESA_RESULT_CODES.CANCELLED_BY_USER:
      return mpesaConfig.messages.cancelled;
    case MPESA_RESULT_CODES.TIMEOUT:
      return 'The request timed out before the PIN was entered.';
    case MPESA_RESULT_CODES.WRONG_PIN:
      return 'The M-Pesa PIN entered was incorrect.';
    default:
      return mpesaConfig.messages.failed;
  }
};
