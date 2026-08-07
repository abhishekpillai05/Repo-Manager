/**
 * Audit log service — wired to backend /audit endpoints.
 */
import type { PaginatedAuditResponse } from '@pt-repo-manager/shared-types';
import { apiGet, fetchBlob } from './api';

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
   */
  async getLogs(params?: AuditLogParams): Promise<PaginatedAuditResponse> {
    const query: Record<string, string> = {};
    if (params) {
      if (params.page) query.page = String(params.page);
      if (params.limit) query.limit = String(params.limit);
      if (params.userId) query.userId = params.userId;
      if (params.action) query.action = params.action;
      if (params.repositoryName) query.repositoryName = params.repositoryName;
      if (params.dateFrom) query.startDate = params.dateFrom;
      if (params.dateTo) query.endDate = params.dateTo;
    }
    return apiGet<PaginatedAuditResponse>('/audit', query);
  },

  /**
   * Export audit logs as CSV for a given date range.
   * Returns a Blob that can be downloaded by the browser.
   */
  async exportCsv(params?: Pick<AuditLogParams, 'dateFrom' | 'dateTo' | 'action' | 'userId'>): Promise<Blob> {
    const query: Record<string, string> = {};
    if (params) {
      if (params.userId) query.userId = params.userId;
      if (params.action) query.action = params.action;
      if (params.dateFrom) query.startDate = params.dateFrom;
      if (params.dateTo) query.endDate = params.dateTo;
    }
    return fetchBlob('/audit/export', query);
  },
};
