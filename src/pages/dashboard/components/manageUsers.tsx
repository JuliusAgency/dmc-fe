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
} from "@mui/material";
import {
  getUsers,
  createUser,
  updateUserRole,
  resetPassword,
  updateUserPermissions,
} from "../../../api";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    role: "USER",
  });
  const [newRole, setNewRole] = useState("");
  const [newPermissions, setNewPermissions] = useState([]);

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

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password) {
      alert("נא למלא את כל השדות");
      return;
    }

    try {
      await createUser(newUser);
      fetchUsers();
      setNewUser({ email: "", password: "", role: "USER" });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h5" sx={{ mb: 3 }}>
        ניהול משתמשים
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="אימייל"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          fullWidth
        />
        <TextField
          label="סיסמה"
          type="password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel>תפקיד</InputLabel>
          <Select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <MenuItem value="USER">USER</MenuItem>
            <MenuItem value="ADMIN">ADMIN</MenuItem>
            <MenuItem value="SYSTEM_ADMIN">SYSTEM_ADMIN</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleCreateUser}>
          צור משתמש
        </Button>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>אימייל</TableCell>
            <TableCell>תפקיד</TableCell>
            <TableCell>הרשאות</TableCell>
            <TableCell>פעולות</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u: any) => (
            <TableRow key={u.id}>
              <TableCell>{u.email}</TableCell>
              <TableCell>
                <Select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                >
                  <MenuItem value="USER">USER</MenuItem>
                  <MenuItem value="ADMIN">ADMIN</MenuItem>
                  <MenuItem value="SYSTEM_ADMIN">SYSTEM_ADMIN</MenuItem>
                </Select>
                <Button onClick={() => updateUserRole(u.id, newRole)}>
                  עדכן
                </Button>
              </TableCell>
              <TableCell>
                <Select
                  multiple
                  value={newPermissions}
                  onChange={(e: any) => setNewPermissions(e.target.value)}
                >
                  <MenuItem value="READ">קריאה</MenuItem>
                  <MenuItem value="WRITE">כתיבה</MenuItem>
                  <MenuItem value="DELETE">מחיקה</MenuItem>
                </Select>
                <Button
                  onClick={() => updateUserPermissions(u.id, newPermissions)}
                >
                  עדכן
                </Button>
              </TableCell>
              <TableCell>
                <Button onClick={() => resetPassword(u.id)} color="warning">
                  אפס סיסמה
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
