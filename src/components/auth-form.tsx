import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { register, login } from "../api";
import { AuthFormProps, AuthData } from "../types";

export default function AuthForm({ type, onSuccess }: AuthFormProps) {
  const isLogin = type === "login";
  const formik = useFormik<AuthData>({
    initialValues: {
      email: "",
      password: "",
      ...(isLogin ? {} : { name: "" }),
    },
    validationSchema: Yup.object({
      name: isLogin ? Yup.string() : Yup.string().required("שם חובה"),
      email: Yup.string().email("מייל לא תקין").required("מייל חובה"),
      password: Yup.string().min(6, "לפחות 6 תווים").required("סיסמה חובה"),
    }),
    onSubmit: async (values) => {
      try {
        if (isLogin) {
          await login(values);
        } else {
          await register(values);
        }
        onSuccess();
      } catch (error: any) {
        alert(error.response?.data?.message || "שגיאה");
      }
    },
  });

  return (
    <Container maxWidth="xs">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 5 }}>
        <Typography variant="h5">{isLogin ? "התחברות" : "הרשמה"}</Typography>
        {!isLogin && (
          <TextField
            label="שם מלא"
            {...formik.getFieldProps("name")}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        )}
        <TextField
          label="אימייל"
          {...formik.getFieldProps("email")}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          label="סיסמה"
          type="password"
          {...formik.getFieldProps("password")}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button variant="contained" onClick={() => formik.handleSubmit()}>
          {isLogin ? "התחבר" : "הרשם"}
        </Button>
      </Box>
    </Container>
  );
}
