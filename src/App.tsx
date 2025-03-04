import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import AuthForm from "./components/auth-form";
import AdminDashboard from "./pages/dashboard/adminDashboard";
import { Document } from "./pages/document";
import { HomePage } from "./pages/home";
import { WithTheme } from "../theme/Theme";
import { useSelector } from "react-redux";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retryDelay: 1500,
    },
  },
});

const menuItems = [
  { path: "/home", icon: <HomeIcon />, text: "דף הבית" },
  { path: "/dashboard", icon: <DashboardIcon />, text: "לוח בקרה" },
  { path: "/documents", icon: <DescriptionIcon />, text: "מסמכים" },
];

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const user = useSelector((state: any) => state.user.user);

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const handleSuccess = () => navigate("/home");
  const handleNavigation = (path: string) => navigate(path);
  const toggleDrawer = () => setOpen(!open);

  return (
    <QueryClientProvider client={queryClient}>
      <WithTheme>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              height: "100vh",
            }}
          >
            {user && !isAuthPage && (
              <Drawer
                variant="permanent"
                anchor="right"
                sx={{
                  width: open ? "240px" : "80px",
                  flexShrink: 0,
                  transition: "width 0.3s ease-in-out",
                  "& .MuiDrawer-paper": {
                    width: open ? "240px" : "80px",
                    backgroundColor: "#ffffff",
                    borderRight: "1px solid #ddd",
                    overflowX: "hidden",
                    direction: "rtl",
                    transition: "all 0.3s ease-in-out",
                    padding: "10px 0",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: open ? "flex-start" : "center",
                    alignItems: "center",
                    padding: "12px",
                  }}
                >
                  <IconButton
                    onClick={toggleDrawer}
                    sx={{
                      color: "#37474f",
                      "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.05)" },
                    }}
                  >
                    {open ? <ChevronRightIcon /> : <MenuIcon />}
                  </IconButton>
                </Box>

                <List sx={{ padding: 0 }}>
                  {menuItems.map((item) => (
                    <ListItem key={item.path} disablePadding>
                      <ListItemButton
                        onClick={() => handleNavigation(item.path)}
                        sx={{
                          padding: "12px",
                          justifyContent: open ? "flex-start" : "center",
                          borderRadius: "8px",
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.05)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: open ? 2 : 0,
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              color: "#37474f",
                              fontSize: "24px",
                              minWidth: 0,
                            }}
                          >
                            {item.icon}
                          </ListItemIcon>
                          {open && (
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: "bold",
                                color: "#37474f",
                              }}
                            >
                              {item.text}
                            </Typography>
                          )}
                        </Box>
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Drawer>
            )}

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <Routes>
                <Route
                  path="/login"
                  element={<AuthForm type="login" onSuccess={handleSuccess} />}
                />
                <Route
                  path="/register"
                  element={
                    <AuthForm type="register" onSuccess={handleSuccess} />
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
                    user ? <AdminDashboard /> : <Navigate to="/login" replace />
                  }
                />
                <Route
                  path="/home"
                  element={
                    user ? <HomePage /> : <Navigate to="/login" replace />
                  }
                />
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Box>
          </Box>
        </LocalizationProvider>
      </WithTheme>
    </QueryClientProvider>
  );
}
