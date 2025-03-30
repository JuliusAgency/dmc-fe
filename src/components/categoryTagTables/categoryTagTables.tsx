import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { IconButton, TextField } from "@mui/material";
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
        hideFooterPagination
        onPaginationModelChange={() => {}}
        sx={{ height: "auto", mt: 2 }}
      />
      {selectedCategory && (
        <SubCategoryModal
          open={modalOpen}
          onClose={handleCloseModal}
          initialCategory={selectedCategory}
        />
      )}
    </>
  );
};

export const TagTable = ({
  tags,
  loading,
  onDelete,
  onEdit,
}: {
  tags: Tag[];
  loading: boolean;
  onDelete: (id: number) => void;
  onEdit: (id: number, name: string) => void;
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleStartEdit = (id: number, currentName: string) => {
    setEditingId(id);
    setEditValue(currentName);
  };

  const handleSave = (id: number) => {
    onEdit(id, editValue);
    setEditingId(null);
    setEditValue("");
  };

  const tagColumns: GridColDef[] = [
    {
      field: "name",
      headerName: "Tag Name",
      flex: 1,
      renderCell: (params) =>
        editingId === params.row.id ? (
          <TextField
            size="small"
            value={editValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEditValue(e.target.value)
            }
            autoFocus
            fullWidth
          />
        ) : (
          params.row.name
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.3,
      renderCell: (params) => (
        <>
          {editingId === params.row.id ? (
            <IconButton onClick={() => handleSave(params.row.id)}>
              <SaveIcon fontSize="small" />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => handleStartEdit(params.row.id, params.row.name)}
            >
              <EditIcon fontSize="small" sx={{ color: "#ffa726" }} />
            </IconButton>
          )}
          <IconButton onClick={() => onDelete(params.row.id)}>
            <DeleteIcon fontSize="small" sx={{ color: "#ef5350" }} />
          </IconButton>
        </>
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
