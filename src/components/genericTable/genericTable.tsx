import { useMemo } from "react";
import { DataGridPro, } from "@mui/x-data-grid-pro";
import Box from "@mui/material/Box";
import { styled } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { GenericTableProps } from "./types.ts";



export const StyledDataGrid = styled(DataGridPro)(({ theme }) => ({
  borderRadius: "15px",
  "& .MuiDataGrid-cell": {
    color: theme.palette.primary.main,
  },
  "& .MuiDataGrid-virtualScroller": {
    minHeight: "100px",
  },
  "& .MuiDataGrid-columnHeaders": {
    borderTopLeftRadius: "15px",
    borderTopRightRadius: "15px",
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
  "& .MuiDataGrid-row.Mui-selected .MuiDataGrid-cell": {
    backgroundColor: alpha(theme.palette.secondary.light, 0.1),
  },
  "& .MuiPaginationItem-root": {
    color: theme.palette.primary.main,
  },
  "& .MuiDataGrid-footerContainer": {
    borderBottomLeftRadius: "15px",
    borderBottomRightRadius: "15px",
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
  "& .MuiTablePagination-root": {
    borderBottomLeftRadius: "15px",
    borderBottomRightRadius: "15px",
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
  "& .MuiDataGrid-cellCheckbox.MuiButtonBase-root": {
    color: theme.palette.primary.dark,
  },
  "& .MuiDataGrid-row": {
    "&:nth-of-type(odd)": {
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
    [initialPage, pageSize],
  );

  return (
    <Box sx={sx} borderColor={"red"}>
      <StyledComponent
        withBorder={false}
        onPaginationModelChange={handlePagination}
        loading={loading}
        rows={rows}
        hideFooterPagination={disableFooter}
        hideFooterSelectedRowCount={disableFooter}
        columns={columns}
        paginationMode={"server"}
        rowCount={totalCount}
        pagination={!loading}
        initialState={initialState}
        disableRowSelectionOnClick
        disableVirtualization={true}
        hideFooterRowCount={loading}
      />
    </Box>
  );
};
