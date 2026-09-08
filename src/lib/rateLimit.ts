interface RateLimitStore {
  count: number;
  resetAt: number;
}

const rateLimitMap: Map<string, RateLimitStore> = new Map();

/**
 * IP-based sliding window rate limiter compatible with serverless/Node runtimes.
 * Returns { success: boolean, limit: number, remaining: number, resetInSeconds: number }
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 15 * 60 * 1000
) {
  const now = Date.now();
  const key = `${identifier}`;
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    const newRecord: RateLimitStore = {
      count: 1,
      resetAt: now + windowMs,
    };
    rateLimitMap.set(key, newRecord);
    return {
      success: true,
      limit,
      remaining: limit - 1,
      resetInSeconds: Math.ceil(windowMs / 1000),
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      resetInSeconds: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - record.count,
    resetInSeconds: Math.ceil((record.resetAt - now) / 1000),
  };
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}
