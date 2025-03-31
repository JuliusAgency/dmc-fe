import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, createUser, updateUser } from "../../api/userAPI/user";
import { User } from "../../api/authAPI/types";
import { snackBarError, snackBarSuccess } from "../../components/toast/Toast";
import { TOAST_MESSAGES } from "./constants";
import { useDispatch } from "react-redux";
import { setUser } from "../../actions/userActions";

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

type UpdateUserParams = {
  userId?: number;
  email?: string;
  role?: string;
  classification?: string;
  newPassword?: string;
  blockedCategoryIds?: number[];
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (data: UpdateUserParams) => {
      if (!data.userId && !data.email) {
        throw new Error("Either userId or email is required");
      }

      return updateUser(data);
    },
    onSuccess: (updatedUser) => {
      snackBarSuccess(TOAST_MESSAGES.updateUserSuccess);

      dispatch(setUser(updatedUser.data));
      localStorage.setItem("user", JSON.stringify(updatedUser.data));
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["getAllCategories"] });
    },
    onError: () => {
      snackBarError(TOAST_MESSAGES.updateUserError);
    },
  });
};
