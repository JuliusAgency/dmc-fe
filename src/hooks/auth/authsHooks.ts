import { useMutation } from "@tanstack/react-query";
import { login, logout } from "../../api/authAPI/auth";
import { AuthData } from "../../api/authAPI/types";
import { useDispatch } from "react-redux";
import { setUser } from "../../actions/userActions";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: AuthData) => login(credentials),
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      await logout();
      localStorage.removeItem("user");
      dispatch(setUser(null));
      navigate("/login");
    },
  });
};
