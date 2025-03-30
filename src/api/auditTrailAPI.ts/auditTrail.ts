import { API } from "../API";
import { AuditTrailEndpoints } from "./constants";

export const fetchAuditTrails = async () => {
  const { data } = await API.get(AuditTrailEndpoints.getAuditTrails);
  return data;
};

export const logAuditAction = async ({
  userId,
  action,
  documentId,
  description,
}: {
  userId: number;
  action: string;
  documentId?: number;
  description?: string;
}) => {
  const { data } = await API.post(AuditTrailEndpoints.logAction, {
    userId,
    action,
    documentId,
    description,
  });
  return data;
};
