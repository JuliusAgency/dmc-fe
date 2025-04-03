import { TextField } from "@mui/material";
import { useState } from "react";
import { GenericPopup } from "../../../../components/genericPopup/genericPopup";
import { useSendMail } from "../../../../hooks/mail/mailHooks";
import { useSendReport } from "../../../../hooks/report/reportHooks";
import {
  snackBarError,
  snackBarSuccess,
} from "../../../../components/toast/Toast";
import {
  REPORT_DIALOG_TITLE,
  REPORT_PLACEHOLDER,
  REPORT_CANCEL_BUTTON,
  REPORT_SEND_BUTTON,
  REPORT_SUCCESS,
  REPORT_FAILURE,
  REPORT_NO_EMAIL,
} from "./constants";
import { ReportIssuePopupProps } from "./types";
import {
  REPORT_ISSUE_SUBJECT,
  getReportIssueText,
} from "../../../../templates/mail.templates";

export const ReportIssuePopup = ({
  open,
  onClose,
  document,
}: ReportIssuePopupProps) => {
  const [message, setMessage] = useState("");
  const sendMailMutation = useSendMail();
  const sendReportMutation = useSendReport();

  const isLoading = sendMailMutation.isPending || sendReportMutation.isLoading;

  const handleSubmitReport = async () => {
    if (!document?.processOwner?.email) {
      snackBarError(REPORT_NO_EMAIL);
      return;
    }

    try {
      await sendReportMutation.mutateAsync({
        documentId: document.id,
        revision: Number(document.revision),
        reporterName: document.updatedBy || "Unknown",
        message,
      });

      await sendMailMutation.mutateAsync({
        to: document.processOwner.email,
        subject: REPORT_ISSUE_SUBJECT(document.id),
        text: getReportIssueText(message),
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
    <GenericPopup
      open={open}
      onClose={onClose}
      title={REPORT_DIALOG_TITLE}
      onConfirm={handleSubmitReport}
      confirmButtonText={REPORT_SEND_BUTTON}
      cancelButtonText={REPORT_CANCEL_BUTTON}
      disabledConfirm={!message.trim()}
      loading={isLoading}
    >
      <TextField
        fullWidth
        multiline
        minRows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={REPORT_PLACEHOLDER}
      />
    </GenericPopup>
  );
};
