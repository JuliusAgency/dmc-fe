import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";
import { useSendMail } from "../../../../hooks/mail/mailHooks";
import { useSendReport } from "../../../../hooks/report/reportHooks";
import {
  snackBarError,
  snackBarSuccess,
} from "../../../../components/toast/Toast";
import { DocumentType } from "../../../../api/documentAPI/types";
import {
  REPORT_DIALOG_TITLE,
  REPORT_PLACEHOLDER,
  REPORT_CANCEL_BUTTON,
  REPORT_SEND_BUTTON,
  REPORT_SUCCESS,
  REPORT_FAILURE,
  REPORT_NO_EMAIL,
} from "./constants";
import { Props } from "./types";

export const ReportIssuePopup = ({ open, onClose, document }: Props) => {
  const [message, setMessage] = useState("");
  const sendMailMutation = useSendMail();
  const sendReportMutation = useSendReport();

  const clientBaseUrl = import.meta.env.VITE_CLIENT_BASE_URL;

  const handleSubmitReport = async () => {
    if (!document?.processOwner?.email) {
      snackBarError(REPORT_NO_EMAIL);
      return;
    }

    const mailText = `${message}

View all reports here:
${clientBaseUrl}/reports`;

    try {
      await sendReportMutation.mutateAsync({
        documentId: document.id,
        revision: Number(document.revision),
        reporterName: document.updatedBy || "Unknown",
        message,
      });

      await sendMailMutation.mutateAsync({
        to: document.processOwner.email,
        subject: `Issue Reported for Document #${document.id}`,
        text: mailText,
        from: "noreply@dms-system.local",
      });

      snackBarSuccess(REPORT_SUCCESS);
      setMessage("");
      onClose();
    } catch (error) {
      snackBarError(REPORT_FAILURE);
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{REPORT_DIALOG_TITLE}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          minRows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={REPORT_PLACEHOLDER}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{REPORT_CANCEL_BUTTON}</Button>
        <Button
          onClick={handleSubmitReport}
          variant="contained"
          disabled={!message.trim()}
        >
          {REPORT_SEND_BUTTON}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
