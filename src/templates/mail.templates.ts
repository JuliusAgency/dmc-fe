export const RESET_PASSWORD_SUBJECT = "Reset your password";

export const getResetPasswordText = (email: string) => {
  return (
    `Hi,\n` +
    `To reset your password, please click the link below:\n` +
    `http://localhost:5173/reset-password?email=${encodeURIComponent(email)}`
  );
};
