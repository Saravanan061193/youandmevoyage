/**
 * Server-side HTML/XSS Sanitizer Utility
 * Strip potentially dangerous HTML tags and script injections from user-supplied input strings.
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return '';

  const trimmed = input.trim();

  // Preserve Data URLs (e.g. data:image/png;base64,... or data:image/svg+xml...) and font Data URLs
  if (trimmed.startsWith('data:image/') || trimmed.startsWith('data:font/')) {
    if (trimmed.toLowerCase().includes('<script') || trimmed.toLowerCase().includes('javascript:')) {
      return '';
    }
    return trimmed;
  }

  // Preserve valid external/internal URLs (e.g. http://, https://, /)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    if (trimmed.toLowerCase().startsWith('javascript:')) return '';
    return trimmed;
  }

  return trimmed
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:[^\s'"]*/gi, '')
    .trim();
}

/**
 * Sanitize deep object properties recursively to prevent XSS injection in CMS payloads
 */
export function sanitizeObject<T>(obj: T): T {
  if (typeof obj === 'string') {
    return sanitizeString(obj) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as unknown as T;
  }

  if (obj !== null && typeof obj === 'object') {
    const sanitized: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized as T;
  }

  return obj;
}
