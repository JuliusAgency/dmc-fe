import {
  Chip,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  CLASSIFICATION_LABEL,
  EMAIL_LABEL,
  ROLE_LABEL,
  RESET_PASSWORD_BUTTON,
  ROLE_OPTIONS,
  CLASSIFICATION_OPTIONS,
  CATEGORY_PERMISSIONS_LABEL,
} from "./constants";
import { GridColDef } from "@mui/x-data-grid";
import { User } from "../../../../api/authAPI/types";

export const useManageUsersColumns = (
  handleRoleChange: (userId: number, role: string) => void,
  handleClassificationChange: (ruserId: number, classification: string) => void,
  handleOpenResetDialog: (userId: number) => void,
  handleOpenPermissionsDialog: (user: User) => void,
  handleDeleteUser: (userId: number) => void
): GridColDef[] => [
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
    headerName: "actions",
    flex: 1.5,
    renderCell: (params) => (
      <>
        <Chip
          label={RESET_PASSWORD_BUTTON}
          onClick={() => handleOpenResetDialog(params.row.id)}
          sx={{
            mr: 1,
            cursor: "pointer",
            fontSize: "0.75rem",
            backgroundColor: "#ffa726",
            color: "#fff",
          }}
        />
        <Chip
          label="Category Permissions"
          onClick={() => handleOpenPermissionsDialog(params.row)}
          sx={{
            cursor: "pointer",
            fontSize: "0.75rem",
            backgroundColor: "#42a5f5",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#1976d2",
            },
          }}
        />
        <IconButton
          onClick={() => handleDeleteUser(params.row.id)}
          size="small"
          sx={{ color: "#ef5350" }}
        >
          <DeleteIcon />
        </IconButton>
      </>
    ),
  },
];
