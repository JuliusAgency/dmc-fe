import { useState, useCallback } from "react";
import {
  useGetUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "../../../../hooks/user/userHooks";
import { useGetAllCategories } from "../../../../hooks/category/categoryHooks";
import { useManageUsersColumns } from "./columns";
import { User } from "../../../../api/authAPI/types";
import { isAction } from "redux";

export const useManageUsersLogic = () => {
  const [openCreatePopup, setOpenCreatePopup] = useState(false);
  const [openResetPopup, setOpenResetPopup] = useState(false);
  const [openPermissionsPopup, setOpenPermissionsPopup] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    role: "USER",
    classification: "PUBLIC",
  });

  const { data: users = [], isLoading } = useGetUsers();
  const { mutate: createUser } = useCreateUser();
  const { mutate: updateUser } = useUpdateUser();
  const { mutate: deleteUser } = useDeleteUser();
  const { data: allCategories = [] } = useGetAllCategories();

  const topLevelCategories = allCategories.filter(
    (cat) => cat.parentCategoryId === null
  );

  const handleOpenCreatePopup = () => {
    setUserData({
      email: "",
      password: "",
      role: "USER",
      classification: "PUBLIC",
    });
    setOpenCreatePopup(true);
  };

  const handleCloseCreatePopup = () => setOpenCreatePopup(false);

  const handleSaveUser = () => {
    if (!userData.email || !userData.password) return;
    createUser(userData, { onSuccess: handleCloseCreatePopup });
  };

  const handleUpdate = useCallback(
    (
      userId: number,
      data: {
        role?: string;
        classification?: string;
        newPassword?: string;
        blockedCategoryIds?: number[];
        isActive?: boolean;
      }
    ) => {
      updateUser({ userId, ...data });
    },
    [updateUser]
  );

  const handleRoleChange = (userId: number, role: string) =>
    handleUpdate(userId, { role });

  const handleClassificationChange = (userId: number, classification: string) =>
    handleUpdate(userId, { classification });

  const handleOpenResetPopup = (userId: number) => {
    const user = users.find((u) => Number(u.id) === userId);
    setSelectedUser(user || null);
    setNewPassword("");
    setOpenResetPopup(true);
  };

  const handleCloseResetPopup = () => {
    setSelectedUser(null);
    setNewPassword("");
    setOpenResetPopup(false);
  };

  const handleResetPassword = () => {
    if (!selectedUser || newPassword.length < 6) return;
    handleUpdate(Number(selectedUser.id), { newPassword });
    handleCloseResetPopup();
  };

  const handleDeleteUser = (userId: number) => deleteUser(userId);

  const handleOpenPermissionsPopup = (user: User) => {
    setSelectedUser(user);
    setSelectedCategories(user.blockedCategories?.map((cat) => cat.id) || []);
    setOpenPermissionsPopup(true);
  };

  const handleClosePermissionsPopup = () => setOpenPermissionsPopup(false);

  const handleSavePermissions = () => {
    if (!selectedUser) return;
    updateUser({
      userId: Number(selectedUser.id),
      blockedCategoryIds: selectedCategories,
    });
    setOpenPermissionsPopup(false);
  };

  const handleToggleStatus = (userId: number, currentStatus: boolean) => {
    console.log(currentStatus);
    handleUpdate(userId, { isActive: !currentStatus });
  };

  const COLUMNS = useManageUsersColumns(
    handleRoleChange,
    handleClassificationChange,
    handleOpenResetPopup,
    handleOpenPermissionsPopup,
    handleDeleteUser,
    handleToggleStatus
  );

  return {
    users,
    isLoading,
    COLUMNS,
    userData,
    setUserData,
    openCreatePopup,
    handleOpenCreatePopup,
    handleCloseCreatePopup,
    handleSaveUser,
    openResetPopup,
    handleOpenResetPopup,
    handleCloseResetPopup,
    newPassword,
    setNewPassword,
    handleResetPassword,
    openPermissionsPopup,
    handleOpenPermissionsPopup,
    handleClosePermissionsPopup,
    handleSavePermissions,
    selectedUser,
    selectedCategories,
    setSelectedCategories,
    topLevelCategories,
  };
};
