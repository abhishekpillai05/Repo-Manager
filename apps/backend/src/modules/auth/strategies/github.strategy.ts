import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-github2';
import { AppConfigService } from '../../../config/app-config.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(appConfig: AppConfigService) {
    super({
      clientID: appConfig.githubClientId,
      clientSecret: appConfig.githubClientSecret,
      callbackURL: appConfig.githubCallbackUrl,
      scope: ['repo', 'admin:org', 'delete_repo', 'read:user'],
    });
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (err: any, user?: any, info?: any) => void,
  ): Promise<any> {
    const user = {
      githubUsername: profile.username || profile.id,
      githubAccessToken: accessToken,
    };
    done(null, user);
  }
}
