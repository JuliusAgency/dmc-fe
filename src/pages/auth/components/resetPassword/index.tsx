import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import {
  RESET_PASSWORD_TITLE,
  RESET_PASSWORD_LABEL,
  RESET_PASSWORD_BUTTON,
  RESET_PASSWORD_ERROR,
} from "./constants";
import { snackBarError } from "../../../../components/toast/Toast.tsx";
import { useResetPassword } from "../../../../hooks/user/userHooks.ts";

export const ResetPasswordPage = () => {
  const [params] = useSearchParams();
  const email = params.get("email") || "";
  const [password, setPassword] = useState("");

  const resetPasswordMutation = useResetPassword();

  const handleSubmit = () => {
    if (!email) {
      snackBarError(RESET_PASSWORD_ERROR);
      return;
    }

    resetPasswordMutation.mutate({ email: email, newPassword: password });
  };
  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        {RESET_PASSWORD_TITLE(email)}
      </Typography>
      <TextField
        fullWidth
        label={RESET_PASSWORD_LABEL}
        type="password"
        sx={{ mt: 2 }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSubmit}
      >
        {RESET_PASSWORD_BUTTON}
      </Button>
    </Box>
  );
};
