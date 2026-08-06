import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from '../../config/app-config.module';
import { AppConfigService } from '../../config/app-config.service';
import { GithubStrategy } from './strategies/github.strategy';
import { SessionStoreService } from './services/session-store.service';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from '../../common/guards/auth.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'github' }),
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (appConfig: AppConfigService) => ({
        secret: appConfig.jwtSecret,
        signOptions: {
          expiresIn: appConfig.jwtExpiresIn,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    GithubStrategy,
    SessionStoreService,
    AuthService,
    JwtAuthGuard,
  ],
  exports: [AuthService, SessionStoreService, JwtAuthGuard, JwtModule],
})
export class AuthModule {}
