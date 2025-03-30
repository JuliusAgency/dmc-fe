import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useChildCategories,
  useGetCategoryById,
} from "../../hooks/category/categoryHooks";
import FolderIcon from "@mui/icons-material/Folder";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useEffect, useState } from "react";
import { Document } from "../document";
import {
  CATEGORY_LOADING_TEXT,
  CATEGORY_CARD_STYLES,
  CATEGORY_CARD_CONTENT_STYLES,
  CATEGORY_TITLE_COLOR,
} from "./constants";

export const CategoryLevelPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentId, setCurrentId] = useState<number | null>(null);

  const pathSegments = location.pathname
    .replace("/category/", "")
    .split("/")
    .filter(Boolean);
  const currentLevel = pathSegments.length;

  useEffect(() => {
    const id = pathSegments[pathSegments.length - 1];
    setCurrentId(id ? Number(id) : null);
  }, [location.pathname]);

  const { data: categories = [], isLoading } = useChildCategories();
  const { data: currentCategory, isLoading: loadingCategory } =
    useGetCategoryById(currentId ?? undefined);

  const filteredCategories = categories.filter(
    (cat) => String(cat.parentCategoryId) === String(currentId)
  );

  const handleNavigate = (childId: number) => {
    navigate(`${location.pathname}/${childId}`);
  };

  if (currentLevel === 7 || filteredCategories.length === 0) {
    return <Document key={`category-level-${currentId}`} />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h5"
        sx={{ mb: 3, color: CATEGORY_TITLE_COLOR, fontWeight: "bold" }}
      >
        {loadingCategory ? "Loading..." : currentCategory?.name || "Category"}
      </Typography>

      {isLoading ? (
        <Typography>{CATEGORY_LOADING_TEXT}</Typography>
      ) : (
        <Grid container spacing={2}>
          {filteredCategories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card sx={CATEGORY_CARD_STYLES}>
                <CardActionArea onClick={() => handleNavigate(category.id)}>
                  <CardContent sx={CATEGORY_CARD_CONTENT_STYLES}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <FolderIcon color="primary" />
                      <Typography variant="body1" fontWeight="medium">
                        {category.name}
                      </Typography>
                    </Box>
                    <ArrowForwardIcon sx={{ color: CATEGORY_TITLE_COLOR }} />
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
