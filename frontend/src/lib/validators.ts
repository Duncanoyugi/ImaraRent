/**
 * Re-exported validation primitives.
 *
 * Zod schemas live with their feature (`features/<x>/schemas`); these are the
 * raw predicates those schemas and ad-hoc checks share.
 */
export {
  isEmail,
  isKenyanPhone,
  toMsisdn,
  isNationalId,
  isStrongPassword,
  passwordStrength,
  isPositiveAmount,
  isUrl,
  isValidRange,
} from '@/utils/validators';

export type { PasswordStrength } from '@/utils/validators';
