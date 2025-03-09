import Sidebar from "./components/sideBar/sidebar.tsx";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate } from "react-router-dom";

import AuthForm from "./pages/auth/index.tsx";
import AdminDashboard from "./pages/dashboard/adminDashboard";
import { Document } from "./pages/document";
import { HomePage } from "./pages/home";
import { WithTheme } from "../theme/Theme";
import WithCache from "./hooks/cache/withCache.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retryDelay: 1500,
    },
  },
});

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user =
    useSelector((state: any) => state.user.user) ||
    (storedUser ? JSON.parse(storedUser) : null);

  return (
    <WithCache>
      <QueryClientProvider client={queryClient}>
        <WithTheme>
          <SnackbarProvider maxSnack={3}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={"en"}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row-reverse",
                  height: "100vh",
                }}
              >
                {user &&
                  location.pathname !== "/login" &&
                  location.pathname !== "/register" && <Sidebar />}

                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                  <Routes>
                    <Route
                      path="/login"
                      element={
                        <AuthForm
                          type="login"
                          onSuccess={() => navigate("/home")}
                        />
                      }
                    />
                    <Route
                      path="/documents"
                      element={
                        user ? <Document /> : <Navigate to="/login" replace />
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        user && user.role === "SYSTEM_ADMIN" ? (
                          <AdminDashboard />
                        ) : (
                          <Navigate to="/login" replace />
                        )
                      }
                    />
                    <Route
                      path="/home"
                      element={
                        user ? <HomePage /> : <Navigate to="/login" replace />
                      }
                    />
                    <Route
                      path="/"
                      element={<Navigate to="/login" replace />}
                    />
                    <Route
                      path="*"
                      element={<Navigate to="/login" replace />}
                    />
                  </Routes>
                </Box>
              </Box>
            </LocalizationProvider>
          </SnackbarProvider>
        </WithTheme>
      </QueryClientProvider>
    </WithCache>
  );
}
