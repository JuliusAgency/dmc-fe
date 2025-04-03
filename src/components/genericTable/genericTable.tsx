import { useCallback, useMemo } from "react";
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
  detailPanelExpandedRowIds = [],
  setDetailPanelExpandedRowIds,
  onTryExpandRow,
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

  const handleDetailPanelExpandedRowIdsChange = useCallback(
    async (newIds: GridRowId[]) => {
      const lastId = newIds[newIds.length - 1];

      if (onTryExpandRow) {
        const allow = await onTryExpandRow({ id: Number(lastId) });
        if (!allow) {
          setDetailPanelExpandedRowIds?.([]);
          return;
        }
      }

      setDetailPanelExpandedRowIds?.([lastId]);
    },
    [onTryExpandRow, setDetailPanelExpandedRowIds]
  );

  return (
    <Box sx={{ width: "100%", height: "100vh", ...sx }}>
      <DataGridPro
        onPaginationModelChange={onPaginationModelChange}
        loading={loading}
        rows={rows}
        columns={columns}
        paginationMode="server"
        rowCount={rowCount}
        pageSizeOptions={[5, 10, 15, 20]}
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
          width: "100%",
          mb: 2,
          overflow: "hidden",
          "& .MuiDataGrid-root": {
            border: "none",
            fontSize: "0.75rem",
          },

          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2px 4px",
            minWidth: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "0.7rem",
          },

          "& .MuiDataGrid-columnHeader": {
            padding: "2px 4px",
            minWidth: 0,
          },

          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
            color: theme.palette.primary.main,
            fontWeight: "bold",
            fontSize: "0.75rem",
          },

          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
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

          "& .MuiDataGrid-virtualScrollerContent": {
            width: "100% !important",
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
