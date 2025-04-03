import { Box, IconButton, Tooltip } from "@mui/material";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import HistoryIcon from "@mui/icons-material/History";
import ReportIcon from "@mui/icons-material/Report";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import { useSelector } from "react-redux";
import { DocumentType } from "../../api/documentAPI/types.ts";
import { GridColDef } from "@mui/x-data-grid-pro";

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
  handleReport: (document: DocumentType) => void,
  handleAddNote: (document: DocumentType) => void,
  handleViewNote: (document: DocumentType) => void
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
    cellClassName: "MuiDataGrid-cell--actions",
    flex: 0,
    minWidth: 360,
    maxWidth: 400,
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
          flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
          gap={0.5}
          sx={{
            overflow: "visible",
            whiteSpace: "normal",
            maxWidth: "100%",
          }}
        >
          {/* View */}
          <Box sx={{ width: 32, height: 32 }}>
            <Tooltip title="View">
              <IconButton
                onClick={() => handleViewFile(row.fileName)}
                size="small"
                sx={{ visibility: canViewDownload ? "visible" : "hidden" }}
              >
                <VisibilityIcon fontSize="small" sx={{ color: "#42a5f5" }} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Download */}
          <Box sx={{ width: 32, height: 32 }}>
            <Tooltip title="Download">
              <IconButton
                onClick={() => handleDownloadFile(row.fileName)}
                size="small"
                sx={{ visibility: canViewDownload ? "visible" : "hidden" }}
              >
                <DownloadForOfflineIcon
                  fontSize="small"
                  sx={{ color: "#66bb6a" }}
                />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Edit */}
          <Box sx={{ width: 32, height: 32 }}>
            <Tooltip title="Edit">
              <IconButton onClick={() => handleEdit(row)} size="small">
                <EditIcon fontSize="small" sx={{ color: "#ffa726" }} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Delete */}
          <Box sx={{ width: 32, height: 32 }}>
            <Tooltip title="Delete">
              <IconButton
                onClick={() => handleDelete(row.id)}
                size="small"
                sx={{
                  visibility:
                    user.role === "ADMIN" || user.role === "SYSTEM_ADMIN"
                      ? "visible"
                      : "hidden",
                }}
              >
                <DeleteIcon fontSize="small" sx={{ color: "#ef5350" }} />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ width: 32, height: 32 }}>
            <Tooltip title="History">
              <IconButton
                onClick={() => handleShowHistory(row.documentPartNumber)}
                size="small"
              >
                <HistoryIcon fontSize="small" sx={{ color: "#ab47bc" }} />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ width: 32, height: 32 }}>
            <Tooltip title="Report">
              <IconButton
                onClick={() => handleReport(row)}
                size="small"
                sx={{
                  visibility: status === "APPROVED" ? "visible" : "hidden",
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
          </Box>

          <Box sx={{ width: 32, height: 32 }}>
            <Tooltip title="Add Note">
              <IconButton
                onClick={() => handleAddNote(row)}
                size="small"
                sx={{
                  color: "#1976d2",
                  visibility: status === "APPROVED" ? "visible" : "hidden",
                }}
              >
                <NoteAddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ width: 32, height: 32 }}>
            <Tooltip title="View Notes">
              <IconButton
                onClick={() => handleViewNote(row)}
                size="small"
                sx={{
                  color: "#6d4c41",
                  visibility: row.note ? "visible" : "hidden",
                }}
              >
                <StickyNote2Icon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      );
    },
  };
};
