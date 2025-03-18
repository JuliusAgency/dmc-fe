import { useState, useMemo } from "react";
import { Typography } from "@mui/material";
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
import { GenericPopup } from "../../../../components/genericPopup/genericPopup.tsx";
import { LABELS, BUTTONS, MESSAGES } from "./constants";
import { SelectSignersPopupProps } from "./types";

const SelectSignersPopup = ({
  open,
  onClose,
  documentId,
}: SelectSignersPopupProps) => {
  const { data: users } = useGetUsers();
  const addSignersMutation = useAddSignersToDocument();
  const [selectedSigners, setSelectedSigners] = useState<Option[]>([]);

  const userOptions = useMemo<Option[]>(
    () =>
      users?.map((user: any) => ({
        id: user.id,
        name: user.email,
      })) || [],
    [users]
  );

  const handleChange = (value: Option | Option[]) => {
    setSelectedSigners(Array.isArray(value) ? value : [value]);
  };

  const handleSubmit = async () => {
    if (!documentId || selectedSigners.length === 0) {
      snackBarError(MESSAGES.errorNoSigners);
      return;
    }

    try {
      await addSignersMutation.mutateAsync({
        documentId,
        userIds: selectedSigners.map((signer) => signer.id),
      });

      snackBarSuccess(MESSAGES.successSendSigners);
      handleClose();
    } catch (error) {
      snackBarError(MESSAGES.errorSendSigners);
    }
  };

  const handleClose = () => {
    setSelectedSigners([]);
    onClose();
  };

  return (
    <GenericPopup
      open={open}
      onClose={handleClose}
      title={LABELS.title}
      onConfirm={handleSubmit}
      confirmButtonText={BUTTONS.submit}
      cancelButtonText={BUTTONS.cancel}
    >
      <Typography variant="body1" gutterBottom>
        {LABELS.description}
      </Typography>

      <GridMultipleAutocomplete
        multiple
        value={selectedSigners}
        onChange={handleChange}
        fullWidth
        selectorData={{
          label: LABELS.autocompleteLabel,
          accessorId: "signers",
          options: userOptions,
        }}
        sx={{ minWidth: 250 }}
      />
    </GenericPopup>
  );
};

export default SelectSignersPopup;
