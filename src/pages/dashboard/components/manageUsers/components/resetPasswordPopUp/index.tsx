import { TextField } from "@mui/material";
import { GenericPopup } from "../../../../../../components/genericPopup/genericPopup";
import {
  RESET_PASSWORD_TITLE,
  NEW_PASSWORD_LABEL,
  CANCEL_BUTTON,
  SAVE_BUTTON,
  PASSWORD_ERROR_MESSAGE,
} from "./constants";
import { ResetPasswordPopupProps } from "./types";

export const ResetPasswordPopup = ({
  open,
  onClose,
  onConfirm,
  newPassword,
  setNewPassword,
}: ResetPasswordPopupProps) => (
  <GenericPopup
    open={open}
    onClose={onClose}
    title={RESET_PASSWORD_TITLE}
    onConfirm={onConfirm}
    confirmButtonText={SAVE_BUTTON}
    cancelButtonText={CANCEL_BUTTON}
    disabledConfirm={newPassword.length < 6}
  >
    <TextField
      label={NEW_PASSWORD_LABEL}
      type="password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      fullWidth
      margin="dense"
      error={newPassword.length > 0 && newPassword.length < 6}
      helperText={
        newPassword.length > 0 && newPassword.length < 6
          ? PASSWORD_ERROR_MESSAGE
          : ""
      }
    />
  </GenericPopup>
);
