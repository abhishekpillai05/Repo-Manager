export interface SystemConfig {
  id: string;
  retentionDays: number;
  autoDeleteEnabled: boolean;
  autoArchiveEnabled: boolean;
  warningDays: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSystemConfigPayload {
  retentionDays?: number;
  autoDeleteEnabled?: boolean;
  autoArchiveEnabled?: boolean;
  warningDays?: number;
}
