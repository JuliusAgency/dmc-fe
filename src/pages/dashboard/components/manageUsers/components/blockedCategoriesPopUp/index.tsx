import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { GenericPopup } from "../../../../../../components/genericPopup/genericPopup";
import {
  BLOCKED_CATEGORIES_TITLE,
  BLOCKED_CATEGORIES_LABEL,
  CANCEL_BUTTON,
  SAVE_BUTTON,
  BLOCKED_TEXT,
  ALLOWED_TEXT,
  MAX_HEIGHT,
} from "./constants";
import { BlockedCategoriesPopupProps } from "./types";

export const BlockedCategoriesPopup = ({
  open,
  onClose,
  onConfirm,
  selectedCategories,
  setSelectedCategories,
  topLevelCategories,
  email,
}: BlockedCategoriesPopupProps) => {
  const handleChange = (e: any) => {
    const value = e.target.value;
    setSelectedCategories(
      typeof value === "string" ? value.split(",").map(Number) : value
    );
  };

  const renderSelected = (selected: number[]) =>
    topLevelCategories
      .filter((cat) => selected.includes(cat.id))
      .map((cat) => cat.name)
      .join(", ");

  const renderMenuItem = (catId: number, catName: string, checked: boolean) => (
    <MenuItem key={catId} value={catId}>
      <Checkbox checked={checked} />
      <ListItemText
        primary={catName}
        secondary={checked ? BLOCKED_TEXT : ALLOWED_TEXT}
      />
    </MenuItem>
  );

  return (
    <GenericPopup
      open={open}
      onClose={onClose}
      title={`${BLOCKED_CATEGORIES_TITLE} ${email || ""}`}
      onConfirm={onConfirm}
      confirmButtonText={SAVE_BUTTON}
      cancelButtonText={CANCEL_BUTTON}
    >
      <FormControl fullWidth>
        <InputLabel id="blocked-categories-label">
          {BLOCKED_CATEGORIES_LABEL}
        </InputLabel>
        <Select
          labelId="blocked-categories-label"
          multiple
          value={selectedCategories}
          onChange={handleChange}
          renderValue={renderSelected}
          MenuProps={{ PaperProps: { style: { maxHeight: MAX_HEIGHT } } }}
        >
          {topLevelCategories.map((cat) =>
            renderMenuItem(
              cat.id,
              cat.name,
              selectedCategories.includes(cat.id)
            )
          )}
        </Select>
      </FormControl>
    </GenericPopup>
  );
};
