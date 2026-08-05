// Existing exports — preserved for backward compatibility with Engineer C
export * from './src/repo.interface';
export * from './src/config.interface';
export * from './src/audit.interface';
export * from './src/auth.interface';

// Engineer B additions
export * from './src/audit-action.enum';
export * from './src/system-config.interface';
export * from './src/repo-override.interface';
export * from './src/audit-log.interface';

// Type alias for backward compatibility
export type AuditActionType = import('./src/audit-action.enum').AuditAction | string;
