import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { CreateCategoryDto } from "../../api/categoryAPI/category";
import { Category } from "../../api/categoryAPI/types";
import {
  useChildCategories,
  useCreateCategory,
  useDeleteCategory,
} from "../../hooks/category/categoryHooks";

interface SubCategoryModalProps {
  open: boolean;
  onClose: () => void;
  category: Category;
}

export const SubCategoryModal = ({
  open,
  onClose,
  category,
}: SubCategoryModalProps) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const { mutate: createCategory, isPending } = useCreateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();
  const { data: childCategories } = useChildCategories();

  const childCategoriesForSelectedCategory = childCategories?.filter(
    (cat) => cat.parentCategoryId === category.id
  );

  const handleAddSubCategory = () => {
    if (newCategoryName.trim()) {
      const categoryData: CreateCategoryDto = {
        name: newCategoryName.trim(),
        parentCategoryId: category.id,
      };

      createCategory(categoryData, {
        onSuccess: () => {
          setNewCategoryName("");
        },
      });
    }
  };

  const handleDeleteSubCategory = (id: number) => {
    deleteCategory(id);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Manage Subcategories for {category.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3, mt: 2 }}>
          <Typography variant="h6">Current Subcategories</Typography>
          {childCategoriesForSelectedCategory &&
          childCategoriesForSelectedCategory?.length > 0 ? (
            <List>
              {childCategoriesForSelectedCategory.map((child) => (
                <ListItem key={child.id}>
                  <ListItemText primary={child.name} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteSubCategory(child.id)}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" sx={{ color: "red" }} />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No subcategories found
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>
          Add New Subcategory
        </Typography>

        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Subcategory Name"
          type="text"
          fullWidth
          variant="outlined"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          sx={{ mb: 2 }}
          placeholder={`Enter name for subcategory of ${category.name}`}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleAddSubCategory}
          variant="contained"
          color="primary"
          disabled={!newCategoryName.trim() || isPending}
        >
          Add Subcategory
        </Button>
      </DialogActions>
    </Dialog>
  );
};
