import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/authAPI/auth";
import { AuthData } from "../../api/authAPI/types";

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: AuthData) => login(credentials),
  });
};
