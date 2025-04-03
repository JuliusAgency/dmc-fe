import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface GenericPopupProps {
  open: boolean;
  fullScreen?: boolean;
  disabledConfirm?: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export const GenericPopup = ({
  open,
  fullScreen = false,
  onClose,
  title,
  children,
  onConfirm,
  onCancel,
  disabledConfirm = false,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
}: GenericPopupProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onCancel ?? onClose}>{cancelButtonText}</Button>
        {onConfirm && (
          <Button
            variant="contained"
            disabled={disabledConfirm}
            onClick={onConfirm}
          >
            {confirmButtonText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
