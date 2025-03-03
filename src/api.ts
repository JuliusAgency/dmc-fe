import axios from "axios";
import { AuthData, User } from "./types";

const API = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

interface AuthResponse {
  token: string;
  user: User;
}

export const register = (data: AuthData) =>
  API.post<AuthResponse>("/auth/register", data).then((res) => res.data);

export const login = async (data: AuthData) => {
  const response = await API.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const logout = async () => API.post("/auth/logout");

export const getUser = async () => {
  try {
    return API.get<User>("/auth/me").then((res) => res.data);
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

// ==============================
// 🔹 פונקציות ניהול לאדמין
// ==============================

export const getUsers = async () =>
  API.get("/admin/users").then((res) => res.data);

export const createUser = async (data: {
  email: string;
  password: string;
  role: string;
}) => API.post("/admin/create-user", data);

export const updateUserRole = async (userId: number, role: string) =>
  API.put(`/admin/update-role/${userId}`, { role });

export const resetPassword = async (userId: string) =>
  API.post(`/admin/reset-password/${userId}`);

// ==============================
// 🔹 ניהול דף הבית (תמונות + הודעות רצות)
// ==============================

// עדכון תמונת דף הבית + הודעות רצות
export const updateHomeContent = async (data: {
  imageUrl: string;
  announcement: string;
}) => API.put("/admin/home-content", data);

// שליפת תוכן דף הבית
export const getHomeContent = async () =>
  API.get("/admin/home-content").then((res) => res.data);

export const updateUserPermissions = async (
  userId: string,
  permissions: string[]
) => API.put(`/admin/update-permissions/${userId}`, { permissions });

export const getCategories = async () =>
  API.get("/admin/categories").then((res) => res.data);

export const createCategory = async (categoryName: string) =>
  API.post("/admin/create-category", { name: categoryName });
