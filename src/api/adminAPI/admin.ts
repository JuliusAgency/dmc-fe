import { API } from "../API.ts";
import { AdminEndpoints } from "./constants.ts";

export const getUsers = async () => {
  const response = await API.get(AdminEndpoints.getUsers);
  return response.data;
};

export const createUser = async (data: {
  email: string;
  password: string;
  role: string;
}) => {
  return API.post(AdminEndpoints.createUser, data);
};

export const updateUserRole = async (userId: string, role: string) => {
  return API.put(AdminEndpoints.updateUserRole(userId), { role });
};

export const resetPassword = async (userId: string) => {
  return API.post(
    AdminEndpoints.resetPassword(userId),
    {},
    { withCredentials: true }
  );
};

export const addHomeImage = async (data: FormData) =>
  API.post(AdminEndpoints.addHomeImage, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getHomeImages = async () => {
  const response = await API.get(AdminEndpoints.getHomeImages);
  return response.data;
};

export const addHomeAnnouncement = async (data: { text: string }) =>
  API.post(AdminEndpoints.addHomeAnnouncement, data);

export const getHomeAnnouncements = async () => {
  const response = await API.get(AdminEndpoints.getHomeAnnouncements);
  return response.data;
};

export const deleteHomeAnnouncement = async (id: number) =>
  API.delete(AdminEndpoints.deleteHomeAnnouncement(id));

export const updateUserPermissions = async (
  userId: string,
  permissions: string[]
) => {
  return API.put(AdminEndpoints.updateUserPermissions(userId), { permissions });
};

export const getCategories = async () => {
  const { data } = await API.get("/category/getAll");
  return data;
};

export const createCategory = async (description: string) => {
  return API.post("/category", { description });
};

export const getTags = async () => {
  const { data } = await API.get("/tag/getAll");
  console.log("Tags response:", data);
  return data;
};

export const createTag = async (description: string) => {
  return API.post("/tag", { description });
};

export async function deleteCategory(id: number) {
  await API.delete(`/category/${id}`);
}

export async function deleteTag(id: number) {
  await API.delete(`/tag/${id}`);
}
