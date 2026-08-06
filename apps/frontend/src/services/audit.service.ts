/**
 * Audit log service — placeholder methods for future backend integration.
 */
import type { PaginatedAuditResponse } from '@pt-repo-manager/shared-types';

export interface AuditLogParams {
  page?: number;
  limit?: number;
  userId?: string;
  action?: string;
  repositoryName?: string;
  dateFrom?: string;
  dateTo?: string;
}

export const auditService = {
  /**
   * Fetch paginated audit log entries.
   * @throws Error Not implemented — awaiting backend.
   */
  async getLogs(_params?: AuditLogParams): Promise<PaginatedAuditResponse> {
    throw new Error('Not implemented');
  },

  /**
   * Export audit logs as CSV for a given date range.
   * Returns a Blob that can be downloaded by the browser.
   * @throws Error Not implemented — awaiting backend.
   */
  async exportCsv(_params?: Pick<AuditLogParams, 'dateFrom' | 'dateTo' | 'action' | 'userId'>): Promise<Blob> {
    throw new Error('Not implemented');
  },
};
