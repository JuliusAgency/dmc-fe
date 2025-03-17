import { Grid, TextField, SxProps } from "@mui/material";

interface Props {
  label: string;
  gridSize?: number;
  gridSizeXL?: number;
  onChange?: (newValue: string) => void;
  onBlur?: (newValue: string) => void;
  validator?: (newValue: string) => boolean;
  value?: string;
  readOnly?: boolean;
  size?: "small" | "medium";
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  type?: "text" | "number"; // Add type property to the Props interface
  defaultValue?: number | string;
  outlined?: boolean;
  sx?: SxProps;
}

const GridInput = ({
  label,
  gridSize = 2,
  gridSizeXL = 2,
  onChange = () => {},
  onBlur,
  validator = () => true,
  value,
  readOnly = false,
  size,
  disabled = false,
  required = false,
  fullWidth = false,
  type = "text",
  defaultValue,
  outlined = false,
  sx = {},
}: Props) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // If the type is "number," filter out non-numeric characters
    if (type === "number") {
      const numericValue = e.target.value.replace(/[^0-9]/g, "");
      onChange(numericValue);
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <Grid item md={gridSize} xl={gridSizeXL} xs={gridSize} container>
      <TextField
        variant={outlined ? "standard" : "outlined"}
        fullWidth={fullWidth}
        required={required}
        defaultValue={defaultValue}
        value={value}
        size={size}
        onChange={onBlur ? undefined : handleInputChange}
        onBlur={(e) => {
          onChange(e.target.value);
        }}
        label={label}
        error={!validator(value!)}
        disabled={disabled}
        InputProps={{
          readOnly: readOnly,
        }}
        type={type} // Pass the type to the TextField
        sx={sx}
      />
    </Grid>
  );
};

export default GridInput;
