import { TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { GenericPopup } from "../../../../components/genericPopup/genericPopup";

interface NotePopupProps {
  open: boolean;
  onClose: () => void;
  onSave?: (text: string) => void;
  title: string;
  initialValue?: string;
  editable?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  loading?: boolean;
}

export const NotePopup = ({
  open,
  onClose,
  onSave,
  title,
  initialValue = "",
  editable = false,
  confirmButtonText = "Save",
  cancelButtonText = "Close",
  loading = false,
}: NotePopupProps) => {
  const [text, setText] = useState(initialValue);

  useEffect(() => {
    setText(initialValue);
  }, [initialValue]);

  const handleSave = () => {
    if (editable && onSave) {
      onSave(text.trim());
    }
  };

  return (
    <GenericPopup
      open={open}
      onClose={onClose}
      title={title}
      onConfirm={editable ? handleSave : undefined}
      confirmButtonText={editable ? confirmButtonText : undefined}
      cancelButtonText={cancelButtonText}
      disabledConfirm={editable && !text.trim()}
      loading={loading}
    >
      <TextField
        fullWidth
        multiline
        rows={editable ? 4 : 6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={editable ? "Enter your note..." : ""}
        InputProps={{
          readOnly: !editable,
        }}
      />
    </GenericPopup>
  );
};
