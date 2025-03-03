import { Routes, Route } from "react-router-dom";
import AuthForm from "./components/auth-form";
import Dashboard from "./pages/dashboard/dashboard.tsx";
import { Document } from "./pages/document";
import { WithTheme } from "../theme/Theme.tsx";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/");
  };

  return (
    <WithTheme>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale={"he"}
        localeText={{
          start: "התחלה",
          end: "סיום",
          nextMonth: "חודש הבא",
          previousMonth: "חודש קודם",
          clearButtonLabel: "נקה תאריכים",
          dateRangePickerToolbarTitle: "בחר טווח תאריכים",
        }}
      >
        <Routes>
          <Route
            path="/login"
            element={<AuthForm type="login" onSuccess={handleSuccess} />}
          />
          <Route
            path="/register"
            element={<AuthForm type="register" onSuccess={handleSuccess} />}
          />
          <Route path="/documents" element={<Document />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </LocalizationProvider>
    </WithTheme>
  );
}
