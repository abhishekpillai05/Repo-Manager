export interface AuditEntry {
  actor: string;
  actionType: string;
  targetRepo: string;
  timestampUtc: string;
  ipAddress: string;
}
