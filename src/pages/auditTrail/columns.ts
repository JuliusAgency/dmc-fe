import { GridColDef } from "@mui/x-data-grid";
import { AuditTrail } from "./types";
import {
  AuditAction,
  AUDIT_ACTION_LABELS,
} from "../../api/auditTrailAPI.ts/types";
import { formatDate } from "../../utils/formatDate";

export const COLUMNS: GridColDef<AuditTrail>[] = [
  {
    field: "timestamp",
    headerName: " date",
    flex: 1,
    headerAlign: "center",
    align: "center",
    valueGetter: (params: any) => formatDate(params),
  },
  {
    field: "user",
    headerName: "User",
    flex: 1,
    headerAlign: "center",
    align: "center",
    valueGetter: (params: any) => params?.email || "-",
  },
  {
    field: "action",
    headerName: "Action",
    flex: 1,
    headerAlign: "center",
    align: "center",
    valueFormatter: (params) => {
      const action = params as AuditAction;
      return AUDIT_ACTION_LABELS[action] || action;
    },
  },
  {
    field: "document",
    headerName: "Document",
    flex: 1,
    headerAlign: "center",
    align: "center",
    valueGetter: (params: any) => params?.name || "-",
  },
  {
    field: "description",
    headerName: "Description",
    flex: 2,
    headerAlign: "center",
    align: "center",
  },
];
