import { GridColDef, GridRenderEditCellParams } from "@mui/x-data-grid";
import { formatDate } from "../../utils/formatDate";
import { Classification, FileType } from "../../api/documentAPI/types";
import { GridEditSingleSelectCell } from "@mui/x-data-grid-pro";

export const COLUMNS: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    headerAlign: "center",
    align: "center",
    width: 100,
    editable: true,
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
    editable: true,
    type: "singleSelect",
    valueOptions: Object.values(Classification),
    renderEditCell: (params: GridRenderEditCellParams) => (
      <GridEditSingleSelectCell {...params} />
    ),
  },
  {
    field: "department",
    headerName: "Department",
    headerAlign: "center",
    align: "center",
    width: 100,
    editable: true,
    type: "string",
    valueGetter: (params) => params.row.category?.name || "Not Assigned",
  },
  {
    field: "processOwner",
    headerName: "Process Owner",
    headerAlign: "center",
    align: "center",
    width: 120,
    editable: true,
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
    editable: true,
    type: "singleSelect",
    valueOptions: Object.values(FileType),
    renderEditCell: (params: GridRenderEditCellParams) => (
      <GridEditSingleSelectCell {...params} />
    ),
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
    editable: true,
    type: "date",
    valueGetter: (params) => (params.value ? formatDate(params.value) : ""),
  },
];
