import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { GenericTable } from "../genericTable/genericTable";
import { GridColDef } from "@mui/x-data-grid";

export const CategoryTable = ({
  categories,
  loading,
  onDelete,
}: {
  categories: any[];
  loading: boolean;
  onDelete: (id: number) => void;
}) => {
  const categoryColumns: GridColDef[] = [
    { field: "name", headerName: "Category Name", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.3,
      renderCell: (params) => (
        <IconButton onClick={() => onDelete(params.row.id)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <GenericTable
      loading={loading}
      columns={categoryColumns}
      rows={categories}
      rowCount={categories.length}
      pageSize={10}
      onPaginationModelChange={() => {}}
      sx={{ height: "auto", mt: 2 }}
      hideFooterPagination={true}
    />
  );
};

export const TagTable = ({
  tags,
  loading,
  onDelete,
}: {
  tags: any[];
  loading: boolean;
  onDelete: (id: number) => void;
}) => {
  const tagColumns: GridColDef[] = [
    { field: "name", headerName: "Tag Name", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.3,
      renderCell: (params) => (
        <IconButton onClick={() => onDelete(params.row.id)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <GenericTable
      loading={loading}
      columns={tagColumns}
      rows={tags}
      rowCount={tags.length}
      pageSize={10}
      hideFooterPagination={true}
      onPaginationModelChange={() => {}}
      sx={{ height: "auto", mt: 2 }}
    />
  );
};
