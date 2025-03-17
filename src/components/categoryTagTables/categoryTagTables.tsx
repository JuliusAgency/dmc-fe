import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import { Category } from "../../api/categoryAPI/types";
import { Tag } from "../../api/tagsAPI/types";
import { GenericTable } from "../genericTable/genericTable";
import { SubCategoryModal } from "./SubCategoryModal";

export const CategoryTable = ({
  categories,
  loading,
  onDelete,
}: {
  categories: Category[];
  loading: boolean;
  onDelete: (id: number) => void;
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const handleOpenModal = (category: Category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCategory(null);
  };

  const categoryColumns: GridColDef[] = [
    { field: "name", headerName: "Category Name", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.3,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleOpenModal(params.row)}>
            <AddIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={() => onDelete(params.row.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <>
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

      {selectedCategory && (
        <SubCategoryModal
          open={modalOpen}
          onClose={handleCloseModal}
          category={selectedCategory}
        />
      )}
    </>
  );
};

export const TagTable = ({
  tags,
  loading,
  onDelete,
}: {
  tags: Tag[];
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
        <IconButton onClick={() => onDelete(params.row.id)} disabled={true}>
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
