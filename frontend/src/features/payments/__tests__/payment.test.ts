import { describe, expect, it } from 'vitest';
import { toMsisdn } from '@/utils/validators';
import { mpesaResultMessage, MPESA_RESULT_CODES, mpesaConfig } from '@/config/mpesa.config';
import { decimal } from '@/utils/number-helpers';
import { buildPayment } from '@/test/fixtures/invoice.fixture';

describe('M-Pesa result codes', () => {
  it('reports success distinctly from every failure', () => {
    expect(mpesaResultMessage(MPESA_RESULT_CODES.SUCCESS)).toBe(mpesaConfig.messages.success);
  });

  it('tells the tenant specifically what went wrong', () => {
    expect(mpesaResultMessage(MPESA_RESULT_CODES.INSUFFICIENT_FUNDS)).toMatch(/enough money/i);
    expect(mpesaResultMessage(MPESA_RESULT_CODES.WRONG_PIN)).toMatch(/incorrect/i);
    expect(mpesaResultMessage(MPESA_RESULT_CODES.TIMEOUT)).toMatch(/timed out/i);
  });

  it('distinguishes a user cancellation from a system failure', () => {
    expect(mpesaResultMessage(MPESA_RESULT_CODES.CANCELLED_BY_USER)).toBe(
      mpesaConfig.messages.cancelled
    );
  });

  it('falls back to a generic failure for an unrecognised code', () => {
    expect(mpesaResultMessage(9999)).toBe(mpesaConfig.messages.failed);
    expect(mpesaResultMessage(undefined)).toBe(mpesaConfig.messages.failed);
  });
});

describe('STK push preconditions', () => {
  it('sends the msisdn in the only format Daraja accepts', () => {
    expect(toMsisdn('0712345678')).toMatch(/^254\d{9}$/);
  });

  it('derives a polling attempt count from the timeout', () => {
    // Guards against a config edit that would make the wait screen hang.
    expect(mpesaConfig.polling.maxAttempts).toBe(
      Math.ceil(mpesaConfig.polling.timeoutMs / mpesaConfig.polling.intervalMs)
    );
    expect(mpesaConfig.polling.maxAttempts).toBeGreaterThan(0);
  });

  it('keeps Daraja transaction limits in a sane range', () => {
    expect(mpesaConfig.limits.min).toBeGreaterThan(0);
    expect(mpesaConfig.limits.max).toBeLessThanOrEqual(250_000);
  });
});

describe('payment records', () => {
  it('reads amounts whether they arrive as numbers or strings', () => {
    expect(decimal(buildPayment({ amount: 35000 }).amount)).toBe(35000);
    expect(decimal(buildPayment({ amount: '35000.00' as never }).amount)).toBe(35000);
  });
});
