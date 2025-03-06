import { useMemo } from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";
import Box from "@mui/material/Box";
import { GenericTableProps } from "./types.ts";
import { GridRowParams } from "@mui/x-data-grid";

export const GenericTable = ({
  columns,
  rows,
  loading,
  onPaginationModelChange,
  rowCount,
  sx,
  pageSize = 25,
  initialPage = 0,
  hideFooterPagination = false,
  getDetailPanelHeight,
  getDetailPanelContent,
  disableColumnMenu = false,
  disableColumnFilter = false,
  disableColumnSelector = false,
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
    <Box sx={{ width: "95%", height: "70vh", ...sx }}>
      <DataGridPro
        onPaginationModelChange={onPaginationModelChange}
        loading={loading}
        rows={rows}
        columns={columns}
        paginationMode="server"
        rowCount={rowCount}
        pageSizeOptions={[5, 10, 25]}
        initialState={initialState}
        disableRowSelectionOnClick
        pagination
        hideFooterPagination={hideFooterPagination}
        getDetailPanelHeight={
          getDetailPanelHeight
            ? (params: GridRowParams) => getDetailPanelHeight(params)
            : undefined
        }
        getDetailPanelContent={getDetailPanelContent}
        getRowId={(row) => row.id || Math.random()}
        disableColumnMenu={disableColumnMenu}
        disableColumnFilter={disableColumnFilter}
        disableColumnSelector={disableColumnSelector}
      />
    </Box>
  );
};
