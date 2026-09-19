import { describe, expect, it } from 'vitest';
import {
  isEmail,
  isKenyanPhone,
  toMsisdn,
  passwordStrength,
  isStrongPassword,
} from '@/utils/validators';
import { normalizeError } from '@/utils/error-handlers';
import { apiError, networkError } from '@/test/mocks/api-mocks';

describe('credential validation', () => {
  it('accepts well-formed emails and rejects malformed ones', () => {
    expect(isEmail('amina@example.co.ke')).toBe(true);
    expect(isEmail('  amina@example.co.ke  ')).toBe(true);
    expect(isEmail('amina@example')).toBe(false);
    expect(isEmail('amina at example.co.ke')).toBe(false);
  });

  it('accepts every form a Kenyan number is typed in', () => {
    // These four all denote the same handset.
    expect(isKenyanPhone('0712345678')).toBe(true);
    expect(isKenyanPhone('712345678')).toBe(true);
    expect(isKenyanPhone('254712345678')).toBe(true);
    expect(isKenyanPhone('+254712345678')).toBe(true);
    // Safaricom's 01x range.
    expect(isKenyanPhone('0112345678')).toBe(true);
  });

  it('rejects numbers that are not Kenyan mobiles', () => {
    expect(isKenyanPhone('0812345678')).toBe(false);
    expect(isKenyanPhone('07123')).toBe(false);
    expect(isKenyanPhone('')).toBe(false);
  });

  it('normalises every accepted form to the 2547XXXXXXXX Daraja needs', () => {
    expect(toMsisdn('0712345678')).toBe('254712345678');
    expect(toMsisdn('712345678')).toBe('254712345678');
    expect(toMsisdn('+254 712 345 678')).toBe('254712345678');
    expect(toMsisdn('254712345678')).toBe('254712345678');
  });

  it('requires a letter and a number in a password', () => {
    expect(isStrongPassword('short1')).toBe(false);
    expect(isStrongPassword('alllettersnonum')).toBe(false);
    expect(isStrongPassword('12345678')).toBe(false);
    expect(isStrongPassword('imara2026')).toBe(true);
  });

  it('scores password strength and explains what is missing', () => {
    const weak = passwordStrength('abc');
    expect(weak.score).toBe(0);
    expect(weak.hints).toContain('Use at least 8 characters');

    const strong = passwordStrength('Imara#2026rent');
    expect(strong.score).toBe(4);
    expect(strong.hints).toHaveLength(0);
  });
});

describe('error normalisation', () => {
  it('maps 401 to an auth error with a session-expired message', () => {
    const result = normalizeError(apiError(401));
    expect(result.isAuthError).toBe(true);
    expect(result.statusCode).toBe(401);
  });

  it('flags 403 as forbidden rather than retryable', () => {
    const result = normalizeError(apiError(403, 'Forbidden resource'));
    expect(result.isForbidden).toBe(true);
    expect(result.message).toBe('Forbidden resource');
  });

  it('takes the first message when the validation pipe returns an array', () => {
    const result = normalizeError(apiError(400, ['email must be an email', 'phone is invalid']));
    expect(result.isValidationError).toBe(true);
    expect(result.message).toBe('email must be an email');
  });

  it('distinguishes a dropped connection from a server error', () => {
    const offline = normalizeError(networkError());
    expect(offline.isNetworkError).toBe(true);
    expect(offline.isServerError).toBe(false);

    const crashed = normalizeError(apiError(500));
    expect(crashed.isServerError).toBe(true);
    expect(crashed.isNetworkError).toBe(false);
  });
});
