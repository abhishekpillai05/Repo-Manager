/**
 * Authentication service — wired to backend GitHub OAuth endpoints.
 */
import { apiGet, apiPost } from './api';

export interface AuthUser {
  githubUsername: string;
}

export const authService = {
  /**
   * Initiate GitHub OAuth flow by redirecting to the backend auth endpoint.
   */
  initiateGitHubLogin(): void {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    window.location.href = `${apiUrl}/api/auth/github`;
  },

  /**
   * Fetch the currently authenticated user profile.
   */
  async getCurrentUser(): Promise<AuthUser> {
    return apiGet<AuthUser>('/auth/me');
  },

  /**
   * Log the current user out and invalidate the session.
   */
  async logout(): Promise<void> {
    await apiPost<{ message: string }>('/auth/logout');
  },

  /**
   * Check if the user is currently authenticated.
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  },
};
