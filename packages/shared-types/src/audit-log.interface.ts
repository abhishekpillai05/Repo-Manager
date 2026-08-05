import { AuditAction } from './audit-action.enum';

export interface AuditLog {
  id: string;
  userId: string | null;
  action: AuditAction;
  repositoryId: string | null;
  repositoryName: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
}

export interface PaginatedAuditResponse {
  data: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
