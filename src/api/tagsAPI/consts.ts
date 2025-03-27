export const TagEndpoints = {
  getAllTags: "/tag/getAll",
  createTag: "/tag",
  updateTag: (id: number) => `/tag/${id}`,
  deleteTag: (id: number) => `/tag/${id}`,
};
