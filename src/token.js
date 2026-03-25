import { createHash } from 'crypto';

export function parseToken(token) {
  if (!token) {
    throw new Error('Token is empty');
  }
  
  if (token.startsWith('zentro:v1:')) {
    const pubKeyB64 = token.substring('zentro:v1:'.length);
    try {
      const pubKey = Buffer.from(pubKeyB64, 'base64');
      const fingerprint = createHash('sha256').update(pubKey).digest('hex');
      return { pubKey: pubKey.toString('base64'), fingerprint };
    } catch {
      throw new Error('Invalid token encoding');
    }
  }
  
  throw new Error('Invalid token format');
}
