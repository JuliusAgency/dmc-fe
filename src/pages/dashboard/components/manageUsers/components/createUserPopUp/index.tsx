import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { GenericPopup } from "../../../../../../components/genericPopup/genericPopup";
import {
  CREATE_USER_TITLE,
  EMAIL_LABEL,
  PASSWORD_LABEL,
  ROLE_LABEL,
  CLASSIFICATION_LABEL,
  ROLE_OPTIONS,
  CLASSIFICATION_OPTIONS,
  CANCEL_BUTTON,
  SAVE_USER_BUTTON,
  PASSWORD_ERROR_MESSAGE,
} from "./constants";
import { CreateUserPopupProps } from "./types";

export const CreateUserPopup = ({
  open,
  onClose,
  onConfirm,
  userData,
  setUserData,
}: CreateUserPopupProps) => {
  const handleChange = (field: keyof typeof userData) => (e: any) => {
    setUserData((prev: any) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const isPasswordInvalid =
    userData.password.length > 0 && userData.password.length < 6;

  return (
    <GenericPopup
      open={open}
      onClose={onClose}
      title={CREATE_USER_TITLE}
      onConfirm={onConfirm}
      confirmButtonText={SAVE_USER_BUTTON}
      cancelButtonText={CANCEL_BUTTON}
    >
      <TextField
        label={EMAIL_LABEL}
        value={userData.email}
        onChange={handleChange("email")}
        fullWidth
        margin="dense"
      />

      <TextField
        label={PASSWORD_LABEL}
        type="password"
        value={userData.password}
        onChange={handleChange("password")}
        fullWidth
        margin="dense"
        error={isPasswordInvalid}
        helperText={isPasswordInvalid ? PASSWORD_ERROR_MESSAGE : ""}
      />

      <FormControl fullWidth margin="dense">
        <InputLabel>{ROLE_LABEL}</InputLabel>
        <Select value={userData.role} onChange={handleChange("role")}>
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
          onChange={handleChange("classification")}
        >
          {CLASSIFICATION_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </GenericPopup>
  );
};
