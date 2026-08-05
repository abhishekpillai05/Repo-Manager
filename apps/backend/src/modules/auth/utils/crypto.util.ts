import * as crypto from 'crypto';

export function cryptoRandomString(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}
