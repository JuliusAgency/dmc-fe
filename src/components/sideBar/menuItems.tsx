import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";

export const MENU_ITEMS = [
  { path: "/home", icon: <HomeIcon />, text: "Home",  disabled: true },
  { path: "/dashboard", icon: <DashboardIcon />, text: "Dashboard", disabled: false },
  { path: "/documents", icon: <DescriptionIcon />, text: "Documents", disabled: false },
];
