import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
} from "@mui/material";
import {
  useGetAllSignatureGroups,
  useCreateSignatureGroup,
  useUpdateSignatureGroup,
  useDeleteSignatureGroup,
} from "../../../../hooks/signatures/signatureGroupsHook";
import { useGetUsers } from "../../../../hooks/user/userHooks";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { GenericPopup } from "../../../../components/genericPopup/genericPopup";
import {
  SIGNATURE_GROUPS_TITLE,
  CREATE_GROUP_TITLE,
  GROUP_NAME_LABEL,
  GROUP_USERS_LABEL,
  SAVE_BUTTON,
  CANCEL_BUTTON,
  ADD_GROUP_BUTTON,
  USERS_COLUMN_LABEL,
  NAME_COLUMN_LABEL,
  EDIT_GROUP_TITLE,
} from "./constants";

export const ManageSignatureGroups = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<number | null>(null);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const { data: groups = [], isLoading } = useGetAllSignatureGroups();
  const { data: users = [] } = useGetUsers();

  const createGroup = useCreateSignatureGroup();
  const updateGroup = useUpdateSignatureGroup();
  const deleteGroup = useDeleteSignatureGroup();

  const openCreateDialog = () => {
    setDialogOpen(true);
    setEditMode(false);
    setEditingGroupId(null);
    setGroupName("");
    setSelectedUsers([]);
  };

  const openEditDialog = (group: any) => {
    setDialogOpen(true);
    setEditMode(true);
    setEditingGroupId(group.id);
    setGroupName(group.name);
    setSelectedUsers(group.users.map((u: any) => u.id));
  };

  const handleSave = () => {
    const payload = { name: groupName, userIds: selectedUsers };

    if (editMode && editingGroupId !== null) {
      updateGroup.mutate({ id: editingGroupId, group: payload });
    } else {
      createGroup.mutate(payload);
    }

    setDialogOpen(false);
  };

  const handleToggleUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <Container sx={{ direction: "ltr", textAlign: "left" }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        {SIGNATURE_GROUPS_TITLE}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={openCreateDialog}>
          {ADD_GROUP_BUTTON}
        </Button>
      </Box>

      {!isLoading &&
        groups.map((group) => (
          <Box
            key={group.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #ccc",
              borderRadius: 2,
              padding: 2,
              mb: 1,
            }}
          >
            <Box>
              <Typography fontWeight="bold">
                {NAME_COLUMN_LABEL}: {group.name}
              </Typography>
              <Typography variant="body2">
                {USERS_COLUMN_LABEL}:{" "}
                {group.users.map((u) => u.email).join(", ") || "—"}
              </Typography>
            </Box>
            <Box>
              <IconButton onClick={() => openEditDialog(group)}>
                <EditIcon sx={{ color: "orange" }} />
              </IconButton>
              <IconButton onClick={() => deleteGroup.mutate(group.id)}>
                <DeleteIcon sx={{ color: "red" }} />
              </IconButton>
            </Box>
          </Box>
        ))}

      <GenericPopup
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={editMode ? EDIT_GROUP_TITLE : CREATE_GROUP_TITLE}
        onConfirm={handleSave}
        confirmButtonText={SAVE_BUTTON}
        cancelButtonText={CANCEL_BUTTON}
      >
        <TextField
          label={GROUP_NAME_LABEL}
          fullWidth
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Typography sx={{ mb: 1 }}>{GROUP_USERS_LABEL}</Typography>
        <List>
          {users.map((user: any) => (
            <ListItem
              key={user.id}
              secondaryAction={
                <Checkbox
                  edge="end"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleToggleUser(user.id)}
                />
              }
            >
              <ListItemText primary={user.email} />
            </ListItem>
          ))}
        </List>
      </GenericPopup>
    </Container>
  );
};
