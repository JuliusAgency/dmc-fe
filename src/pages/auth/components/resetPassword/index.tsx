import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const email = params.get("email") || "";
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    alert(`Resetting password for ${email} to: ${password}`);
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Reset password for {email}
      </Typography>
      <TextField
        fullWidth
        label="New Password"
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
        Update Password
      </Button>
    </Box>
  );
}
