export type ResetPasswordPopupProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  newPassword: string;
  setNewPassword: (value: string) => void;
};
