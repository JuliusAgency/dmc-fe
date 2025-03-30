export enum AuditAction {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  CREATE_DOCUMENT = "CREATE_DOCUMENT",
  DOWNLOAD_DOCUMENT = "DOWNLOAD_DOCUMENT",
  DELETE_DOCUMENT = "DELETE_DOCUMENT",
  UPDATE_DOCUMENT = "UPDATE_DOCUMENT",
  SIGN_DOCUMENT = "SIGN_DOCUMENT",
}

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  [AuditAction.LOGIN]: "User Logged In",
  [AuditAction.LOGOUT]: "User Logged Out",
  [AuditAction.CREATE_DOCUMENT]: "Created Document",
  [AuditAction.DOWNLOAD_DOCUMENT]: "Downloaded Document",
  [AuditAction.DELETE_DOCUMENT]: "Deleted Document",
  [AuditAction.UPDATE_DOCUMENT]: "Updated Document",
  [AuditAction.SIGN_DOCUMENT]: "Signed Document",
};
