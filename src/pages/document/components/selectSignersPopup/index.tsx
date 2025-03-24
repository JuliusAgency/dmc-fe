import { useState, useMemo } from "react";
import { Typography } from "@mui/material";
import { GridMultipleAutocomplete } from "../../../../components/gridItems/gridMultipleAutocomplete/GridMultipleAutocomplete.tsx";
import {
  snackBarError,
  snackBarSuccess,
} from "../../../../components/toast/Toast.tsx";
import { useGetUsers } from "../../../../hooks/user/userHooks.ts";
import { useAddSignersToDocument } from "../../../../hooks/signatures/signaturesHooks.ts";
import { GenericPopup } from "../../../../components/genericPopup/genericPopup.tsx";
import { LABELS, BUTTONS, MESSAGES } from "./constants";
import { SelectSignersPopupProps } from "./types";
import { useGetAllSignatureGroups } from "../../../../hooks/signatures/signatureGroupsHook";
import { Option } from "./types.ts";

export const SelectSignersPopup = ({
  open,
  onClose,
  documentId,
  refetch,
}: SelectSignersPopupProps) => {
  const { data: users } = useGetUsers();
  const addSignersMutation = useAddSignersToDocument();
  const { data: signatureGroups } = useGetAllSignatureGroups();

  const [selectedSigners, setSelectedSigners] = useState<Option[]>([]);

  const combinedOptions = useMemo<Option[]>(() => {
    const userOpts =
      users?.map((user: any) => ({
        id: user.id,
        name: user.email,
        type: "user" as const,
        typeId: `user-${user.id}`,
        originalId: user.id,
      })) || [];

    const groupOpts =
      signatureGroups?.map((group: any) => ({
        id: group.id,
        name: `[Group] ${group.name}`,
        type: "group" as const,
        typeId: `group-${group.id}`,
        users: group.users,
      })) || [];

    return [...userOpts, ...groupOpts];
  }, [users, signatureGroups]);

  const handleChange = (value: Option | Option[]) => {
    setSelectedSigners(Array.isArray(value) ? value : [value]);
  };

  const handleSubmit = async () => {
    if (!documentId || selectedSigners.length === 0) {
      snackBarError(MESSAGES.errorNoSigners);
      return;
    }

    const userIds = selectedSigners.flatMap((item) => {
      if (item.type === "user" && typeof item.originalId === "number") {
        return [item.originalId];
      }

      if (item.type === "group" && item.users?.length) {
        return item.users.map((u) => u.id);
      }

      return [];
    });

    const uniqueUserIds = Array.from(new Set(userIds));

    try {
      await addSignersMutation.mutateAsync({
        documentId,
        userIds: uniqueUserIds,
      });

      snackBarSuccess(MESSAGES.successSendSigners);
      handleClose();
      refetch();
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
          options: combinedOptions,
        }}
        sx={{ minWidth: 250 }}
      />
    </GenericPopup>
  );
};
