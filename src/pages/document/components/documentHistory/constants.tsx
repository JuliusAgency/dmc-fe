import { GridColDef } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { useTheme } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";

export const BUTTON_CLOSE = "Close";
export const ARCHIVED_DOCUMENTS = (documentPartNumber: string) =>
  `getArchivedDocuments-${documentPartNumber}`;

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
