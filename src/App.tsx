import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { SnackbarProvider } from "notistack";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import { WithTheme } from "../theme/Theme";
import { MainLayout } from "./components/layouts/MainLayout.tsx";
import AuthForm from "./pages/auth/index.tsx";
import AdminDashboard from "./pages/dashboard/adminDashboard";
import { Document } from "./pages/document";
import { PendingSignatures } from "./pages/pendingSignatures";
import { HomePage } from "./pages/home";
import { ResetPasswordPage } from "./pages/auth/components/resetPassword";
import { ReportsPage } from "./pages/report";
import { AuditTrailPage } from "./pages/auditTrail";
import { useAutoLogout } from "./hooks/utils/useAutoLogout.ts";
import "./styles.css";

// Auth routes component - only for login
const AuthRoutes = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/login"
        element={<AuthForm type="login" onSuccess={() => navigate("/home")} />}
      />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

// Main routes component - for authenticated users
const MainRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/documents" element={<Document key="documents" />} />
        <Route path="/pending-signature" element={<PendingSignatures />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/audit-trail" element={<AuditTrailPage />} />
        {/* TODO: implement category page */}
        <Route path="/category/:id" element={<Document key="category" />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  );
};

export default function App() {
  useAutoLogout();
  const storedUser = localStorage.getItem("user");
  const user =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useSelector((state: any) => state.user.user) ||
    (storedUser ? JSON.parse(storedUser) : null);

  return (
    <WithTheme>
      <SnackbarProvider maxSnack={3}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en"}>
          {user ? <MainRoutes /> : <AuthRoutes />}
        </LocalizationProvider>
      </SnackbarProvider>
    </WithTheme>
  );
}
