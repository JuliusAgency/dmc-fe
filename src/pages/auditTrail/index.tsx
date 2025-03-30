import { useAuditTrails } from "../../hooks/auditTrail/auditTrailHook";
import { COLUMNS } from "./columns";
import { AuditTrail } from "./types";
import { GenericTable } from "../../components/genericTable/genericTable";
import { Box, CircularProgress, Typography } from "@mui/material";
import { ERROR_MESSAGE, PAGE_TITLE } from "./constants";

export const AuditTrailPage = () => {
  const { data: auditTrails = [], isLoading, error } = useAuditTrails();

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="400px"
      >
        <Typography color="error">{ERROR_MESSAGE}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        width: "100%",
        height: "70vh",
        overflow: "auto",
      }}
    >
      <Typography variant="h5" mb={2}>
        {PAGE_TITLE}
      </Typography>

      <Box sx={{ flex: 1 }}>
        <GenericTable
          rows={auditTrails}
          columns={COLUMNS}
          loading={isLoading}
          pageSize={10}
          rowCount={auditTrails.length}
          onPaginationModelChange={() => {}}
          sx={{
            width: "98%",
            height: "100%",
            border: "none",
            minWidth: "unset",
          }}
        />
      </Box>
    </Box>
  );
};
