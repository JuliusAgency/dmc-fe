export const userEndpoints = {
  getUsers: "/user",
  createUser: "/user",
  updateUserRole: (userId: string) => `/user/update-role/${userId}`,
  resetPassword: (userId: string) => `/user/reset-password/${userId}`,
};
