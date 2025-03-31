import { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  useGetUsers,
  useCreateUser,
  useUpdateUser,
} from "../../../../hooks/user/userHooks";
import { useGetAllCategories } from "../../../../hooks/category/categoryHooks";
import { GenericTable } from "../../../../components/genericTable/genericTable";
import { GenericPopup } from "../../../../components/genericPopup/genericPopup";
import {
  USERS_TITLE,
  EMAIL_LABEL,
  PASSWORD_LABEL,
  ROLE_LABEL,
  ROLE_OPTIONS,
  CREATE_USER_TITLE,
  CANCEL_BUTTON,
  SAVE_USER_BUTTON,
  CLASSIFICATION_LABEL,
  CLASSIFICATION_OPTIONS,
} from "./constants";
import { User } from "../../../../api/authAPI/types";
import { useManageUsersColumns } from "./columns";

export const ManageUsers = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [resetDialog, setResetDialog] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null | undefined>(
    null
  );
  const [newPassword, setNewPassword] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  const [userData, setUserData] = useState({
    email: "",
    password: "",
    role: "USER",
    classification: "PUBLIC",
  });

  const { data: users = [], isLoading } = useGetUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const { data: allCategories = [] } = useGetAllCategories();

  const topLevelCategories = allCategories.filter(
    (cat) => cat.parentCategoryId === null
  );

  const COLUMNS = useManageUsersColumns(
    handleRoleChange,
    handleClassificationChange,
    handleOpenResetDialog,
    handleOpenPermissionsDialog
  );

  function handleOpenDialog() {
    setUserData({
      email: "",
      password: "",
      role: "USER",
      classification: "PUBLIC",
    });
    setOpenDialog(true);
  }

  function handleCloseDialog() {
    setOpenDialog(false);
  }

  function handleSaveUser() {
    if (!userData.email || !userData.password) return;
    createUserMutation.mutate(userData, { onSuccess: handleCloseDialog });
  }

  function handleUpdate(
    userId: number,
    data: {
      role?: string;
      classification?: string;
      newPassword?: string;
      blockedCategoryIds?: number[];
    }
  ) {
    updateUserMutation.mutate({ userId, ...data });
  }

  function handleRoleChange(userId: number, role: string) {
    handleUpdate(userId, { role });
  }

  function handleClassificationChange(userId: number, classification: string) {
    handleUpdate(userId, { classification });
  }

  function handleOpenResetDialog(userId: number) {
    const user = users.find((u) => Number(u.id) === userId);
    setSelectedUser(user);
    setNewPassword("");
    setResetDialog(true);
  }

  function handleCloseResetDialog() {
    setSelectedUser(null);
    setNewPassword("");
    setResetDialog(false);
  }

  function handleResetPassword() {
    if (!selectedUser || !newPassword) return;
    handleUpdate(Number(selectedUser.id), { newPassword });
    handleCloseResetDialog();
  }

  function handleOpenPermissionsDialog(user: User) {
    setSelectedUser(user);
    setSelectedCategories(user.blockedCategories?.map((cat) => cat.id) || []);
    setPermissionsDialogOpen(true);
  }

  function handleSavePermissions() {
    if (!selectedUser) return;

    updateUserMutation.mutate({
      userId: Number(selectedUser.id),
      blockedCategoryIds: selectedCategories,
    });

    setPermissionsDialogOpen(false);
  }

  return (
    <Container sx={{ direction: "ltr", textAlign: "left" }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {USERS_TITLE}
      </Typography>

      <Box
        sx={{ display: "flex", justifyContent: "flex-start", gap: 2, mb: 3 }}
      >
        <Button variant="contained" onClick={handleOpenDialog}>
          <AddIcon />
        </Button>
      </Box>

      <GenericTable
        loading={isLoading}
        columns={COLUMNS}
        rows={users}
        rowCount={users.length}
        pageSize={10}
        onPaginationModelChange={() => {}}
        hideFooterPagination
        sx={{
          width: "85%",
          height: "auto",
          border: "none",
          "& .MuiDataGrid-virtualScroller": { overflow: "visible" },
        }}
      />

      <GenericPopup
        open={openDialog}
        onClose={handleCloseDialog}
        title={CREATE_USER_TITLE}
        onConfirm={handleSaveUser}
        confirmButtonText={SAVE_USER_BUTTON}
        cancelButtonText={CANCEL_BUTTON}
      >
        <TextField
          label={EMAIL_LABEL}
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          fullWidth
          margin="dense"
        />
        <TextField
          label={PASSWORD_LABEL}
          type="password"
          value={userData.password}
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
          fullWidth
          margin="dense"
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>{ROLE_LABEL}</InputLabel>
          <Select
            value={userData.role}
            onChange={(e) => setUserData({ ...userData, role: e.target.value })}
          >
            {ROLE_OPTIONS.map((role) => (
              <MenuItem key={role.value} value={role.value}>
                {role.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>{CLASSIFICATION_LABEL}</InputLabel>
          <Select
            value={userData.classification}
            onChange={(e) =>
              setUserData({ ...userData, classification: e.target.value })
            }
          >
            {CLASSIFICATION_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </GenericPopup>

      <GenericPopup
        open={resetDialog}
        onClose={handleCloseResetDialog}
        title="Set New Password"
        onConfirm={handleResetPassword}
        confirmButtonText="Save"
        cancelButtonText="Cancel"
      >
        <TextField
          label="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          margin="dense"
        />
      </GenericPopup>

      <GenericPopup
        open={permissionsDialogOpen}
        onClose={() => setPermissionsDialogOpen(false)}
        title={`Blocked Categories for ${selectedUser?.email}`}
        onConfirm={handleSavePermissions}
        confirmButtonText="Save"
        cancelButtonText="Cancel"
      >
        <FormControl fullWidth>
          <InputLabel id="blocked-categories-label">
            Blocked Categories
          </InputLabel>
          <Select
            labelId="blocked-categories-label"
            multiple
            value={selectedCategories}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedCategories(
                typeof value === "string" ? value.split(",").map(Number) : value
              );
            }}
            renderValue={(selected) =>
              topLevelCategories
                .filter((cat) => selected.includes(cat.id))
                .map((cat) => cat.name)
                .join(", ")
            }
            MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
          >
            {topLevelCategories.map((cat) => {
              const isBlocked = selectedCategories.includes(cat.id);
              return (
                <MenuItem key={cat.id} value={cat.id}>
                  <Checkbox checked={isBlocked} />
                  <ListItemText
                    primary={cat.name}
                    secondary={isBlocked ? "Blocked" : "Allowed"}
                  />
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </GenericPopup>
    </Container>
  );
};
