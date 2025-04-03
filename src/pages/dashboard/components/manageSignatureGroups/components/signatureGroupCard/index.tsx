import { Box, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { NAME_COLUMN_LABEL, USERS_COLUMN_LABEL } from "./constants";
import { Props } from "./types";

export const SignatureGroupCard = ({ group, onEdit, onDelete }: Props) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      border: "1px solid #ccc",
      borderRadius: 2,
      p: 2,
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
      <IconButton onClick={() => onEdit(group)}>
        <EditIcon sx={{ color: "orange" }} />
      </IconButton>
      <IconButton onClick={() => onDelete(group.id)}>
        <DeleteIcon sx={{ color: "red" }} />
      </IconButton>
    </Box>
  </Box>
);
