import { useAuditTrails } from "../../hooks/auditTrail/auditTrailHook";
import { COLUMNS } from "./columns";
import { GenericTable } from "../../components/genericTable/genericTable";
import { Box, CircularProgress, Typography } from "@mui/material";
import { ERROR_MESSAGE, PAGE_TITLE } from "./constants";
import { PaginationModel } from "../../consts/types";
import { useState } from "react";

export const AuditTrailPage = () => {
  const { data: auditTrails = [], isLoading, error } = useAuditTrails();
  const [pagination, setPagination] = useState<PaginationModel>({
    page: 0,
    pageSize: 15,
  });

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
          rowCount={auditTrails.length}
          pageSize={pagination.pageSize}
          onPaginationModelChange={setPagination}
          getDetailPanelHeight={() => 200}
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
