import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  createUser,
  updateUserRole,
  resetPassword,
} from "../../api/userAPI/user";
import { User } from "../../api/authAPI/types";
import { snackBarError, snackBarSuccess } from "../../components/toast/Toast";
import { TOAST_MESSAGES } from "./constants";

export const useGetUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: getUsers,
    refetchOnWindowFocus: false,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      snackBarSuccess(TOAST_MESSAGES.createUserSuccess);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      snackBarError(TOAST_MESSAGES.createUserError);
    },
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, newRole }: { userId: string; newRole: string }) =>
      updateUserRole(userId, newRole),
    onSuccess: () => {
      snackBarSuccess(TOAST_MESSAGES.updateRoleSuccess);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      snackBarError(TOAST_MESSAGES.updateRoleError);
    },
  });
};

export const useResetPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      snackBarSuccess(TOAST_MESSAGES.resetPasswordSuccess);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      snackBarError(TOAST_MESSAGES.resetPasswordError);
    },
  });
};
