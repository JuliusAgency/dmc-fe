import { GridColDef, GridRenderEditCellParams } from "@mui/x-data-grid";
import { formatDate } from "../../utils/formatDate";
import { Classification, FileType } from "../../api/documentAPI/types";
import { GridEditSingleSelectCell } from "@mui/x-data-grid-pro";
import { useGetUsers } from "../../hooks/user/userHooks";
import { useMemo } from "react";
import { Chip } from "@mui/material";

export enum DocumentStatus {
  DRAFT = "DRAFT",
  IN_PROGRESS = "IN_PROGRESS",
  APPROVED = "APPROVED",
  ARCHIVED = "ARCHIVED",
}

export const useColumns = (): GridColDef[] => {
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
        return "warning";
      case DocumentStatus.IN_PROGRESS:
        return "info";
      case DocumentStatus.APPROVED:
        return "success";
      case DocumentStatus.ARCHIVED:
        return "default";
      default:
        return "default";
    }
  };

  const getClassificationColor = (classification: Classification) => {
    switch (classification) {
      case "PUBLIC":
        return "success";
      case "INTERNAL":
        return "info";
      case "CONFIDENTIAL":
        return "warning";
      case "SECRET":
        return "error";
      default:
        return "default";
    }
  };

  return [
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
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getClassificationColor(params.value)}
        />
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
      width: 150,
      editable: true,
      type: "singleSelect",
      valueOptions: userOptions.map((user: any) => user.name),
      renderEditCell: (params: GridRenderEditCellParams) => {
        return (
          <GridEditSingleSelectCell
            {...params}
            options={userOptions.map((user: any) => ({
              value: user.id,
              label: user.name,
            }))}
          />
        );
      },
      valueGetter: (params) => params.row.processOwner?.email || "N/A",
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
      renderCell: (params) => (
        <Chip label={params.value} color={getStatusColor(params.value)} />
      ),
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
};
