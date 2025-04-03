import { Container, Typography, Button, Box } from "@mui/material";
import { useState } from "react";
import { SignatureGroupCard } from "./components/signatureGroupCard";
import { SignatureGroupPopup } from "./components/signatureGroupPopup";
import {
  useGetAllSignatureGroups,
  useCreateSignatureGroup,
  useUpdateSignatureGroup,
  useDeleteSignatureGroup,
} from "../../../../hooks/signatures/signatureGroupsHook";
import { useGetUsers } from "../../../../hooks/user/userHooks";
import { SIGNATURE_GROUPS_TITLE, ADD_GROUP_BUTTON } from "./constants";
import { SignatureGroup } from "./types";

export const ManageSignatureGroups = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingGroup, setEditingGroup] = useState<SignatureGroup | null>(null);

  const { data: groups = [], isLoading } = useGetAllSignatureGroups();
  const { data: users = [] } = useGetUsers();

  const createGroup = useCreateSignatureGroup();
  const updateGroup = useUpdateSignatureGroup();
  const deleteGroup = useDeleteSignatureGroup();

  const handleOpenPopup = (group?: SignatureGroup) => {
    setPopupOpen(true);
    setEditMode(!!group);
    setEditingGroup(group ?? null);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setEditingGroup(null);
  };

  const handleSave = (name: string, userIds: number[]) => {
    const payload = { name, userIds };
    if (editMode && editingGroup) {
      updateGroup.mutate({ id: editingGroup.id, group: payload });
    } else {
      createGroup.mutate(payload);
    }
    handleClosePopup();
  };

  return (
    <Container sx={{ direction: "ltr", textAlign: "left" }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {SIGNATURE_GROUPS_TITLE}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => handleOpenPopup()}>
          {ADD_GROUP_BUTTON}
        </Button>
      </Box>

      {!isLoading &&
        groups.map((group) => (
          <SignatureGroupCard
            key={group.id}
            group={group}
            onEdit={handleOpenPopup}
            onDelete={(id) => deleteGroup.mutate(id)}
          />
        ))}

      <SignatureGroupPopup
        open={popupOpen}
        onClose={handleClosePopup}
        onSave={handleSave}
        users={users}
        editMode={editMode}
        group={editingGroup}
      />
    </Container>
  );
};
