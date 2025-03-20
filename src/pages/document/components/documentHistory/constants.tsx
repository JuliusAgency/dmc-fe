import { GridColDef } from "@mui/x-data-grid";
import { formatDate } from "../../../../utils/formatDate";
import { Box, Button } from "@mui/material";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { useTheme } from "@mui/material/styles";

export const BUTTON_CLOSE = "Close";
export const ARCHIVED_DOCUMENTS = (documentPartNumber: string) =>
  `getArchivedDocuments-${documentPartNumber}`;

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
    valueGetter: (params) => params.row.category?.name,
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
];

export const getActionColumn = (
  handleDownloadFile: (fileName: string) => void
) => {
  const theme = useTheme();

  return {
    field: "action",
    headerName: "Actions",
    headerAlign: "center",
    width: 150,
    align: "center",
    renderCell: ({ row }) => {
      return (
        <Box display={"flex"} gap={1}>
          <Button
            onClick={() => handleDownloadFile(row.fileName)}
            sx={{
              padding: 0,
              minWidth: 0,
              color: theme.palette.primary.main,
            }}
          >
            <DownloadForOfflineIcon />
          </Button>
        </Box>
      );
    },
  } as GridColDef;
};

export const SIGNATURES_COLUMN: GridColDef = {
  field: "signatures",
  headerName: "Signatures",
  headerAlign: "center",
  width: 300,
  align: "center",
  renderCell: ({ row }) => {
    if (!row.signatures || row.signatures.length === 0) return "No signatures";

    return (
      <Box display="flex" flexDirection="column">
        {row.signatures.map((sig: any) => (
          <Box key={sig.id}>
            {sig.user.email} - {new Date(sig.signedAt).toLocaleDateString()}
          </Box>
        ))}
      </Box>
    );
  },
};
