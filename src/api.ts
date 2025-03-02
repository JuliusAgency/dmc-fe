import axios from "axios";
import { AuthData, User } from "./types";

const API = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

export const register = (data: AuthData) =>
  API.post<User>("/auth/register", data);
export const login = (data: AuthData) => API.post<User>("/auth/login", data);
export const logout = () => API.post("/auth/logout");
export const getUser = () => API.get<User>("/auth/me");
