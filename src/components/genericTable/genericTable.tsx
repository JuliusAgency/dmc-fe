import { useCallback, useMemo } from "react";
import {
  DataGridPro,
  GridRowId,
  GridToolbarContainer,
} from "@mui/x-data-grid-pro";
import Box from "@mui/material/Box";
import { GenericTableProps } from "./types.ts";
import { GridRowParams } from "@mui/x-data-grid";
import { useTheme, alpha, Button } from "@mui/material";
import * as XLSX from "xlsx";

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
  fileName = "",
}: GenericTableProps) => {
  const theme = useTheme();

  const initialState = useMemo(
    () => ({
      pagination: {
        paginationModel: {
          pageSize,
          page: initialPage,
        },
      },
    }),
    [initialPage, pageSize]
  );

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

  const handleExportToExcel = () => {
    const wb = XLSX.utils.book_new();

    const headerRow = [[fileName]];
    const columnHeaders = columns.map((col) => col.headerName || col.field);
    const dataRows = rows.map((row) =>
      columns.map((col) => {
        const value = row[col.field as keyof typeof row];
        return value ?? "";
      })
    );

    const sheetData = [...headerRow, [], columnHeaders, ...dataRows];

    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

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
              <Button onClick={handleExportToExcel} size="small">
                Export to Excel
              </Button>
            </GridToolbarContainer>
          ),
        }}
      />
    </Box>
  );
};
