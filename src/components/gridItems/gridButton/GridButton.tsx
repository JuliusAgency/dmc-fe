import { Button, Grid, Tooltip, SxProps } from "@mui/material";

interface Props {
  buttonText: string;
  gridSize?: number;
  onClick?: any;
  variant?: "text" | "contained" | "outlined";
  disabled?: boolean;
  showTooltip?: boolean;
  tooltipMessage?: string;
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  sx?: SxProps;
}

const GridButton = ({
  buttonText,
  gridSize = 3,
  onClick = () => {},
  variant,
  disabled = false,
  showTooltip = false,
  tooltipMessage,
  type = "button",
  fullWidth = false,
  sx = {},
}: Props) => (
  <Grid item xs={gridSize} alignSelf={"center"}>
    <Tooltip title={showTooltip ? tooltipMessage : ""} placement="top">
      <span>
        <Button
          variant={variant}
          onClick={onClick}
          disabled={disabled}
          type={type}
          fullWidth={fullWidth}
          sx={sx}
        >
          {buttonText}
        </Button>
      </span>
    </Tooltip>
  </Grid>
);

export default GridButton;
