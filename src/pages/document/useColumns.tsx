import { GridColDef, GridRenderEditCellParams } from "@mui/x-data-grid";
import { formatDate } from "../../utils/formatDate";
import { Classification, FileType } from "../../api/documentAPI/types";
import { GridEditSingleSelectCell } from "@mui/x-data-grid-pro";
import { useGetUsers } from "../../hooks/user/userHooks";
import { useMemo } from "react";
import { Chip, Button } from "@mui/material";
import { DocumentType } from "../../api/documentAPI/types";

export enum DocumentStatus {
  DRAFT = "DRAFT",
  IN_PROGRESS = "IN_PROGRESS",
  APPROVED = "APPROVED",
  ARCHIVED = "ARCHIVED",
}

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
      editable: true,
    },
    {
      field: "documentPartNumber",
      headerName: "Document PNumber",
      headerAlign: "center",
      align: "center",
      flex: 1.5,
    },
    {
      field: "classification",
      headerName: "Classification",
      headerAlign: "center",
      align: "center",
      flex: 1,
      editable: true,
      type: "singleSelect",
      valueOptions: Object.values(Classification),
      renderEditCell: (params: GridRenderEditCellParams) => (
        <GridEditSingleSelectCell {...params} />
      ),
      renderCell: (params: any) => (
        <Chip
          label={params?.value}
          sx={{
            backgroundColor: getClassificationColor(params?.value),
            color: "white",
            fontWeight: "bold",
          }}
        />
      ),
    },
    {
      field: "category",
      headerName: "Department",
      headerAlign: "center",
      align: "center",
      flex: 1,
      editable: true,
      type: "string",
      valueGetter: (params: any) => {
        return params?.value?.name ?? "Not Assigned";
      },
    },
    {
      field: "processOwnerId",
      headerName: "Process Owner",
      headerAlign: "center",
      align: "center",
      flex: 1.5,
      editable: true,
      type: "singleSelect",
      valueOptions: userOptions.map((user: any) => ({
        value: user.id,
        label: user.name,
      })),
      renderEditCell: (params: GridRenderEditCellParams) => (
        <GridEditSingleSelectCell
          {...params}
          options={userOptions.map((user: any) => ({
            value: user.id,
            label: user.name,
          }))}
        />
      ),

      valueGetter: (params: any) => params,

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
      editable: true,
    },
    {
      field: "published",
      headerName: "Published",
      headerAlign: "center",
      align: "center",
      flex: 1,
      valueGetter: (params: any) => formatDate(params),
    },
    {
      field: "id",
      headerName: "DCO Number",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => (
        <Button variant="text" onClick={() => onOpenSignatures(params.row)}>
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
      renderCell: (params) => (
        <Chip
          label={params.value}
          sx={{
            backgroundColor: getStatusColor(params.value),
            color: "white",
            fontWeight: "bold",
            borderRadius: "6px",
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
      valueGetter: (params: any) => formatDate(params),
    },
    {
      field: "updatedBy",
      headerName: "Updated By",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "nextReview",
      headerName: "Next Review",
      headerAlign: "center",
      align: "center",
      flex: 1,
      editable: true,
      type: "date",
      valueGetter: (params: any) => formatDate(params),
      valueFormatter: (params: any) => formatDate(params),
    },
  ];
};
