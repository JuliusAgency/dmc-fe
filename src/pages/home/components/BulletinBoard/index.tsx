import { useGetHomeAnnouncements } from "../../../../hooks/home/homeHooks";
import {
  BULLETIN_TITLE,
  BULLETIN_NO_ANNOUNCEMENTS,
  BULLETIN_DATE_FORMAT_OPTIONS,
} from "./constants";
import {
  Box,
  Typography,
  Divider,
  Paper,
  CircularProgress,
} from "@mui/material";

export const BulletinBoard = () => {
  const { data: announcements = [], isLoading } = useGetHomeAnnouncements();

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        width: 300,
        backgroundColor: "#e3f2fd",
        border: "1px dashed #2196f3",
        borderRadius: 2,
        maxHeight: 400,
        overflowY: "auto",
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: "#1976d2" }}>
        {BULLETIN_TITLE}
      </Typography>
      <Divider sx={{ mb: 1, borderColor: "#90caf9" }} />

      {isLoading ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress size={20} />
        </Box>
      ) : announcements.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {BULLETIN_NO_ANNOUNCEMENTS}
        </Typography>
      ) : (
        announcements.map((ann) => (
          <Box key={ann.id} sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              • {ann.text}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(ann.createdAt).toLocaleDateString(
                "en-US",
                BULLETIN_DATE_FORMAT_OPTIONS
              )}
            </Typography>
            <Divider sx={{ my: 1, borderColor: "#bbdefb" }} />
          </Box>
        ))
      )}
    </Paper>
  );
};
