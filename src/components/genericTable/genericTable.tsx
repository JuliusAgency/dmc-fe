import { useMemo } from "react";
import { DataGridPro, GridCellParams } from "@mui/x-data-grid-pro";
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
  isJobStatusCellStyling  = false,
                               purchaseHistoryStyling=false
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
  const getGridCellClassName = (params: GridCellParams) => {
    //if column is 'jtStatus' and value is 'rejected' or 'approved' then add class to cell
    if (params.field === "jtStatus" && isJobStatusCellStyling) {
      if (params.row?.jtStatus?.id === 1) {
        return "approved";
      } else if (params.row?.jtStatus?.id === 2) {
        return "rejected";
      } else if (params.row?.jtStatus?.id === 3) {
        return "inHold";
      } else if (params.row?.jtStatus?.id === 4) {
        return "recruited";
      } else if (params.row?.jtStatus?.id === 5) {
        return "expired";
      } else if (params.row?.jtStatus?.id === 6) {
        return "accepted";
      } else if (params.row?.jtStatus?.id === 7) {
        return "recruitment_attempt";
      } else if (params.row?.jtStatus?.id === 8) {
        return "resume_sent"
      } else if (params.row?.jtStatus?.id === 9) {
        return "job_interview";
      } else if (params.row?.jtStatus?.id === 10) {
        return "candidate_accepted_to_job";
      }
    } else if(params.field === "isActive" && purchaseHistoryStyling){
      if(params.row?.isActive) {
        return 'active';
      }
      return 'inactive';
    }

    return "";
  };

  return (
    <Box sx={sx} borderColor={"red"}>
      <StyledComponent
        withBorder={false}
        onPaginationModelChange={handlePagination}
        loading={loading}
        rows={rows}
        hideFooterPagination={disableFooter}
        hideFooterSelectedRowCount={disableFooter}
        slots={{
          noRowsOverlay: () => (
            <div
              style={{
                textAlign: "center",
                alignContent: "center",
                height: "100%",
              }}
            >
              אין שורות
            </div>
          ),
        }}
        columns={columns}
        paginationMode={"server"}
        rowCount={totalCount}
        pagination={!loading}
        initialState={initialState}
        disableRowSelectionOnClick
        disableVirtualization={true}
        hideFooterRowCount={loading}
        getCellClassName={getGridCellClassName}
      />
    </Box>
  );
};
