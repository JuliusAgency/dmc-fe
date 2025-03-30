export const userEndpoints = {
  getUsers: "/user",
  createUser: "/user",
  updateUser: (userId: number) => `/user/${userId}`,
};
