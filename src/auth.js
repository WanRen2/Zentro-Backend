import { parseToken } from './token.js';

export function auth(req, res, next) {
  // Dev mode bypass - set DEV_BYPASS_AUTH=true in .env for local development
  if (process.env.DEV_BYPASS_AUTH === 'true') {
    req.user = { fingerprint: 'dev' };
    return next();
  }

  // Production: require Authorization header with Bearer token
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const parts = String(authHeader).split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Invalid Authorization header format' });
  }

  // Verify token matches the configured GITHUB_TOKEN
  const providedToken = parts[1];
  if (process.env.GITHUB_TOKEN && providedToken === process.env.GITHUB_TOKEN) {
    req.user = { fingerprint: 'authenticated' };
    return next();
  }

  // Also accept zentro tokens (for future client auth)
  try {
    const parsed = parseToken(providedToken);
    req.user = { fingerprint: parsed.fingerprint };
    return next();
  } catch {
    // Token is not a valid zentro token
  }

  res.status(403).json({ error: 'Forbidden' });
}
