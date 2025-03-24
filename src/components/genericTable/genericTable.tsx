import { useCallback, useMemo, useState } from "react";
import {
  DataGridPro,
  GridRowId,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid-pro";
import Box from "@mui/material/Box";
import { GenericTableProps } from "./types.ts";
import { GridRowParams } from "@mui/x-data-grid";
import { useTheme, alpha } from "@mui/material";

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
  processRowUpdate,
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

  const theme = useTheme();

  const [detailPanelExpandedRowIds, setDetailPanelExpandedRowIds] = useState<
    GridRowId[]
  >([]);

  const handleDetailPanelExpandedRowIdsChange = useCallback(
    (newIds: GridRowId[]) => {
      setDetailPanelExpandedRowIds([newIds[newIds.length - 1]]);
    },
    []
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
        processRowUpdate={processRowUpdate}
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
        detailPanelExpandedRowIds={detailPanelExpandedRowIds}
        onDetailPanelExpandedRowIdsChange={
          handleDetailPanelExpandedRowIdsChange
        }
        sx={{
          height: "100%",
          mb: 2,
          width: "100%",
          "& .MuiDataGrid-root": {
            border: "none",
            fontSize: "0.75rem",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
            padding: "2px 4px",
            lineHeight: "1.1",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            color: theme.palette.primary.main,
            fontWeight: "bold",
            fontSize: "0.75rem",
          },
          "& .MuiDataGrid-columnHeader": {
            padding: "2px 4px",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
          },
          "& .MuiDataGrid-row:nth-of-type(even)": {
            backgroundColor: alpha(theme.palette.background.default, 0.4),
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: alpha(theme.palette.primary.light, 0.1),
          },
          "& .actionColumn": {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: `1px solid ${theme.palette.divider}`,
          },
          "& .MuiTablePagination-root": {
            fontSize: "0.75rem",
          },
        }}
        slots={{
          toolbar: () => (
            <GridToolbarContainer>
              <GridToolbarExport
                csvOptions={{
                  delimiter: ",",
                  fileName: "exported-data",
                  utf8WithBom: true,
                }}
                printOptions={{ disableToolbarButton: true }}
              />
            </GridToolbarContainer>
          ),
        }}
      />
    </Box>
  );
};
