import {
  Box,
  Typography,
  Divider,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import { useGetHomeAnnouncements } from "../../../../hooks/home/homeHooks";
import {
  BULLETIN_TITLE,
  BULLETIN_NO_ANNOUNCEMENTS,
  BULLETIN_DATE_FORMAT_OPTIONS,
  BULLETIN_PENDING_SIGNATURES_TEXT,
  BULLETIN_PENDING_SIGNATURES_BUTTON,
} from "./constants";
import { useGetPendingSignatures } from "../../../../hooks/signatures/signaturesHooks";
import { useUser } from "../../../../hooks/auth/authsHooks";
import { useNavigate } from "react-router-dom";

export const BulletinBoard = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const { data: announcements = [], isLoading } = useGetHomeAnnouncements();
  const { data: pendingSignatures = [] } = useGetPendingSignatures(user?.id);

  const handleGoToDocuments = () => {
    navigate("/pending-signature");
  };

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

      {pendingSignatures.length > 0 && (
        <Box
          sx={{
            backgroundColor: "#fdecea",
            border: "1px solid #f44336",
            borderRadius: 1,
            p: 1.5,
            mb: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", color: "#c62828", mb: 1 }}
          >
            {BULLETIN_PENDING_SIGNATURES_TEXT}
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            size="small"
            onClick={handleGoToDocuments}
            sx={{
              color: "#c62828",
              borderColor: "#c62828",
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            {BULLETIN_PENDING_SIGNATURES_BUTTON}
          </Button>
        </Box>
      )}

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
