import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  async checkHealth(@Res() res: Response) {
    let dbStatus = 'down';
    let isDbHealthy = false;

    try {
      if (this.dataSource.isInitialized) {
        await this.dataSource.query('SELECT 1');
        dbStatus = 'up';
        isDbHealthy = true;
      }
    } catch (error) {
      dbStatus = 'down';
      isDbHealthy = false;
    }

    const statusCode = isDbHealthy ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;

    return res.status(statusCode).json({
      status: isDbHealthy ? 'ok' : 'error',
      info: {
        database: {
          status: dbStatus,
        },
      },
      timestamp: new Date().toISOString(),
    });
  }
}
