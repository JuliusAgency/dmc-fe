import { GridColDef } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { useTheme } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";

export const BUTTON_CLOSE = "Close";
export const ARCHIVED_DOCUMENTS = (documentPartNumber: string) =>
  `getArchivedDocuments-${documentPartNumber}`;

export const DOCUMENT_HISTORY_TITLE = "Document History";

export const getActionColumn = (
  handleDownloadFile: (fileName: string) => void,
  handleViewFile: (fileName: string) => void
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
            <DownloadForOfflineIcon sx={{ color: "#66bb6a" }} />
          </Button>
          <Button
            onClick={() => handleViewFile(row.fileName)}
            sx={{
              padding: 0,
              minWidth: 0,
              color: theme.palette.primary.main,
            }}
          >
            <VisibilityIcon sx={{ color: "#42a5f5" }} />
          </Button>
        </Box>
      );
    },
  } as GridColDef;
};
