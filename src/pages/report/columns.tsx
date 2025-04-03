import {
  Button,
  Typography,
  Chip,
  Box,
  IconButton,
  Stack,
} from "@mui/material";
import { REPORTS_TABLE_ACTION, REPORTS_DELETE_LABEL } from "./constants";
import { GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDate } from "../../utils/formatDate";

export const useReportColumns = (
  currentUserId: number | null,
  onClick: (reportId: number, currentAnswer?: string) => void,
  onDelete: (reportId: number) => void
): GridColDef[] => [
  {
    field: "documentId",
    headerName: "Doc ID",
    flex: 1,
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => (
      <Typography variant="body2">{row.documentId}</Typography>
    ),
  },
  {
    field: "documentName",
    headerName: "Doc Name",
    flex: 1.5,
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => (
      <Typography variant="body2">{row.document?.name || "-"}</Typography>
    ),
  },
  {
    field: "revision",
    headerName: "Revision",
    flex: 0.5,
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => (
      <Typography variant="body2">{row.revision ?? "-"}</Typography>
    ),
  },
  {
    field: "reporterName",
    headerName: "Reporter",
    flex: 1,
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => (
      <Typography variant="body2">{row.reporterName}</Typography>
    ),
  },
  {
    field: "reportedAt",
    headerName: "Reported At",
    flex: 1,
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => (
      <Typography variant="body2">{formatDate(row.reportedAt)}</Typography>
    ),
  },
  {
    field: "message",
    headerName: "Message",
    flex: 2,
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => (
      <Typography
        variant="body2"
        sx={{ whiteSpace: "pre-line", wordBreak: "break-word" }}
      >
        {row.message}
      </Typography>
    ),
  },
  {
    field: "response",
    headerName: "Response",
    flex: 2,
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) =>
      row.response ? (
        <Chip
          label={row.response}
          sx={{
            backgroundColor: "#66bb6a",
            color: "white",
            borderRadius: "6px",
            fontWeight: "bold",
            whiteSpace: "pre-line",
          }}
        />
      ) : (
        <Chip
          label="Awaiting Response"
          sx={{
            backgroundColor: "#ffa726",
            color: "white",
            borderRadius: "6px",
            fontWeight: "bold",
          }}
        />
      ),
  },
  {
    field: "actions",
    headerName: "Actions",
    flex: 1,
    headerAlign: "center",
    align: "center",
    sortable: false,
    renderCell: ({ row }) => {
      const isProcessOwner = row.document?.processOwnerId === currentUserId;

      return (
        <Stack direction="row" spacing={1} alignItems="center">
          {isProcessOwner && (
            <Button
              onClick={() => onClick(row.id, row.response)}
              variant="contained"
              sx={{
                textTransform: "none",
                borderRadius: "6px",
                backgroundColor: row.response ? "#66bb6a" : "#ffa726",
                color: "white",
                "&:hover": {
                  backgroundColor: row.response ? "#4caf50" : "#fb8c00",
                },
              }}
            >
              {row.response ? "Edit Response" : REPORTS_TABLE_ACTION}
            </Button>
          )}
          <IconButton onClick={() => onDelete(row.id)} color="error">
            <DeleteIcon fontSize="small" sx={{ color: "#ef5350" }} />
          </IconButton>
        </Stack>
      );
    },
  },
];
