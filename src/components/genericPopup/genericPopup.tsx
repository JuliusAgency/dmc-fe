import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";

interface GenericPopupProps {
  open: boolean;
  fullScreen?: boolean;
  loading?: boolean;
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
  loading = false,
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
        <Button onClick={onCancel ?? onClose} disabled={loading}>
          {cancelButtonText}
        </Button>

        {onConfirm && (
          <Button
            variant="contained"
            disabled={disabledConfirm || loading}
            onClick={onConfirm}
            startIcon={loading && <CircularProgress size={16} />}
          >
            {loading ? "Please wait..." : confirmButtonText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
