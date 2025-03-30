import { useMutation } from "@tanstack/react-query";
import { login, logout } from "../../api/authAPI/auth";
import { AuthData } from "../../api/authAPI/types";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../actions/userActions";
import { useNavigate } from "react-router-dom";
import { snackBarSuccess, snackBarError } from "../../components/toast/Toast";
import {
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT_SUCCESS,
  LOGOUT_ERROR,
} from "./constants";

export const useLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: AuthData) => login(credentials),
    onSuccess: (response: any) => {
      dispatch(setUser(response.user));
      localStorage.setItem("user", JSON.stringify(response.user));
      snackBarSuccess(LOGIN_SUCCESS);
      navigate("/home");
    },
    onError: (error: any) => {
      snackBarError(error?.response?.data?.message || LOGIN_ERROR);
    },
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
      try {
        localStorage.removeItem("user");
        dispatch(setUser(null));
        await logout();
        snackBarSuccess(LOGOUT_SUCCESS);
        navigate("/login");
      } catch {
        snackBarError(LOGOUT_ERROR);
      }
    },
  });
};
