/**
 * Canonical audit action identifiers used across the PT Repo Manager system.
 * All backend modules and Engineer D's scheduler should import from here
 * or from the audit module's barrel re-export.
 */
export enum AuditAction {
  CONFIG_UPDATED = 'CONFIG_UPDATED',
  OVERRIDE_CREATED = 'OVERRIDE_CREATED',
  OVERRIDE_UPDATED = 'OVERRIDE_UPDATED',
  OVERRIDE_DELETED = 'OVERRIDE_DELETED',
  REPOSITORY_DELETED = 'REPOSITORY_DELETED',
  REPOSITORY_ARCHIVED = 'REPOSITORY_ARCHIVED',
  COLLABORATOR_REVOKED = 'COLLABORATOR_REVOKED',
}
