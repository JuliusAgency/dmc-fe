import { Button, Typography, Chip, Box } from "@mui/material";
import { REPORTS_TABLE_ACTION } from "./constants";
import { GridColDef } from "@mui/x-data-grid";
import { formatDate } from "../../utils/formatDate";

export const useReportColumns = (
  onClick: (reportId: number, currentAnswer?: string) => void
): GridColDef[] => [
  {
    field: "documentId",
    headerName: "Doc ID",
    flex: 1,
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => (
      <Box>
        <Typography variant="body2">{row.documentId}</Typography>
      </Box>
    ),
  },
  {
    field: "documentName",
    headerName: "Doc Name",
    flex: 1.5,
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => (
      <Box>
        <Typography variant="body2">{row.document?.name || "-"}</Typography>
      </Box>
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
          color="success"
          sx={{ whiteSpace: "pre-line", borderRadius: "6px" }}
        />
      ) : (
        <Chip
          label="Awaiting Response"
          color="warning"
          sx={{ borderRadius: "6px" }}
        />
      ),
  },
  {
    field: "actions",
    headerName: "Actions",
    flex: 1,
    headerAlign: "center",
    align: "center",
    renderCell: ({ row }) => (
      <Button
        variant="contained"
        color={row.response ? "success" : "warning"}
        onClick={() => onClick(row.id, row.response)}
      >
        {row.response ? "Edit Response" : REPORTS_TABLE_ACTION}
      </Button>
    ),
  },
];
