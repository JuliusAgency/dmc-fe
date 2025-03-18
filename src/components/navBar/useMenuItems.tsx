import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import HomeIcon from "@mui/icons-material/Home";
import { useMemo } from "react";
import { MenuItem } from "./NavBar";

export const MENU_ITEMS = [
  { path: "/home", icon: <HomeIcon />, text: "Home", disabled: false },
  {
    path: "/dashboard",
    icon: <DashboardIcon />,
    text: "Dashboard",
    disabled: false,
  },
  {
    path: "/pending-signature",
    icon: <DescriptionIcon />,
    text: "Pending signature",
    disabled: false,
  },
];

export const useMenuItems = ({
  additionalItems = [],
}: {
  additionalItems?: MenuItem[];
}) => {
  const menuItems: MenuItem[] = useMemo(() => {
    return [...MENU_ITEMS, ...additionalItems];
  }, [additionalItems]);

  return {
    menuItems,
  };
};
