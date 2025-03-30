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

export const updateUser = async (data: {
  userId?: number;
  email?: string;
  role?: string;
  classification?: string;
  newPassword?: string;
}) => {
  const idOrEmail = data.userId ?? data.email;
  return API.put(`/user/${idOrEmail}`, data);
};
