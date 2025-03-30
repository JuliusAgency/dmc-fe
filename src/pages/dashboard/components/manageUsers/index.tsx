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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { GridColDef } from "@mui/x-data-grid";
import {
  useGetUsers,
  useCreateUser,
  useUpdateUser,
} from "../../../../hooks/user/userHooks";
import { GenericTable } from "../../../../components/genericTable/genericTable";
import { GenericPopup } from "../../../../components/genericPopup/genericPopup";
import {
  USERS_TITLE,
  EMAIL_LABEL,
  PASSWORD_LABEL,
  ROLE_LABEL,
  ROLE_OPTIONS,
  RESET_PASSWORD_BUTTON,
  CREATE_USER_TITLE,
  CANCEL_BUTTON,
  SAVE_USER_BUTTON,
  CLASSIFICATION_LABEL,
  CLASSIFICATION_OPTIONS,
} from "./constants";

export const ManageUsers = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [resetDialog, setResetDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");

  const [userData, setUserData] = useState({
    email: "",
    password: "",
    role: "USER",
    classification: "PUBLIC",
  });

  const { data: users = [], isLoading } = useGetUsers();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  const handleOpenDialog = () => {
    setUserData({
      email: "",
      password: "",
      role: "USER",
      classification: "PUBLIC",
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleSaveUser = () => {
    if (!userData.email || !userData.password) return;
    createUserMutation.mutate(userData, { onSuccess: handleCloseDialog });
  };

  const handleUpdate = (
    userId: number,
    data: { role?: string; classification?: string; newPassword?: string }
  ) => {
    updateUserMutation.mutate({ userId, ...data });
  };

  const handleRoleChange = (userId: number, role: string) => {
    handleUpdate(userId, { role });
  };

  const handleClassificationChange = (
    userId: number,
    classification: string
  ) => {
    handleUpdate(userId, { classification });
  };

  const handleOpenResetDialog = (userId: string) => {
    setSelectedUserId(userId);
    setNewPassword("");
    setResetDialog(true);
  };

  const handleCloseResetDialog = () => {
    setSelectedUserId(null);
    setNewPassword("");
    setResetDialog(false);
  };

  const handleResetPassword = () => {
    if (!selectedUserId || !newPassword) return;
    handleUpdate(Number(selectedUserId), { newPassword });
    handleCloseResetDialog();
  };

  const columns: GridColDef[] = [
    { field: "email", headerName: EMAIL_LABEL, flex: 1 },
    {
      field: "role",
      headerName: ROLE_LABEL,
      flex: 1,
      renderCell: (params) => (
        <FormControl
          fullWidth
          size="small"
          variant="outlined"
          sx={{ "& fieldset": { border: "none" } }}
        >
          <Select
            value={params.value}
            onChange={(e) => handleRoleChange(params.row.id, e.target.value)}
          >
            {ROLE_OPTIONS.map((role) => (
              <MenuItem key={role.value} value={role.value}>
                {role.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      field: "classification",
      headerName: CLASSIFICATION_LABEL,
      flex: 1,
      renderCell: (params) => (
        <FormControl
          fullWidth
          size="small"
          variant="outlined"
          sx={{ "& fieldset": { border: "none" } }}
        >
          <Select
            value={params.value || "PUBLIC"}
            onChange={(e) =>
              handleClassificationChange(params.row.id, e.target.value)
            }
          >
            {CLASSIFICATION_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Button
          onClick={() => handleOpenResetDialog(params.row.id)}
          color="warning"
        >
          {RESET_PASSWORD_BUTTON}
        </Button>
      ),
    },
  ];

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
        columns={columns}
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
    </Container>
  );
};
