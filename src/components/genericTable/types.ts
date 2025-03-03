import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { GridPaginationModel } from "@mui/x-data-grid-pro";
import { SxProps } from "@mui/material";
import { Theme } from "@mui/material/styles";

export interface GenericTableProps {
  columns: GridColDef[];
  rows: any[];
  toolBar?: any;
  loading: boolean;
  totalCount: number;
  sx?: SxProps<Theme> | undefined;
  handlePagination: (model: GridPaginationModel) => void;
  StyledComponent?: any;
  pageSize?: number;
  initialPage?: number;
  disableFooter?: boolean;
  getDetailPanelHeight?: (params: GridRowParams) => number | 'auto'
  getDetailPanelContent?: ({ row }: GridRowParams) => JSX.Element
}
