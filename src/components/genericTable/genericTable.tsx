import { useMemo } from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";
import Box from "@mui/material/Box";
import { styled } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { GenericTableProps } from "./types.ts";

import { GridColDef, GridRowParams } from "@mui/x-data-grid";

const StyledDataGrid = styled(DataGridPro)(({ theme }) => ({
  borderRadius: "12px",
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[2],
  "& .MuiDataGrid-columnHeaders": {
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 600,
  },
  "& .MuiDataGrid-cell": {
    color: theme.palette.text.primary,
    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
    transition: "background-color 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.light, 0.15),
    },
  },
  "& .MuiDataGrid-row.Mui-selected .MuiDataGrid-cell": {
    backgroundColor: alpha(theme.palette.secondary.light, 0.2),
  },
  "& .MuiDataGrid-footerContainer": {
    borderBottomLeftRadius: "12px",
    borderBottomRightRadius: "12px",
    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  "& .MuiDataGrid-row": {
    "&:nth-of-type(odd)": {
      backgroundColor: alpha(theme.palette.primary.light, 0.05),
    },
    transition: "background-color 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.light, 0.1),
    },
  },
}));

export const GenericTable = ({
  columns,
  rows,
  loading,
  handlePagination,
  totalCount,
  sx,
  pageSize = 25,
  initialPage = 0,
  disableFooter = false,
  StyledComponent = StyledDataGrid,
}: GenericTableProps) => {
  const initialState = useMemo(
    () => ({
      pagination: {
        paginationModel: {
          pageSize: pageSize,
          page: initialPage,
        },
      },
    }),
    [initialPage, pageSize]
  );

  return (
    <Box sx={sx}>
      <StyledComponent
        onPaginationModelChange={handlePagination}
        loading={loading}
        rows={rows}
        columns={columns}
        paginationMode="server"
        rowCount={totalCount}
        pageSizeOptions={[5, 10, 25]}
        initialState={initialState}
        disableRowSelectionOnClick
        disableVirtualization
        pagination
        disableFooter={disableFooter}
      />
    </Box>
  );
};
