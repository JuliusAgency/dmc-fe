export const PartNumberEndpoints = {
  getAllPartNumbers: "/part-number/getAll",
  createPartNumber: "/part-number",
  deletePartNumber: (id: number) => `/part-number/${id}`,
};
