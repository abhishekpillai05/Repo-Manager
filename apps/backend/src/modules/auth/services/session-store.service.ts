import { Injectable } from '@nestjs/common';
import { cryptoRandomString } from '../utils/crypto.util';

export interface UserSession {
  sessionId: string;
  githubUsername: string;
  githubAccessToken: string;
  createdAt: Date;
}

@Injectable()
export class SessionStoreService {
  private readonly sessions = new Map<string, UserSession>();

  createSession(githubUsername: string, githubAccessToken: string): string {
    const sessionId = cryptoRandomString(32);
    const session: UserSession = {
      sessionId,
      githubUsername,
      githubAccessToken,
      createdAt: new Date(),
    };
    this.sessions.set(sessionId, session);
    return sessionId;
  }

  getSession(sessionId: string): UserSession | undefined {
    return this.sessions.get(sessionId);
  }

  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }
}
