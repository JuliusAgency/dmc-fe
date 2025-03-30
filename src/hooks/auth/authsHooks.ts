import { useMutation } from "@tanstack/react-query";
import { login, logout } from "../../api/authAPI/auth";
import { AuthData } from "../../api/authAPI/types";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../actions/userActions";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: AuthData) => login(credentials),
  });
};

export const useUser = () => {
  const storedUser = localStorage.getItem("user");
  const user =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useSelector((state: any) => state.user.user) ||
    (storedUser ? JSON.parse(storedUser) : null);

  return {
    user,
    isSystemAdmin: user?.role === "SYSTEM_ADMIN",
  };
};

export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem("user");
      dispatch(setUser(null));
      navigate("/login");

      await logout();
    },
  });
};
