import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import {
  GridMultipleAutocomplete,
  Option,
} from "../../../../components/gridItems/gridMultipleAutocomplete/GridMultipleAutocomplete.tsx";
import {
  snackBarError,
  snackBarSuccess,
} from "../../../../components/toast/Toast.tsx";
import { useGetUsers } from "../../../../hooks/user/userHooks.ts";
import { useAddSignersToDocument } from "../../../../hooks/signatures/signaturesHooks.ts";
import {
  TITLE_SELECT_SIGNERS,
  TEXT_SELECT_SIGNERS,
  BUTTON_CANCEL,
  BUTTON_SUBMIT,
  ERROR_NO_SIGNERS,
  SUCCESS_SEND_SIGNERS,
} from "./constants.ts";

interface SelectSignersPopupProps {
  open: boolean;
  onClose: () => void;
  documentId: number | null;
}

const SelectSignersPopup = ({
  open,
  onClose,
  documentId,
}: SelectSignersPopupProps) => {
  const { data: users } = useGetUsers();
  const addSignersMutation = useAddSignersToDocument();
  const [selectedSigners, setSelectedSigners] = useState<Option[]>([]);

  const userOptions = users
    ? users.map((user: any) => ({ id: user.id, name: user.email }))
    : [];

  const handleChange = (value: Option | Option[]) => {
    setSelectedSigners(Array.isArray(value) ? value : [value]);
  };

  const handleSubmit = async () => {
    if (!documentId || selectedSigners.length === 0) {
      snackBarError(ERROR_NO_SIGNERS);
      return;
    }

    const signerIds = selectedSigners.map((signer) => signer.id);

    addSignersMutation.mutate(
      { documentId, userIds: signerIds },
      {
        onSuccess: () => {
          snackBarSuccess(SUCCESS_SEND_SIGNERS);
          onClose();
        },
        onError: (error) => {
          console.error("Error adding signers:", error);
          snackBarError("Failed to add signers.");
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{TITLE_SELECT_SIGNERS}</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {TEXT_SELECT_SIGNERS}
        </Typography>

        <GridMultipleAutocomplete
          multiple
          onChange={handleChange}
          value={selectedSigners}
          fullWidth
          selectorData={{
            label: "Signers",
            accessorId: "signers",
            options: userOptions || [],
          }}
          sx={{ minWidth: 250 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {BUTTON_CANCEL}
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {BUTTON_SUBMIT}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectSignersPopup;
