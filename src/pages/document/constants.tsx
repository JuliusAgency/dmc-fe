import { GridColDef } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import { useSelector } from "react-redux";
import { DocumentType } from "../../api/documentAPI/types.ts";

const hasClassificationAccess = (
  userLevel: string,
  docLevel: string
): boolean => {
  const levels = ["PUBLIC", "INTERNAL", "CONFIDENTIAL", "SECRET"];
  return levels.indexOf(userLevel) >= levels.indexOf(docLevel);
};

export const getActionColumn = (
  handleDownloadFile: (fileName: string) => void,
  handleViewFile: (fileName: string) => void,
  handleEdit: (document: DocumentType) => void,
  handleDelete: (documentId: number) => void,
  handleShowHistory: (documentPartNumber: string) => void,
  handleReport: (document: DocumentType) => void
): GridColDef => {
  const storedUser = localStorage.getItem("user");
  const user =
    useSelector((state: any) => state.user.user) ||
    (storedUser ? JSON.parse(storedUser) : null);

  return {
    field: "action",
    headerName: "Actions",
    headerAlign: "center",
    width: 300,
    align: "center",
    renderCell: ({ row }) => {
      const hasReports = row.reports?.length > 0;
      const allAnswered = row.reports?.every((r: any) => !!r.response);
      const status = row.status;

      const userClassification = user?.classification || "PUBLIC";
      const docClassification = row.classification || "PUBLIC";

      const canViewDownload = hasClassificationAccess(
        userClassification,
        docClassification
      );

      let reportColor = "#ef5350";
      if (hasReports && allAnswered) reportColor = "#66bb6a";
      else if (hasReports && !allAnswered) reportColor = "#ffa726";

      let hoverColor = "#e53935";
      if (hasReports && allAnswered) hoverColor = "#4caf50";
      else if (hasReports && !allAnswered) hoverColor = "#fb8c00";

      return (
        <Box display="flex" gap={1} justifyContent="center" width="100%">
          <Box minWidth={32}>
            {canViewDownload && (
              <Button
                onClick={() => handleViewFile(row.fileName)}
                sx={{ padding: 0, minWidth: 0 }}
              >
                <VisibilityIcon sx={{ color: "#42a5f5" }} />
              </Button>
            )}
          </Box>

          <Box minWidth={32}>
            {canViewDownload && (
              <Button
                onClick={() => handleDownloadFile(row.fileName)}
                sx={{ padding: 0, minWidth: 0 }}
              >
                <DownloadForOfflineIcon sx={{ color: "#66bb6a" }} />
              </Button>
            )}
          </Box>

          <Box minWidth={32}>
            <Button
              onClick={() => handleEdit(row)}
              sx={{ padding: 0, minWidth: 0 }}
            >
              <EditIcon sx={{ color: "#ffa726" }} />
            </Button>
          </Box>

          <Box minWidth={32}>
            {(user.role === "ADMIN" || user.role === "SYSTEM_ADMIN") && (
              <Button
                onClick={() => handleDelete(row.id)}
                sx={{ padding: 0, minWidth: 0 }}
              >
                <DeleteIcon sx={{ color: "#ef5350" }} />
              </Button>
            )}
          </Box>

          <Box minWidth={32}>
            <Button
              onClick={() => handleShowHistory(row.documentPartNumber)}
              sx={{ padding: 0, minWidth: 0 }}
            >
              <HistoryIcon sx={{ color: "#ab47bc" }} />
            </Button>
          </Box>

          <Box minWidth={80}>
            {status === "APPROVED" && (
              <Button
                onClick={() => handleReport(row)}
                variant="contained"
                sx={{
                  minWidth: "80px",
                  textTransform: "none",
                  backgroundColor: reportColor,
                  color: "white",
                  "&:hover": {
                    backgroundColor: hoverColor,
                  },
                }}
              >
                Report
              </Button>
            )}
          </Box>
        </Box>
      );
    },
  };
};
