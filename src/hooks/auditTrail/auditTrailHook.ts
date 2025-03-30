import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  fetchAuditTrails,
  logAuditAction,
} from "../../api/auditTrailAPI.ts/auditTrail";
import { snackBarError, snackBarSuccess } from "../../components/toast/Toast";
import {
  AUDIT_TRAIL_FETCH_ERROR,
  AUDIT_TRAIL_LOG_SUCCESS,
  AUDIT_TRAIL_LOG_ERROR,
} from "./constants";

export const useAuditTrails = () => {
  return useQuery("auditTrails", fetchAuditTrails, {
    onError: () => snackBarError(AUDIT_TRAIL_FETCH_ERROR),
  });
};

export const useLogAuditAction = () => {
  const queryClient = useQueryClient();

  return useMutation(logAuditAction, {
    onSuccess: () => {
      snackBarSuccess(AUDIT_TRAIL_LOG_SUCCESS);
      queryClient.invalidateQueries("auditTrails");
    },
    onError: () => {
      snackBarError(AUDIT_TRAIL_LOG_ERROR);
    },
  });
};
