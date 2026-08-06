/**
 * Authentication service — placeholder methods for future GitHub OAuth integration.
 */

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'tech_lead' | 'engineering_manager';
}

export const authService = {
  /**
   * Initiate GitHub OAuth flow by redirecting to the backend auth endpoint.
   * @throws Error Not implemented — awaiting backend.
   */
  initiateGitHubLogin(): void {
    throw new Error('Not implemented');
  },

  /**
   * Fetch the currently authenticated user profile.
   * @throws Error Not implemented — awaiting backend.
   */
  async getCurrentUser(): Promise<AuthUser> {
    throw new Error('Not implemented');
  },

  /**
   * Log the current user out and invalidate the session.
   * @throws Error Not implemented — awaiting backend.
   */
  async logout(): Promise<void> {
    throw new Error('Not implemented');
  },

  /**
   * Check if the user is currently authenticated.
   * @throws Error Not implemented — awaiting backend.
   */
  async isAuthenticated(): Promise<boolean> {
    throw new Error('Not implemented');
  },
};
