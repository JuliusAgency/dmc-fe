export const AdminEndpoints = {
  getUsers: "/admin/users",
  createUser: "/admin/create-user",
  updateUserRole: (userId: string) => `/admin/update-role/${userId}`,
  resetPassword: (userId: string) => `/admin/reset-password/${userId}`,
  addHomeImage: "/home/home-images/add",
  getHomeImages: "/home/home-images",
  addHomeAnnouncement: "/home/home-announcements/add",
  getHomeAnnouncements: "/home/home-announcements",
  deleteHomeAnnouncement: (id: number) => `/home/home-announcements/${id}`,
  updateUserPermissions: (userId: string) =>
    `/admin/update-permissions/${userId}`,
  getCategories: "/admin/categories",
  createCategory: "/admin/create-category",
};
