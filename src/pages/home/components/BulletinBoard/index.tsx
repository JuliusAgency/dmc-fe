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
  BULLETIN_PENDING_REPORTS_TEXT,
  BULLETIN_PENDING_REPORTS_BUTTON,
} from "./constants";
import { useGetPendingSignatures } from "../../../../hooks/signatures/signaturesHooks";
import { useGetMyReports } from "../../../../hooks/report/reportHooks";
import { useUser } from "../../../../hooks/auth/authsHooks";
import { useNavigate } from "react-router-dom";
import { WarningBox } from "../../../../components/warningBox/warningBox";

export const BulletinBoard = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const { data: announcements = [], isLoading } = useGetHomeAnnouncements();
  const { data: pendingSignatures = [] } = useGetPendingSignatures(user?.id);
  const { data: reports = [] } = useGetMyReports();

  const handleGoToSignatures = () => {
    navigate("/pending-signature");
  };

  const handleGoToReports = () => {
    navigate("/reports");
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
        <WarningBox
          text={BULLETIN_PENDING_SIGNATURES_TEXT}
          buttonText={BULLETIN_PENDING_SIGNATURES_BUTTON}
          onClick={handleGoToSignatures}
        />
      )}

      {reports.length > 0 && (
        <WarningBox
          text={BULLETIN_PENDING_REPORTS_TEXT}
          buttonText={BULLETIN_PENDING_REPORTS_BUTTON}
          onClick={handleGoToReports}
        />
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
