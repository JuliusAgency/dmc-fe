import { Box } from "@mui/material";
import { useParentCategories } from "../../hooks/category/categoryHooks";
import { NavBar, useMenuItems } from "../navBar";
import { Outlet } from "react-router-dom";

// Layout component for authenticated routes with NavBar
export const MainLayout = () => {
  const { data: categoriesData, isLoading } = useParentCategories();
  const { menuItems } = useMenuItems({
    additionalItems:
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
      })) || [],
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <NavBar menuItems={menuItems} loading={isLoading} />
      <Box component="main" sx={{ p: 3, overflow: "auto" }}>
        <Outlet />
      </Box>
    </Box>
  );
};
