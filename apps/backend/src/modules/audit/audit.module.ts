import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogEntity } from '../../database/entities/audit-log.entity';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLogEntity])],
  providers: [AuditService],
  controllers: [AuditController],
  /**
   * AuditService is exported so Engineers A, C, and D can inject it into their
   * own modules without touching the audit_log table directly.
   */
  exports: [AuditService],
})
export class AuditModule { }
