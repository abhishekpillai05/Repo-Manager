import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SessionStoreService } from './session-store.service';

export interface JwtPayload {
  githubUsername: string;
  sessionId: string;
  githubAccessToken?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly sessionStoreService: SessionStoreService,
  ) {}

  async handleGithubCallback(githubUsername: string, githubAccessToken: string): Promise<{ jwtToken: string; sessionId: string }> {
    // 1. Save raw access token server-side in SessionStore (used for logout invalidation)
    const sessionId = this.sessionStoreService.createSession(githubUsername, githubAccessToken);

    // 2. Sign JWT containing githubUsername, sessionId AND githubAccessToken
    //    Embedding the token in JWT makes sessions survive backend restarts.
    const payload: JwtPayload = { githubUsername, sessionId, githubAccessToken };
    const jwtToken = await this.jwtService.signAsync(payload);

    return { jwtToken, sessionId };
  }

  logout(sessionId: string): void {
    if (sessionId) {
      this.sessionStoreService.deleteSession(sessionId);
    }
  }
}
