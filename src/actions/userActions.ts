export const setUser = (user: any) => ({
  type: "SET_USER",
  payload: user,
});

export const setRole = (role: string) => ({
  type: "SET_ROLE",
  payload: role,
});
