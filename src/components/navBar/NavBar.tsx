import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  InputBase,
  alpha,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogout } from "../../hooks/auth/authsHooks";

export type MenuItem = {
  path: string;
  icon: React.ReactNode;
  text: string;
  disabled?: boolean;
};

export function NavBar({
  menuItems,
  loading,
  onSearch,
}: {
  menuItems: MenuItem[];
  loading?: boolean;
  onSearch?: (query: string) => void;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();

  const { mutate } = useLogout();

  // Mobile drawer state
  const [mobileOpen, setMobileOpen] = useState(false);

  // User menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const userMenuOpen = Boolean(anchorEl);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div">
          DMC
        </Typography>
      </Box>
      <Divider />
      {/* Mobile search */}
      <Box
        component="form"
        onSubmit={handleSearchSubmit}
        sx={{
          display: "flex",
          alignItems: "center",
          padding: theme.spacing(1, 2),
          backgroundColor: alpha(theme.palette.common.white, 0.15),
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
          onChange={handleSearchChange}
        />
        <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              disabled={item.disabled}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          {/* Loading indicator */}
          {loading && (
            <Box sx={{ display: "flex", mr: 2 }}>
              <CircularProgress size={24} color="primary" />
            </Box>
          )}
          {/* Logo/Brand */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 0,
              mr: 2,
              display: { xs: "none", sm: "block" },
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={() => navigate("/home")}
          >
            DMC
          </Typography>

          {/* Mobile menu button */}
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

          {/* Desktop navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", flexGrow: 1 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  startIcon={item.icon}
                  onClick={() => handleNavigation(item.path)}
                  disabled={item.disabled}
                  color="inherit"
                  sx={{
                    mx: 1,
                    borderRadius: 1,
                    textTransform: "none",
                    fontWeight:
                      location.pathname === item.path ? "bold" : "normal",
                    borderBottom:
                      location.pathname === item.path ? "2px solid" : "none",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          {/* Search box */}
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              position: "relative",
              borderRadius: 2,
              border: `1px solid black`,
              backgroundColor: alpha(theme.palette.common.white, 0.15),
              "&:hover": {
                backgroundColor: alpha(theme.palette.common.white, 0.25),
              },
              marginRight: 2,
              marginLeft: 0,
              width: "auto",
              [theme.breakpoints.up("sm")]: {
                marginLeft: theme.spacing(1),
                width: "auto",
              },
              display: { xs: isMobile ? "none" : "flex", md: "flex" },
            }}
          >
            <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
            <InputBase
              sx={{
                color: "inherit",
                "& .MuiInputBase-input": {
                  padding: theme.spacing(1, 1, 1, 0),
                  paddingLeft: 0,
                  width: "100%",
                  [theme.breakpoints.up("md")]: {
                    width: "20ch",
                  },
                },
              }}
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Box>

          {/* User menu */}
          <Box>
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
              MenuListProps={{
                "aria-labelledby": "user-button",
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
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
