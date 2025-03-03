import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { login } from "../api";
import { AuthFormProps, AuthData } from "../types";
import { useDispatch } from "react-redux";
import { setUser } from "../actions/userActions";

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const dispatch = useDispatch();

  const formik = useFormik<AuthData>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("מייל לא תקין").required("מייל חובה"),
      password: Yup.string().min(6, "לפחות 6 תווים").required("סיסמה חובה"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await login(values);
        dispatch(setUser(response.user));
        onSuccess();
      } catch (error: any) {
        alert(error.response?.data?.message || "שגיאה");
      }
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: 2,
        backgroundColor: "#f4f4f9",
      }}
    >
      <Container maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            mt: 5,
            p: 4,
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: "bold", mb: 3 }}
          >
            התחברות
          </Typography>

          <TextField
            label="אימייל"
            {...formik.getFieldProps("email")}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="סיסמה"
            type="password"
            {...formik.getFieldProps("password")}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            variant="outlined"
            fullWidth
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            onClick={() => formik.handleSubmit()}
            fullWidth
            sx={{ bgcolor: "#1976d2", "&:hover": { bgcolor: "#1565c0" } }}
          >
            התחבר
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
