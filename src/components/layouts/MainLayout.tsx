import DashboardIcon from "@mui/icons-material/Dashboard";
import DescriptionIcon from "@mui/icons-material/Description";
import HomeIcon from "@mui/icons-material/Home";
import { Box } from "@mui/material";
import { useMemo } from "react";
import { Outlet } from "react-router-dom";
import { useUser } from "../../hooks/auth/authsHooks";
import { useParentCategories } from "../../hooks/category/categoryHooks";
import { NavBar } from "../navBar";
import { MenuItem } from "../navBar/NavBar";

// Layout component for authenticated routes with NavBar
export const MainLayout = () => {
  const { isSystemAdmin } = useUser();
  const { data: categoriesData, isLoading } = useParentCategories();

  const mainMenuItems: MenuItem[] = useMemo(() => {
    return [
      { path: "/home", icon: <HomeIcon />, text: "Home", disabled: false },
      ...(isSystemAdmin
        ? [
            {
              path: "/dashboard",
              icon: <DashboardIcon />,
              text: "Dashboard",
              disabled: false,
            },
          ]
        : []),
      {
        path: "/pending-signature",
        icon: <DescriptionIcon />,
        text: "Pending signature",
        disabled: false,
      },
    ];
  }, [isSystemAdmin]);

  const categoryMenuItems: MenuItem[] = useMemo(() => {
    return (
      categoriesData?.map((category) => ({
        path: `/`,
        icon: null,
        text: category.name,
        disabled: false,
        childItems:
          category.childCategories?.map((child) => ({
            path: `/category/${child.id}`,
            icon: null,
            text: child.name,
            disabled: false,
          })) || [],
      })) || []
    );
  }, [categoriesData]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <NavBar
        menuItems={[...mainMenuItems, ...categoryMenuItems]}
        loading={isLoading}
      />
      <Box component="main" sx={{ p: 3, overflow: "auto" }}>
        <Outlet />
      </Box>
    </Box>
  );
};
