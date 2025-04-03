import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLogin } from "../../hooks/auth/authsHooks";
import { AuthFormProps, AuthData } from "../../api/authAPI/types";
import { useDispatch } from "react-redux";
import { setUser } from "../../actions/userActions";
import { useSendMail } from "../../hooks/mail/mailHooks";
import { useNavigate } from "react-router-dom";
import {
  AUTH_FORM_TITLE,
  EMAIL_LABEL,
  PASSWORD_LABEL,
  EMAIL_REQUIRED_ERROR,
  INVALID_EMAIL_ERROR,
  PASSWORD_REQUIRED_ERROR,
  PASSWORD_MIN_LENGTH_ERROR,
  LOGIN_BUTTON_TEXT,
  LOGIN_ERROR_MESSAGE,
  FORGOT_PASSWORD_TEXT,
  FORGOT_PASSWORD_INVALID_EMAIL,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAILURE,
  LOGIN_CONTAINER_STYLES,
  FORM_BOX_STYLES,
  BUTTON_STYLES,
} from "./constants";
import {
  snackBarError,
  snackBarSuccess,
} from "../../components/toast/Toast.tsx";
import {
  RESET_PASSWORD_SUBJECT,
  getResetPasswordText,
} from "../../templates/mail.templates";

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sendMailMutation = useSendMail();
  const loginMutation = useLogin();

  const formik = useFormik<AuthData & { rememberMe: boolean }>({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
      blockedCategoryIds: [],
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(INVALID_EMAIL_ERROR)
        .required(EMAIL_REQUIRED_ERROR),
      password: Yup.string()
        .min(6, PASSWORD_MIN_LENGTH_ERROR)
        .required(PASSWORD_REQUIRED_ERROR),
    }),
    onSubmit: async (values) => {
      loginMutation.mutate(values, {
        onSuccess: (response: any) => {
          dispatch(setUser(response.user));
          localStorage.setItem("user", JSON.stringify(response.user));
          onSuccess();
          navigate("/home");
        },
        onError: (error: any) => {
          snackBarError(error?.response?.data?.message || LOGIN_ERROR_MESSAGE);
        },
      });
    },
  });

  const handleForgotPassword = () => {
    const email = formik.values.email;

    if (!email || !formik.values.email.includes("@")) {
      snackBarError(FORGOT_PASSWORD_INVALID_EMAIL);
      return;
    }

    sendMailMutation.mutate(
      {
        to: email,
        subject: RESET_PASSWORD_SUBJECT,
        text: getResetPasswordText(email),
        from: "noreply@company.local",
      },
      {
        onSuccess: () => {
          snackBarSuccess(FORGOT_PASSWORD_SUCCESS);
        },
        onError: (error: any) => {
          snackBarError(error?.message || FORGOT_PASSWORD_FAILURE);
          console.error(error);
        },
      }
    );
  };

  return (
    <Box sx={LOGIN_CONTAINER_STYLES}>
      <Container maxWidth="xs">
        <Box sx={FORM_BOX_STYLES}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <img
              src="/images/home.png"
              alt="Logo"
              style={{
                height: "200px",
                objectFit: "contain",
              }}
            />
          </Box>

          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: "bold", mb: 3 }}
          >
            {AUTH_FORM_TITLE}
          </Typography>

          <TextField
            label={EMAIL_LABEL}
            {...formik.getFieldProps("email")}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            label={PASSWORD_LABEL}
            type="password"
            {...formik.getFieldProps("password")}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            variant="outlined"
            fullWidth
            sx={{ mb: 3 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.rememberMe}
                onChange={formik.handleChange}
                name="rememberMe"
                color="primary"
              />
            }
            label="Remember me"
          />

          <Button
            variant="contained"
            onClick={() => formik.handleSubmit()}
            fullWidth
            sx={BUTTON_STYLES}
          >
            {LOGIN_BUTTON_TEXT}
          </Button>

          <Button
            variant="text"
            onClick={handleForgotPassword}
            fullWidth
            sx={{ mt: 1, textTransform: "none" }}
          >
            {FORGOT_PASSWORD_TEXT}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
