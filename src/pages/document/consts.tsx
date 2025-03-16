import { GridColDef } from "@mui/x-data-grid";
import { formatDate } from "../../utils/formatDate";
import { Chip, Stack } from "@mui/material";
import { DocumentTag } from "../../api/documentAPI/types.ts";

export const COLUMNS: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    headerAlign: "center",
    align: "center",
    width: 100,
  },
  {
    field: "documentPartNumber",
    headerName: "Document Part Number",
    headerAlign: "center",
    align: "center",
    width: 200,
  },
  {
    field: "classification",
    headerName: "Classification",
    headerAlign: "center",
    align: "center",
    width: 110,
  },
  {
    field: "department",
    headerName: "Department",
    headerAlign: "center",
    align: "center",
    width: 100,
  },
  {
    field: "processOwner",
    headerName: "Process Owner",
    headerAlign: "center",
    align: "center",
    width: 120,
    valueGetter: (params) =>
      params.row.processOwner?.name || params.row.processOwner?.email || "N/A",
  },
  {
    field: "revision",
    headerName: "Revision",
    headerAlign: "center",
    align: "center",
    width: 100,
  },
  {
    field: "published",
    headerName: "Published",
    headerAlign: "center",
    align: "center",
    width: 100,
    valueGetter: (params) => (params.value ? formatDate(params.value) : ""),
  },
  {
    field: "id",
    headerName: "DCO Number",
    headerAlign: "center",
    align: "center",
    width: 110,
  },
  {
    field: "type",
    headerName: "Type",
    headerAlign: "center",
    align: "center",
    width: 100,
  },
  {
    field: "status",
    headerName: "Status",
    headerAlign: "center",
    align: "center",
    width: 100,
  },
  {
    field: "lastUpdate",
    headerName: "Last Update",
    headerAlign: "center",
    align: "center",
    width: 100,
    valueGetter: (params) => (params.value ? formatDate(params.value) : ""),
  },
  {
    field: "updatedBy",
    headerName: "Updated By",
    headerAlign: "center",
    align: "center",
    width: 100,
  },
  {
    field: "nextReview",
    headerName: "Next Review",
    headerAlign: "center",
    align: "center",
    width: 100,
    valueGetter: (params) => (params.value ? formatDate(params.value) : ""),
  },
  {
    field: "category",
    headerName: "Category",
    headerAlign: "center",
    align: "center",
    width: 90,
    valueGetter: (params) => params.value?.name ?? "N/A",
  },
];
