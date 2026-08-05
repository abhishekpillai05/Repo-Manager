import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthenticatedUserDto } from '@pt-repo-manager/shared-types';
import { AppConfigService } from '../../config/app-config.service';
import { AuthService } from './services/auth.service';
import { JwtAuthGuard, RequestUser } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly appConfig: AppConfigService,
  ) {}

  @Get('login')
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubLogin() {
    // Passport redirects automatically to GitHub OAuth authorize page
  }

  @Get('callback')
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as { githubUsername: string; githubAccessToken: string };

    const { jwtToken } = await this.authService.handleGithubCallback(
      user.githubUsername,
      user.githubAccessToken,
    );

    // Set JWT in httpOnly, secure, sameSite=lax cookie
    res.cookie('pt_auth_token', jwtToken, {
      httpOnly: true,
      secure: this.appConfig.isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 3600 * 1000, // 7 days
    });

    // Redirect to frontend application
    return res.redirect(this.appConfig.frontendOrigin);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: RequestUser): AuthenticatedUserDto {
    return {
      githubUsername: user.githubUsername,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(
    @CurrentUser() user: RequestUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (user?.sessionId) {
      this.authService.logout(user.sessionId);
    }

    res.clearCookie('pt_auth_token', {
      httpOnly: true,
      secure: this.appConfig.isProduction,
      sameSite: 'lax',
    });

    return { message: 'Logged out successfully' };
  }
}
