export function safeJsonParse<T = any>(input: any, fallback: T): T {
  if (input === null || input === undefined) return fallback;
  if (typeof input !== 'string') return input as T;
  const trimmed = input.trim();
  if (!trimmed) return fallback;
  try {
    return JSON.parse(trimmed) as T;
  } catch (e) {
    try {
      // Extract valid JSON array or object substring if trailing text exists
      const match = trimmed.match(/^(\[[\s\S]*\]|\{[\s\S]*\})/);
      if (match) {
        return JSON.parse(match[1]) as T;
      }
    } catch (err) {}
    return fallback;
  }
}

export function safeParseList(input: any, fallbackDefault: any[] = []): any[] {
  if (!input) return fallbackDefault;
  if (Array.isArray(input)) return input;
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) return fallbackDefault;
    const parsed = safeJsonParse(trimmed, null);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === 'object') return [parsed];

    if (trimmed.includes('\n')) {
      return trimmed.split('\n').map((s) => s.trim()).filter(Boolean);
    }
    if (trimmed.includes(',')) {
      return trimmed.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return [trimmed];
  }
  return fallbackDefault;
}
