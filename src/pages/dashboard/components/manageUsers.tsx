import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Box,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  getUsers,
  createUser,
  updateUserRole,
  resetPassword,
} from "../../../api/adminAPI/admin";
import {
  USERS_TITLE,
  CREATE_USER_BUTTON,
  EMAIL_LABEL,
  PASSWORD_LABEL,
  ROLE_LABEL,
  ROLE_OPTIONS,
  RESET_PASSWORD_BUTTON,
  CREATE_USER_TITLE,
  CANCEL_BUTTON,
  SAVE_USER_BUTTON,
} from "../constants";

export default function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    role: "USER",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleOpenDialog = () => {
    setUserData({ email: "", password: "", role: "USER" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleSaveUser = async () => {
    try {
      await createUser(userData);
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {USERS_TITLE}
      </Typography>

      <Box
        sx={{ display: "flex", justifyContent: "flex-start", gap: 2, mb: 3 }}
      >
        <Button variant="contained" onClick={handleOpenDialog}>
          {CREATE_USER_BUTTON}
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="right">{EMAIL_LABEL}</TableCell>
            <TableCell align="right">{ROLE_LABEL}</TableCell>
            <TableCell align="right">{RESET_PASSWORD_BUTTON}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user: any) => (
            <TableRow key={user.id}>
              <TableCell align="right">{user.email}</TableCell>
              <TableCell align="right">
                <FormControl fullWidth>
                  <InputLabel sx={{ textAlign: "right" }}>
                    {ROLE_LABEL}
                  </InputLabel>
                  <Select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                  >
                    {ROLE_OPTIONS.map((role: any) => (
                      <MenuItem key={role.value} value={role.value}>
                        {role.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell align="right">
                <Button onClick={() => resetPassword(user.id)} color="warning">
                  {RESET_PASSWORD_BUTTON}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ textAlign: "right" }}>
          {CREATE_USER_TITLE}
        </DialogTitle>
        <DialogContent>
          <TextField
            label={EMAIL_LABEL}
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            fullWidth
            margin="dense"
            sx={{ textAlign: "right" }}
            InputLabelProps={{
              style: { textAlign: "right", direction: "rtl" },
            }}
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
            sx={{ textAlign: "right" }}
            InputLabelProps={{
              style: { textAlign: "right", direction: "rtl" },
            }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel sx={{ textAlign: "right" }}>{ROLE_LABEL}</InputLabel>
            <Select
              value={userData.role}
              onChange={(e) =>
                setUserData({ ...userData, role: e.target.value })
              }
            >
              {ROLE_OPTIONS.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{CANCEL_BUTTON}</Button>
          <Button variant="contained" onClick={handleSaveUser}>
            {SAVE_USER_BUTTON}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
