import { Typography, Container, Grid, Paper } from "@mui/material";
import {
  useCreateCategory,
  useDeleteCategory,
  useParentCategories,
} from "../../../../hooks/category/categoryHooks";
import {
  useGetAllTags,
  useCreateTag,
  useDeleteTag,
  useEditTag,
} from "../../../../hooks/tag/tagHooks";
import {
  CategoryTable,
  TagTable,
} from "../../../../components/categoryTagTables/categoryTagTables";
import {
  CategoryForm,
  TagForm,
} from "../../../../components/categoryTagForms/categoryTagForms";
import { MANAGE_CATEGORIES_TITLE, PAPER_STYLE } from "./constants";

export const ManageCategories = () => {
  const { data: categories = [], isLoading: loadingCategories } =
    useParentCategories();
  const { data: tags = [], isLoading: loadingTags } = useGetAllTags();

  const createCategoryMutation = useCreateCategory();
  const createTagMutation = useCreateTag();
  const deleteCategoryMutation = useDeleteCategory();
  const deleteTagMutation = useDeleteTag();
  const editTagMutation = useEditTag();

  return (
    <Container sx={{ direction: "ltr", textAlign: "left" }}>
      <Typography variant="h6" sx={{ mb: 2, fontSize: "1rem" }}>
        {MANAGE_CATEGORIES_TITLE}
      </Typography>

      <Grid container spacing={4} justifyContent="flex-start">
        <Grid item xs={12} md={6}>
          <Paper sx={PAPER_STYLE}>
            <CategoryForm
              onSubmit={(name: string) =>
                createCategoryMutation.mutate({ name })
              }
            />
            <CategoryTable
              categories={categories}
              loading={loadingCategories}
              onDelete={deleteCategoryMutation.mutate}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={PAPER_STYLE}>
            <TagForm onSubmit={createTagMutation.mutate} />
            <TagTable
              tags={tags}
              loading={loadingTags}
              onDelete={deleteTagMutation.mutate}
              onEdit={(id, name) => editTagMutation.mutate({ id, name })}
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};
