import { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import {
  CATEGORY_LABEL,
  NEW_CATEGORY_LABEL,
  ADD_CATEGORY_BUTTON,
  TAG_LABEL,
  NEW_TAG_LABEL,
  ADD_TAG_BUTTON,
} from "./constants";

export const CategoryForm = ({
  onSubmit,
}: {
  onSubmit: (name: string) => void;
}) => {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (name) {
      onSubmit(name);
      setName("");
    }
  };

  return (
    <>
      <Typography variant="body1" sx={{ mb: 2, fontSize: "0.9rem" }}>
        {CATEGORY_LABEL}
      </Typography>
      <TextField
        label={NEW_CATEGORY_LABEL}
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        sx={{ mb: 2, fontSize: "0.9rem" }}
      />
      <Button variant="contained" onClick={handleSubmit} fullWidth>
        {ADD_CATEGORY_BUTTON}
      </Button>
    </>
  );
};

export const TagForm = ({ onSubmit }: { onSubmit: (name: string) => void }) => {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (name) {
      onSubmit(name);
      setName("");
    }
  };

  return (
    <>
      <Typography variant="body1" sx={{ mb: 2, fontSize: "0.9rem" }}>
        {TAG_LABEL}
      </Typography>
      <TextField
        label={NEW_TAG_LABEL}
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        sx={{ mb: 2, fontSize: "0.9rem" }}
      />
      <Button variant="contained" onClick={handleSubmit} fullWidth>
        {ADD_TAG_BUTTON}
      </Button>
    </>
  );
};
