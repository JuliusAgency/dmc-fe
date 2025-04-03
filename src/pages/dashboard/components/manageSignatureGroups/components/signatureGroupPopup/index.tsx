import {
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  Checkbox,
} from "@mui/material";
import { useState, useEffect } from "react";
import { GenericPopup } from "../../../../../../components/genericPopup/genericPopup";
import {
  CREATE_GROUP_POPUP_TITLE,
  EDIT_GROUP_POPUP_TITLE,
  GROUP_NAME_LABEL,
  GROUP_USERS_LABEL,
  SAVE_BUTTON,
  CANCEL_BUTTON,
} from "./constants";
import { Props } from "./types";

export const SignatureGroupPopup = ({
  open,
  onClose,
  onSave,
  users,
  editMode,
  group,
}: Props) => {
  const [name, setName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  useEffect(() => {
    if (editMode && group) {
      setName(group.name);
      setSelectedUsers(group.users.map((u: any) => Number(u.id)));
    } else {
      setName("");
      setSelectedUsers([]);
    }
  }, [group, editMode]);

  const toggleUser = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <GenericPopup
      open={open}
      onClose={onClose}
      title={editMode ? EDIT_GROUP_POPUP_TITLE : CREATE_GROUP_POPUP_TITLE}
      onConfirm={() => onSave(name, selectedUsers)}
      confirmButtonText={SAVE_BUTTON}
      cancelButtonText={CANCEL_BUTTON}
    >
      <TextField
        label={GROUP_NAME_LABEL}
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Typography sx={{ mb: 1 }}>{GROUP_USERS_LABEL}</Typography>
      <List>
        {users.map((user) => (
          <ListItem
            key={user.id}
            secondaryAction={
              <Checkbox
                edge="end"
                checked={selectedUsers.includes(Number(user.id))}
                onChange={() => toggleUser(Number(user.id))}
              />
            }
          >
            <ListItemText primary={user.email} />
          </ListItem>
        ))}
      </List>
    </GenericPopup>
  );
};
