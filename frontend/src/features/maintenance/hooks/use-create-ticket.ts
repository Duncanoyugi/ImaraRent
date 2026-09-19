/**
 * Re-export of `use-maintenance`.
 *
 * The hooks for this feature are implemented together in that one module so
 * they can share query keys and cache invalidation. This file exists so the
 * per-hook import path documented in the README keeps working.
 */
export { useCreateTicket } from './use-maintenance';
