export const AuditTrailEndpoints = {
  getAuditTrails: "/audit-trail",
  logAction: "/audit-trail/log",
  deleteAuditTrail: (id: number) => `/audit-trail/${id}`,
};
