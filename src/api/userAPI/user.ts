import { API } from "../API.ts";
import { userEndpoints } from "./constants.ts";

export const getUsers = async () => {
  const response = await API.get(userEndpoints.getUsers);
  return response.data;
};

export const createUser = async (data: {
  email: string;
  password: string;
  role: string;
}) => {
  return API.post(userEndpoints.createUser, data);
};

export const updateUserRole = async (userId: string, role: string) => {
  return API.put(userEndpoints.updateUserRole(userId), { role });
};

export const resetPassword = async (userId: string) => {
  return API.post(
    userEndpoints.resetPassword(userId),
    {},
    { withCredentials: true }
  );
};
