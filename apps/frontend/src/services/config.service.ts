/**
 * System configuration service — wired to backend /config endpoints.
 */
import type { SystemConfig, UpdateSystemConfigPayload } from '@pt-repo-manager/shared-types';
import { apiGet, apiPut } from './api';

export const configService = {
  /**
   * Fetch the current global system configuration.
   */
  async getConfig(): Promise<SystemConfig> {
    return apiGet<SystemConfig>('/config');
  },

  /**
   * Update the global system configuration.
   */
  async updateConfig(payload: UpdateSystemConfigPayload): Promise<SystemConfig> {
    return apiPut<SystemConfig>('/config', payload);
  },

  /**
   * Reset the configuration to factory defaults.
   */
  async resetConfig(): Promise<SystemConfig> {
    return apiPut<SystemConfig>('/config', {
      retentionDays: 90,
      autoDeleteEnabled: true,
      autoArchiveEnabled: false,
      warningDays: 7,
    });
  },
};
