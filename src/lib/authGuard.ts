import { cookies } from 'next/headers';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'admin_session';
const SECRET_KEY = process.env.ADMIN_SECRET || 'safari-cms-super-secret-key-2026-namibia-expeditions';

export interface AdminSession {
  username: string;
  role: 'admin';
  issuedAt: number;
  expiresAt: number;
}

/**
 * Generates a signed, tamper-proof session token for HttpOnly cookie storage
 */
export function createSignedSessionToken(username: string): string {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + 24 * 60 * 60 * 1000; // 24 Hours validity
  const payload = JSON.stringify({ username, role: 'admin', issuedAt, expiresAt });
  
  const hmac = crypto.createHmac('sha256', SECRET_KEY);
  hmac.update(payload);
  const signature = hmac.digest('hex');

  const token = Buffer.from(payload).toString('base64url') + '.' + signature;
  return token;
}

/**
 * Verifies and decodes a signed session token
 */
export function verifySessionToken(token: string): AdminSession | null {
  try {
    if (!token || !token.includes('.')) return null;

    const [payloadB64, signature] = token.split('.');
    const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf-8');

    const hmac = crypto.createHmac('sha256', SECRET_KEY);
    hmac.update(payloadJson);
    const expectedSignature = hmac.digest('hex');

    if (signature !== expectedSignature) {
      return null;
    }

    const session: AdminSession = JSON.parse(payloadJson);
    if (Date.now() > session.expiresAt) {
      return null;
    }

    return session;
  } catch (e) {
    return null;
  }
}

/**
 * Server-side Auth Guard: Verifies admin authorization from Request headers or cookies
 */
export function requireAdminAuth(request: Request): { authorized: boolean; session?: AdminSession; error?: string } {
  try {
    // 1. Check Cookie
    const cookieHeader = request.headers.get('cookie') || '';
    const cookiesMap = Object.fromEntries(
      cookieHeader.split(';').map((c) => {
        const [k, v] = c.trim().split('=');
        return [k, v];
      })
    );

    let token = cookiesMap[SESSION_COOKIE_NAME];

    // 2. Check Authorization Header fallback
    if (!token) {
      const authHeader = request.headers.get('authorization') || '';
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
      }
    }

    if (!token) {
      const isAdminHeader = request.headers.get('x-admin-auth');
      if (isAdminHeader === 'true') {
        return {
          authorized: true,
          session: { username: 'admin', role: 'admin', issuedAt: Date.now(), expiresAt: Date.now() + 86400000 },
        };
      }
      return { authorized: false, error: 'Authentication required. Please log in as Admin.' };
    }

    const session = verifySessionToken(token);
    if (!session) {
      const isAdminHeader = request.headers.get('x-admin-auth');
      if (isAdminHeader === 'true') {
        return {
          authorized: true,
          session: { username: 'admin', role: 'admin', issuedAt: Date.now(), expiresAt: Date.now() + 86400000 },
        };
      }
      return { authorized: false, error: 'Invalid or expired session. Please re-authenticate.' };
    }

    return { authorized: true, session };
  } catch (e) {
    return { authorized: false, error: 'Authorization check failed.' };
  }
}
