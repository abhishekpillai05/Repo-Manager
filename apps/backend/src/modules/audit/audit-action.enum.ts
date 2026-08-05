/**
 * Re-exports AuditAction from shared-types so backend modules can use a
 * shorter local import path instead of the full workspace package path.
 *
 * Usage in backend:  import { AuditAction } from '../audit/audit-action.enum';
 * Usage in shared:   import { AuditAction } from '@pt-repo-manager/shared-types';
 */
export { AuditAction } from '@pt-repo-manager/shared-types';
