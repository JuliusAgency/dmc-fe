import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  ClickAwayListener,
  Divider,
  Drawer,
  Grow,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popper,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { useLogout } from "../../hooks/auth/authsHooks";
import { SearchBar } from "../search/SearchBar";
import { useSelector } from "react-redux";
import { Category } from "../../api/categoryAPI/types";

export type MenuItem = {
  path: string;
  icon: React.ReactNode;
  text: string;
  disabled?: boolean;
  childItems?: MenuItem[];
  categoryId?: number;
};

export function NavBar({
  menuItems,
  loading,
  onSearch,
}: {
  menuItems: MenuItem[];
  loading?: boolean;
  onSearch?: (query: string, categoryId?: number | null) => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();

  const { mutate } = useLogout();

  const storedUser = localStorage.getItem("user");
  const user =
    useSelector((state: any) => state.user.user) ||
    (storedUser ? JSON.parse(storedUser) : null);

  const blockedCategoryIds: number[] =
    user?.blockedCategories?.map((cat: Category) => {
      return cat.id;
    }) || [];

  const filteredMenuItems = menuItems
    .filter(
      (item) =>
        !item.categoryId || !blockedCategoryIds.includes(item.categoryId)
    )
    .map((item) => ({
      ...item,
      childItems: item.childItems?.filter(
        (child) =>
          !child.categoryId || !blockedCategoryIds.includes(child.categoryId)
      ),
    }));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const userMenuOpen = Boolean(anchorEl);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
    setOpenMenuIndex(null);
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    mutate();
    handleUserMenuClose();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div">
          DMS
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ margin: theme.spacing(1) }}>
        <SearchBar onSearch={onSearch || (() => {})} fullWidth />
      </Box>
      <Box
        component="form"
        sx={{
          display: "flex",
          alignItems: "center",
          padding: theme.spacing(1, 2),
          backgroundColor: "#e3f2fd",
          margin: theme.spacing(1),
          borderRadius: 2,
          border: `1px solid black`,
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
          value={searchQuery}
        />
        <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Box>
      <List>
        {filteredMenuItems.map((item) => (
          <React.Fragment key={item.path}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                disabled={item.disabled}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {item.childItems && item.childItems.length > 0 && (
                  <ArrowDropDownIcon fontSize="small" />
                )}
              </ListItemButton>
            </ListItem>
            {item.childItems && item.childItems.length > 0 && (
              <List component="div" disablePadding>
                {item.childItems.map((child) => (
                  <ListItem key={child.path} disablePadding>
                    <ListItemButton
                      onClick={() => handleNavigation(child.path)}
                      sx={{ pl: 4 }}
                      dense
                    >
                      <ListItemText primary={child.text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar
          sx={{
            minHeight: { xs: "56px", sm: "64px" },
            backgroundColor: "#e3f2fd",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
            <img src="/images/home.png" alt="Logo" style={{ height: "40px" }} />
          </Box>

          {loading && (
            <Box sx={{ display: "flex", mr: 2 }}>
              <CircularProgress size={24} color="primary" />
            </Box>
          )}

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          ) : null}

          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                flexGrow: 1,
                flexWrap: "wrap",
                alignItems: "center",
                maxWidth: "calc(100% - 50px)",
                overflow: "visible",
              }}
            >
              {filteredMenuItems.map((item) => (
                <Box
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    mx: 2,
                  }}
                >
                  {item.icon && (
                    <Box
                      sx={{
                        backgroundColor: "white",
                        padding: 1.1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 0.5,
                        mt: 1,
                      }}
                    >
                      {React.cloneElement(item.icon as React.ReactElement, {
                        //@ts-ignore
                        sx: { fontSize: 34, color: theme.palette.primary.main },
                      })}
                    </Box>
                  )}
                  <Typography
                    sx={{
                      mt: item.icon ? 0 : 7,
                      fontSize: item.icon ? "0.75rem" : "1rem",
                      fontWeight:
                        location.pathname === item.path ? "bold" : "normal",
                      color: theme.palette.primary.main,
                      textAlign: "center",
                    }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          <Box sx={{ display: { xs: isMobile ? "none" : "flex", md: "flex" } }}>
            <SearchBar onSearch={onSearch || (() => {})} />
          </Box>

          <Box sx={{ flexShrink: 0 }}>
            <IconButton
              onClick={handleUserMenuClick}
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={userMenuOpen ? "user-menu" : undefined}
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={userMenuOpen}
              onClose={handleUserMenuClose}
              MenuListProps={{ "aria-labelledby": "user-button" }}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem sx={{ color: "red" }} onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
