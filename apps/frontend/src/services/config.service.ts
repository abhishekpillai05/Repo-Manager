/**
 * System configuration service — placeholder methods for future backend integration.
 */
import type { SystemConfig, UpdateSystemConfigPayload } from '@pt-repo-manager/shared-types';

export const configService = {
  /**
   * Fetch the current global system configuration.
   * @throws Error Not implemented — awaiting backend.
   */
  async getConfig(): Promise<SystemConfig> {
    throw new Error('Not implemented');
  },

  /**
   * Update the global system configuration.
   * @throws Error Not implemented — awaiting backend.
   */
  async updateConfig(_payload: UpdateSystemConfigPayload): Promise<SystemConfig> {
    throw new Error('Not implemented');
  },

  /**
   * Reset the configuration to factory defaults.
   * @throws Error Not implemented — awaiting backend.
   */
  async resetConfig(): Promise<SystemConfig> {
    throw new Error('Not implemented');
  },
};
