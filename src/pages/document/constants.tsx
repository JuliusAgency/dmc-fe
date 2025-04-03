import { Box, IconButton, Button, Tooltip } from "@mui/material";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import { useSelector } from "react-redux";
import { DocumentType } from "../../api/documentAPI/types.ts";
import { GridColDef } from "@mui/x-data-grid-pro";
import ReportIcon from "@mui/icons-material/Report";

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
    align: "center",
    flex: 2,
    sortable: false,
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
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexWrap="nowrap"
          width="100%"
          maxWidth="100%"
          overflow="hidden"
          gap={0.5}
        >
          <Box minWidth={20}>
            {canViewDownload && (
              <Tooltip title="View">
                <IconButton
                  onClick={() => handleViewFile(row.fileName)}
                  size="small"
                >
                  <VisibilityIcon fontSize="small" sx={{ color: "#42a5f5" }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Box minWidth={20}>
            {canViewDownload && (
              <Tooltip title="Download">
                <IconButton
                  onClick={() => handleDownloadFile(row.fileName)}
                  size="small"
                >
                  <DownloadForOfflineIcon
                    fontSize="small"
                    sx={{ color: "#66bb6a" }}
                  />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Box minWidth={20}>
            <Tooltip title="Edit">
              <IconButton onClick={() => handleEdit(row)} size="small">
                <EditIcon fontSize="small" sx={{ color: "#ffa726" }} />
              </IconButton>
            </Tooltip>
          </Box>

          <Box minWidth={20}>
            {(user.role === "ADMIN" || user.role === "SYSTEM_ADMIN") && (
              <Tooltip title="Delete">
                <IconButton onClick={() => handleDelete(row.id)} size="small">
                  <DeleteIcon fontSize="small" sx={{ color: "#ef5350" }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Box minWidth={20}>
            <Tooltip title="History">
              <IconButton
                onClick={() => handleShowHistory(row.documentPartNumber)}
                size="small"
              >
                <HistoryIcon fontSize="small" sx={{ color: "#ab47bc" }} />
              </IconButton>
            </Tooltip>
          </Box>

          <Box minWidth={30}>
            {status === "APPROVED" && (
              <Tooltip title="Report">
                <IconButton
                  onClick={() => handleReport(row)}
                  size="small"
                  sx={{
                    backgroundColor: reportColor,
                    color: "white",
                    "&:hover": { backgroundColor: hoverColor },
                    borderRadius: 1,
                    p: "4px",
                  }}
                >
                  <ReportIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      );
    },
  };
};
