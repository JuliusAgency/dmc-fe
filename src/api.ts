import axios from "axios";
import { AuthData, User } from "./types";
import { auth } from "./firebase";

const API = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

interface AuthResponse {
  firebaseToken: string;
  user: User;
}

export const register = (data: AuthData) =>
  API.post<AuthResponse>("/auth/register", data).then((res) => res.data);

export const login = (data: AuthData) =>
  API.post<AuthResponse>("/auth/login", data).then((res) => res.data);

export const logout = () => API.post("/auth/logout");

export const getUser = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No authenticated user");
  }

  const token = await user.getIdToken();

  return API.get<User>("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.data);
};
