import { describe, expect, it } from 'vitest';
import { organizationSchema } from '../schemas/organization.schemas';

describe('organization settings validation', () => {
  it('accepts a full set of details', () => {
    const result = organizationSchema.safeParse({
      name: 'Imara Properties Ltd',
      email: 'accounts@imara.co.ke',
      phone: '0712345678',
      address: 'Kimathi Street, Nairobi',
    });
    expect(result.success).toBe(true);
  });

  it('requires a name', () => {
    expect(organizationSchema.safeParse({ name: 'A' }).success).toBe(false);
    expect(organizationSchema.safeParse({ name: '' }).success).toBe(false);
  });

  it('treats contact details as optional — they can be cleared', () => {
    const result = organizationSchema.safeParse({
      name: 'Imara Properties Ltd',
      email: '',
      phone: '',
      address: '',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a malformed email when one is supplied', () => {
    const result = organizationSchema.safeParse({
      name: 'Imara Properties Ltd',
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a non-Kenyan phone number when one is supplied', () => {
    const result = organizationSchema.safeParse({
      name: 'Imara Properties Ltd',
      phone: '12345',
    });
    expect(result.success).toBe(false);
  });
});
