export interface AuditTrail {
  id: string;
  timestamp: string;
  action: string;
  description?: string;
  user: { email: string };
  document?: { name: string };
}
