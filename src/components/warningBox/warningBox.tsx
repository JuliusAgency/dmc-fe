import { Box, Typography, Button } from "@mui/material";

export const WarningBox = ({
  text,
  buttonText,
  onClick,
  color = "#fdecea",
  borderColor = "#f44336",
  textColor = "#c62828",
}: {
  text: string;
  buttonText: string;
  onClick: () => void;
  color?: string;
  borderColor?: string;
  textColor?: string;
}) => (
  <Box
    sx={{
      backgroundColor: color,
      border: `1px solid ${borderColor}`,
      borderRadius: 1,
      p: 1.5,
      mb: 2,
    }}
  >
    <Typography
      variant="body2"
      sx={{ fontWeight: "bold", color: textColor, mb: 1 }}
    >
      {text}
    </Typography>
    <Button
      variant="outlined"
      fullWidth
      size="small"
      onClick={onClick}
      sx={{
        color: textColor,
        borderColor: textColor,
        textTransform: "none",
        fontWeight: 500,
      }}
    >
      {buttonText}
    </Button>
  </Box>
);
