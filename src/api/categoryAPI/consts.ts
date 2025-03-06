export const CategoryEndpoints = {
  getAllCategories: "/category/getAll",
  createCategory: "/category",
  deleteCategory: (id: number) => `/category/${id}`,
};
