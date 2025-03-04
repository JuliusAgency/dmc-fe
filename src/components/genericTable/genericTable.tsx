import { useMemo } from "react";
import { DataGridPro } from "@mui/x-data-grid-pro";
import Box from "@mui/material/Box";
import { GenericTableProps } from "./types.ts";
import { GridRowParams } from "@mui/x-data-grid";

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
  getDetailPanelHeight,
  getDetailPanelContent,
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
    <Box sx={{ width: "90%", height: "70vh", ...sx }}>
      <DataGridPro
        onPaginationModelChange={handlePagination}
        loading={loading}
        rows={rows}
        columns={columns}
        paginationMode="server"
        rowCount={totalCount}
        pageSizeOptions={[5, 10, 25]}
        initialState={initialState}
        disableRowSelectionOnClick
        pagination
        hideFooterPagination={disableFooter}
        getDetailPanelHeight={
          getDetailPanelHeight
            ? (params: GridRowParams) => getDetailPanelHeight(params)
            : undefined
        }
        getDetailPanelContent={getDetailPanelContent}
        getRowId={(row) => row.id || Math.random()}
      />
    </Box>
  );
};
