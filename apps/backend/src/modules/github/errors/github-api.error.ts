export class GithubApiError extends Error {
  public readonly status: number;
  public readonly isRateLimit: boolean;

  constructor(message: string, status: number = 500, isRateLimit: boolean = false) {
    super(message);
    this.name = 'GithubApiError';
    this.status = status;
    this.isRateLimit = isRateLimit;

    // Restore prototype chain for custom Error in TypeScript
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
