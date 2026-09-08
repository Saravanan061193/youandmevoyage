import { getClientIp } from './rateLimit';

export interface AuditLogEntry {
  action: string;
  resource: string;
  resourceId?: string;
  adminUsername?: string;
  ip?: string;
  status: 'SUCCESS' | 'FAILED' | 'UNAUTHORIZED';
  details?: string;
  timestamp: string;
}

/**
 * Security Audit Logger for tracking administrative mutations and security events
 */
export function logAuditEvent(
  request: Request,
  action: string,
  resource: string,
  status: 'SUCCESS' | 'FAILED' | 'UNAUTHORIZED',
  details?: { resourceId?: string; adminUsername?: string; extra?: string }
) {
  const ip = getClientIp(request);
  const entry: AuditLogEntry = {
    action,
    resource,
    resourceId: details?.resourceId,
    adminUsername: details?.adminUsername || 'Admin',
    ip,
    status,
    details: details?.extra,
    timestamp: new Date().toISOString(),
  };

  // Log structured audit entry to stdout (stripped of secrets)
  console.log(`[SECURITY_AUDIT] [${entry.timestamp}] [${entry.status}] Action: ${entry.action} | Resource: ${entry.resource} | IP: ${entry.ip}`);
}
