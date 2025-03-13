import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { CreateCategoryDto } from "../../api/categoryAPI/category";
import { Category } from "../../api/categoryAPI/types";
import { useCreateCategory } from "../../hooks/category/categoryHooks";

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

  const handleAddSubCategory = () => {
    if (newCategoryName.trim()) {
      const categoryData: CreateCategoryDto = {
        name: newCategoryName.trim(),
        parentCategoryId: category.id,
      };

      createCategory(categoryData, {
        onSuccess: () => {
          setNewCategoryName("");
          onClose();
        },
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Manage Subcategories for {category.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3, mt: 2 }}>
          <Typography variant="h6">Current Subcategories</Typography>
          {category.childCategories && category.childCategories.length > 0 ? (
            <List>
              {category.childCategories.map((child) => (
                <ListItem key={child.id}>
                  <ListItemText primary={child.name} />
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
