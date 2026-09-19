import { describe, expect, it } from 'vitest';
import {
  changePasswordSchema,
  inviteManagerSchema,
  profileSchema,
} from '../schemas/user.schemas';

describe('manager invitation', () => {
  const valid = {
    firstName: 'Brian',
    lastName: 'Otieno',
    email: 'otieno@example.co.ke',
    phone: '0712345678',
    propertyIds: ['property-1'],
  };

  it('accepts a complete invitation', () => {
    expect(inviteManagerSchema.safeParse(valid).success).toBe(true);
  });

  it('requires at least one property', () => {
    // A manager with no assignments can sign in but sees nothing, which
    // reads as a broken account rather than a permissions boundary.
    const result = inviteManagerSchema.safeParse({ ...valid, propertyIds: [] });
    expect(result.success).toBe(false);
  });

  it('allows the phone number to be omitted', () => {
    expect(inviteManagerSchema.safeParse({ ...valid, phone: '' }).success).toBe(true);
  });

  it('rejects a non-Kenyan phone number', () => {
    expect(inviteManagerSchema.safeParse({ ...valid, phone: '0812345678' }).success).toBe(false);
  });

  it('rejects a malformed email', () => {
    expect(inviteManagerSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false);
  });
});

describe('profile', () => {
  it('requires both names', () => {
    expect(
      profileSchema.safeParse({ firstName: 'A', lastName: 'Otieno', email: 'a@b.co' }).success
    ).toBe(false);
  });
});

describe('password change', () => {
  const valid = {
    currentPassword: 'oldpass123',
    newPassword: 'newpass456',
    confirmPassword: 'newpass456',
  };

  it('accepts a valid change', () => {
    expect(changePasswordSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a mismatched confirmation, pointing at the right field', () => {
    const result = changePasswordSchema.safeParse({ ...valid, confirmPassword: 'different1' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('confirmPassword');
    }
  });

  it('refuses to reuse the current password', () => {
    const result = changePasswordSchema.safeParse({
      currentPassword: 'samepass1',
      newPassword: 'samepass1',
      confirmPassword: 'samepass1',
    });
    expect(result.success).toBe(false);
  });

  it('enforces a letter and a number', () => {
    expect(
      changePasswordSchema.safeParse({
        ...valid,
        newPassword: 'alllettersonly',
        confirmPassword: 'alllettersonly',
      }).success
    ).toBe(false);

    expect(
      changePasswordSchema.safeParse({
        ...valid,
        newPassword: '12345678',
        confirmPassword: '12345678',
      }).success
    ).toBe(false);
  });

  it('enforces a minimum length', () => {
    expect(
      changePasswordSchema.safeParse({ ...valid, newPassword: 'ab1', confirmPassword: 'ab1' })
        .success
    ).toBe(false);
  });
});
