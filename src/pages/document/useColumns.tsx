import { GridColDef, GridRenderEditCellParams } from "@mui/x-data-grid";
import { formatDate } from "../../utils/formatDate";
import { Classification, FileType } from "../../api/documentAPI/types";
import { GridEditSingleSelectCell } from "@mui/x-data-grid-pro";
import { useGetUsers } from "../../hooks/user/userHooks";
import { useMemo } from "react";
import { Chip, Button, Typography } from "@mui/material";
import { DocumentType } from "../../api/documentAPI/types";
import { DocumentTypeDisplayNameMap } from "./components/addDocument/constants";

export enum DocumentStatus {
  DRAFT = "DRAFT",
  IN_PROGRESS = "IN_PROGRESS",
  APPROVED = "APPROVED",
  ARCHIVED = "ARCHIVED",
}

const cellStyle = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  fontSize: "0.75rem",
};

export const DOC_TYPE_OPTIONS = Object.values(DocumentTypeDisplayNameMap).map(
  (value) => ({
    value,
    label: value
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase()),
  })
);

export const useColumns = (
  onOpenSignatures: (doc: DocumentType) => void
): GridColDef[] => {
  const { data: users } = useGetUsers();

  const userOptions = useMemo(() => {
    if (!users || users.length === 0) return [];
    return users.map((user: any) => ({
      id: user.id,
      name: user.email,
    }));
  }, [users]);

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.DRAFT:
        return "#ffa726";
      case DocumentStatus.IN_PROGRESS:
        return "#42a5f5";
      case DocumentStatus.APPROVED:
        return "#66bb6a";
      case DocumentStatus.ARCHIVED:
        return "#bdbdbd";
      default:
        return "#e0e0e0";
    }
  };

  const getClassificationColor = (classification: Classification) => {
    switch (classification) {
      case "PUBLIC":
        return "#66bb6a";
      case "INTERNAL":
        return "#42a5f5";
      case "CONFIDENTIAL":
        return "#ffa726";
      case "SECRET":
        return "#ef5350";
      default:
        return "#e0e0e0";
    }
  };

  return [
    {
      field: "name",
      headerName: "Name",
      headerAlign: "center",
      align: "center",
      flex: 1.2,
      minWidth: 100,
      editable: true,
      renderCell: (params) => (
        <Typography sx={cellStyle}>{params.value}</Typography>
      ),
    },
    {
      field: "documentPartNumber",
      headerName: "Document P.N",
      headerAlign: "center",
      align: "center",
      flex: 1.5,
      minWidth: 130,
      renderCell: (params) => (
        <Typography sx={cellStyle}>{params.value}</Typography>
      ),
    },
    {
      field: "classification",
      headerName: "Classification",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 110,
      editable: true,
      type: "singleSelect",
      valueOptions: Object.values(Classification),
      renderEditCell: (params: GridRenderEditCellParams) => (
        <GridEditSingleSelectCell {...params} />
      ),
      renderCell: (params) => (
        <Chip
          label={params.value}
          sx={{
            backgroundColor: getClassificationColor(params.value),
            color: "white",
            fontSize: "0.7rem",
            height: 24,
          }}
        />
      ),
    },
    {
      field: "docType",
      headerName: "Doc Type",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 120,
      editable: true,
      type: "singleSelect",
      valueOptions: Object.keys(DocumentTypeDisplayNameMap),
      renderEditCell: (params: GridRenderEditCellParams) => (
        <GridEditSingleSelectCell {...params} />
      ),
      valueFormatter: (params: any) =>
        DocumentTypeDisplayNameMap[params.value] || params.value,
      renderCell: (params: any) => (
        <Typography sx={cellStyle}>
          {DocumentTypeDisplayNameMap[params.value] || params.value}
        </Typography>
      ),
    },
    {
      field: "processOwnerId",
      headerName: "Process Owner",
      headerAlign: "center",
      align: "center",
      flex: 1.5,
      minWidth: 150,
      editable: true,
      type: "singleSelect",
      valueOptions: userOptions.map((u) => ({
        value: u.id,
        label: u.name,
      })),
      renderEditCell: (params: GridRenderEditCellParams) => (
        <GridEditSingleSelectCell {...params} />
      ),
      valueFormatter: (params: any) => {
        const user = userOptions.find((u) => u.id === params);
        return user?.name || "N/A";
      },
    },
    {
      field: "revision",
      headerName: "Revision",
      headerAlign: "center",
      align: "center",
      flex: 0.7,
      minWidth: 70,
      editable: true,
    },
    {
      field: "published",
      headerName: "Published",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      valueGetter: (params) => formatDate(params),
    },
    {
      field: "id",
      headerName: "DCO Number",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Button
          variant="text"
          size="small"
          onClick={() => onOpenSignatures(params.row)}
          sx={{ fontSize: "0.7rem", textTransform: "none" }}
        >
          {params.value}
        </Button>
      ),
    },
    {
      field: "type",
      headerName: "Type",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
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
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <Chip
          label={params.value}
          sx={{
            backgroundColor: getStatusColor(params.value),
            color: "white",
            fontSize: "0.7rem",
            height: 24,
          }}
        />
      ),
    },
    {
      field: "lastUpdate",
      headerName: "Last Update",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
      valueGetter: (params) => formatDate(params),
    },
    {
      field: "updatedBy",
      headerName: "Updated By",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "nextReview",
      headerName: "Next Review",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 120,
      editable: true,
      type: "date",
      valueGetter: (params) => formatDate(params),
      valueFormatter: (params) => formatDate(params),
    },
  ];
};
