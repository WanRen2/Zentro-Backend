import { createHash } from 'crypto';

// Parse Zentро token: 'zentro:v1:<base64(publicKey)>'
export function parseToken(token) {
  if (!token || !token.startsWith('zentro:v1:')) {
    throw new Error('Invalid token format');
  }
  const pubKeyB64 = token.substring('zentro:v1:'.length);
  const pubKey = Buffer.from(pubKeyB64, 'base64');
  const fingerprint = createHash('sha256').update(pubKey).digest('hex');
  return { pubKey, fingerprint };
}
