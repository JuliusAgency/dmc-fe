import { CONFIG } from "../consts/config";

export const RESET_PASSWORD_SUBJECT = "Reset your password";

export const getResetPasswordText = (email: string) => {
  return (
    `Hi,\n` +
    `To reset your password, please click the link below:\n` +
    `http://10.186.78.92:5173/reset-password?email=${encodeURIComponent(email)}`
  );
};

export const REPORT_ISSUE_SUBJECT = (docId: number) =>
  `Issue Reported for Document #${docId}`;

export const getReportIssueText = (message: string) => {
  return (
    `${message}\n\n` +
    `View all reports here:\n` +
    `http://10.186.78.92:5173/reports`
  );
};
