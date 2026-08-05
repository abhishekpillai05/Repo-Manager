import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './app-config.service';
import { validateEnvironmentVariables } from './env.validation';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateEnvironmentVariables,
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
