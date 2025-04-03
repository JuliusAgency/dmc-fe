import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Divider,
} from "@mui/material";
import { SxProps } from "@mui/material";

type InfoItem = {
  label: string;
  value: string | number | React.ReactNode;
};

type ActionButton = {
  label: string;
  onClick: () => void;
  color?: "primary" | "secondary" | "error" | "success" | "info" | "warning";
  variant?: "text" | "outlined" | "contained";
  disabled?: boolean;
  icon?: React.ReactNode;
};

type GenericCardProps = {
  title: string;
  infoItems?: InfoItem[];
  actions?: ActionButton[];
  bottomContent?: React.ReactNode;
  sx?: SxProps;
};

export const GenericCard = ({
  title,
  infoItems = [],
  actions = [],
  bottomContent,
  sx,
}: GenericCardProps) => {
  return (
    <Card sx={{ p: 2, boxShadow: 3, ...sx }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>

        {infoItems.map((item, index) => (
          <Typography key={index} variant="body2" padding={0.5}>
            <strong>{item.label}:</strong> {item.value}
          </Typography>
        ))}

        {actions.length > 0 && (
          <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || "outlined"}
                color={action.color || "primary"}
                onClick={action.onClick}
                disabled={action.disabled}
                startIcon={action.icon}
              >
                {action.label}
              </Button>
            ))}
          </Box>
        )}

        {bottomContent && (
          <>
            <Divider sx={{ my: 2 }} />
            {bottomContent}
          </>
        )}
      </CardContent>
    </Card>
  );
};
