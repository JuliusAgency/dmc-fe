import { API } from "../API.ts";
import { AuthData, User } from "./types.ts";
import { AuthEndpoints } from "./constants.ts";

interface AuthResponse {
  token: string;
  user: User;
}

export const login = async (data: AuthData) => {
  const response = await API.post<AuthResponse>(AuthEndpoints.login, data);
  return response.data;
};

export const register = async (data: AuthData) => {
  const response = await API.post<AuthResponse>(AuthEndpoints.register, data);
  return response.data;
};

export const logout = async () => API.post(AuthEndpoints.logout, {});

export const getUser = async () => {
  try {
    const response = await API.get<User>(AuthEndpoints.getUser);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
