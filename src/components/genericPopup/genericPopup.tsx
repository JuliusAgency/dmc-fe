import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

interface GenericPopupProps {
  open: boolean;
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
  onClose,
  title,
  children,
  onConfirm,
  onCancel,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
}: GenericPopupProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onCancel ?? onClose}>{cancelButtonText}</Button>
        {onConfirm && (
          <Button variant="contained" onClick={onConfirm}>
            {confirmButtonText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
