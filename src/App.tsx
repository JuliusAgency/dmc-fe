import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthForm from "./components/auth-form";
import Dashboard from "./dashboard";
import {Document} from "./pages/document";
import {WithTheme} from "../theme/Theme.tsx";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";


export default function App() {
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
            <Router>
                <Routes>
                    <Route
                        path="/login"
                        element={
                            <AuthForm
                                type="login"
                                onSuccess={() => (window.location.href = "/")}
                            />
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <AuthForm
                                type="register"
                                onSuccess={() => (window.location.href = "/")}
                            />
                        }
                    />
                    <Route
                        path="/documents"
                        element={
                            <Document />
                        }
                    />
                    <Route path="/" element={<Dashboard />} />
                </Routes>
            </Router>
        </LocalizationProvider>
    </WithTheme>
  );
}
