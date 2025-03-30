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
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
  initialCategory: Category;
}

export const SubCategoryModal = ({
  open,
  onClose,
  initialCategory,
}: SubCategoryModalProps) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [currentCategory, setCurrentCategory] =
    useState<Category>(initialCategory);
  const [history, setHistory] = useState<Category[]>([]);

  const { mutate: createCategory, isPending } = useCreateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();
  const { data: childCategories } = useChildCategories();

  const childCategoriesForCurrentCategory = childCategories?.filter(
    (cat) => cat.parentCategoryId === currentCategory.id
  );

  const currentLevel = history.length + 1;
  const maxLevelReached = currentLevel >= 7;

  const handleAddSubCategory = () => {
    if (newCategoryName.trim()) {
      const categoryData: CreateCategoryDto = {
        name: newCategoryName.trim(),
        parentCategoryId: currentCategory.id,
      };

      createCategory(categoryData, {
        onSuccess: () => setNewCategoryName(""),
      });
    }
  };

  const handleNavigateToChild = (child: Category) => {
    setHistory([...history, currentCategory]);
    setCurrentCategory(child);
    setNewCategoryName("");
  };

  const handleNavigateBack = () => {
    if (history.length > 0) {
      const previousCategory = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentCategory(previousCategory);
      setNewCategoryName("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          {history.length > 0 && (
            <IconButton onClick={handleNavigateBack}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h6">
            Manage Subcategories for {currentCategory.name} (Level{" "}
            {currentLevel})
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3, mt: 2 }}>
          <Typography variant="h6">Current Subcategories</Typography>
          {childCategoriesForCurrentCategory?.length ? (
            <List>
              {childCategoriesForCurrentCategory.map((child) => (
                <ListItem key={child.id}>
                  <ListItemText primary={child.name} />
                  <ListItemSecondaryAction>
                    {!maxLevelReached && (
                      <IconButton
                        onClick={() => handleNavigateToChild(child)}
                        size="small"
                        color="primary"
                      >
                        <ArrowForwardIcon fontSize="small" />
                      </IconButton>
                    )}
                    <IconButton
                      edge="end"
                      onClick={() => deleteCategory(child.id)}
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

        {!maxLevelReached ? (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Add New Subcategory
            </Typography>
            <TextField
              autoFocus
              label="Subcategory Name"
              fullWidth
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder={`Enter name for subcategory of ${currentCategory.name}`}
            />
          </>
        ) : (
          <Typography variant="body2" color="error">
            Maximum subcategory depth (7 levels) reached. You cannot add more
            subcategories.
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {!maxLevelReached && (
          <Button
            onClick={handleAddSubCategory}
            variant="contained"
            disabled={!newCategoryName.trim() || isPending}
          >
            Add Subcategory
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
