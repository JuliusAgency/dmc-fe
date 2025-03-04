import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
import AdminDashboard from "./pages/dashboard/adminDashboard.tsx";
import { Document } from "./pages/document";
import { HomePage } from "./pages/home";
import { WithTheme } from "../theme/Theme.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retryDelay: 1500,
    },
  },
});

const menuItems = [
  { path: "/", icon: <HomeIcon />, text: "דף הבית" },
  { path: "/dashboard", icon: <DashboardIcon />, text: "לוח בקרה" },
  { path: "/documents", icon: <DescriptionIcon />, text: "מסמכים" },
];

export default function App() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSuccess = () => navigate("/");
  const handleNavigation = (path: any) => navigate(path);
  const toggleDrawer = () => setOpen(!open);

  return (
    <QueryClientProvider client={queryClient}>
      <WithTheme>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale="he"
          localeText={{
            start: "התחלה",
            end: "סיום",
            nextMonth: "חודש הבא",
            previousMonth: "חודש קודם",
            clearButtonLabel: "נקה תאריכים",
            dateRangePickerToolbarTitle: "בחר טווח תאריכים",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              height: "100vh",
            }}
          >
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
                <Route path="/documents" element={<Document />} />
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/" element={<HomePage />} />
              </Routes>
            </Box>

            <Drawer
              variant="permanent"
              anchor="right"
              sx={{
                width: open ? "auto" : "3%",
                flexShrink: 0,
                transition: "width 0.3s ease-in-out",
                "& .MuiDrawer-paper": {
                  width: open ? "auto" : "3%",
                  backgroundColor: "#f5f5f5",
                  borderRight: "1px solid #ddd",
                  overflowX: "hidden",
                  direction: "rtl",
                },
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "flex-start", p: 1 }}>
                <IconButton onClick={toggleDrawer}>
                  {open ? <ChevronRightIcon /> : <MenuIcon />}
                </IconButton>
              </Box>
              <List sx={{ padding: 0 }}>
                {menuItems.map((item) => (
                  <ListItem key={item.path} disablePadding>
                    <ListItemButton
                      onClick={() => handleNavigation(item.path)}
                      sx={{
                        padding: 0,
                        justifyContent: open ? "flex-start" : "center",
                        minHeight: 0,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          padding: "8px 8px 8px 4px",
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            marginRight: open ? "4px" : "0px",
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        {open && (
                          <Typography
                            variant="body1"
                            sx={{
                              margin: 0,
                              padding: 0,
                              lineHeight: 1,
                              display: "inline",
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
          </Box>
        </LocalizationProvider>
      </WithTheme>
    </QueryClientProvider>
  );
}
