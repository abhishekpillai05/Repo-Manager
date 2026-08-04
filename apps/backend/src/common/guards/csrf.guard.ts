import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method.toUpperCase();

    // Safe HTTP methods do not require CSRF header check
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return true;
    }

    // State-changing HTTP methods (POST, PUT, PATCH, DELETE) require a custom header check
    // Browser-based CSRF attacks cannot set custom headers across origins without CORS preflight.
    const customHeader =
      request.headers['x-requested-with'] ||
      request.headers['x-csrf-token'] ||
      request.headers['x-pt-app-client'];

    if (!customHeader) {
      throw new ForbiddenException(
        'CSRF Protection: Missing required custom request header for state-changing action',
      );
    }

    return true;
  }
}
