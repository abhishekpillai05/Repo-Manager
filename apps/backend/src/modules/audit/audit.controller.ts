import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AuditService } from './audit.service';
import { AuditQueryDto } from './dto/audit-query.dto';

@Controller('audit')
@UseGuards(AuthGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  /**
   * GET /audit
   * Returns paginated audit logs.
   * Optional query params: userId, action, repositoryId, startDate, endDate, page, limit
   */
  @Get()
  findAll(@Query() query: AuditQueryDto) {
    return this.auditService.findAll(query);
  }

  /**
   * GET /audit/export
   * Streams the matching audit logs as a CSV file download.
   * Accepts the same query filters as GET /audit (excluding page/limit — exports all).
   */
  @Get('export')
  async exportCsv(
    @Query() query: AuditQueryDto,
    @Res() res: Response,
  ): Promise<void> {
    const csv = await this.auditService.exportCsv(query);
    const filename = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(csv);
  }
}
