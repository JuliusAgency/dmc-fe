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
  Divider,
  CircularProgress,
  Popper,
  Menu,
  MenuItem,
  Paper,
  Popper,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogout } from "../../hooks/auth/authsHooks";
import { SearchBar } from "../search/SearchBar";

export type MenuItem = {
  path: string;
  icon: React.ReactNode;
  text: string;
  disabled?: boolean;
  childItems?: MenuItem[];
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

  // Hover menu state for child items
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

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

  // Mobile drawer content
  const drawer = (
    <Box sx={{ width: 250 }} role="presentation">
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div">
          DMS
        </Typography>
      </Box>
      <Divider />
      {/* Mobile search */}
      <Box sx={{ margin: theme.spacing(1) }}>
        <SearchBar onSearch={onSearch || (() => {})} fullWidth />
      <Box
        component="form"
        onSubmit={handleSearchSubmit}
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
          onChange={handleSearchChange}
        />
        <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Box>
      <List>
        {menuItems.map((item) => (
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mr: 2,
            }}
          >
            <img
              src="/images/home.png"
              alt="Logo"
              style={{
                height: "40px",
              }}
            />
          </Box>
          {/* Loading indicator */}
          {loading && (
            <Box sx={{ display: "flex", mr: 2 }}>
              <CircularProgress size={24} color="primary" />
            </Box>
          )}

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
            <Box
              sx={{
                display: "flex",
                flexGrow: 1,
                flexWrap: "wrap", // Allow items to wrap to next line
                alignItems: "center",
                maxWidth: "calc(100% - 50px)", // Reserve space for search and user menu
                overflow: "visible",
              }}
            >
              {menuItems.map((item, index) => (
                <Box
                  key={item.path}
                  sx={{
                    color: theme.palette.primary.main,
                    position: "relative",
                    mb: 0.5, // Add some margin bottom for wrapped items
                    mt: 0.5, // Add some margin top for wrapped items
                  }}
                >
                  <Button
                    startIcon={item.icon}
                    onClick={() => handleNavigation(item.path)}
                    disabled={item.disabled}
                    color="inherit"
                    onMouseEnter={(event) => {
                      if (item.childItems && item.childItems.length > 0) {
                        setOpenMenuIndex(index);
                        setMenuAnchorEl(event.currentTarget);
                      }
                    }}
                    endIcon={
                      item.childItems && item.childItems.length > 0 ? (
                        <ArrowDropDownIcon />
                      ) : null
                    }
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
                      whiteSpace: "nowrap", // Prevent text from wrapping inside button
                      minHeight: "36px", // Ensure consistent height
                    }}
                  >
                    {item.text}
                  </Button>
                  {item.childItems && item.childItems.length > 0 && (
                    <Popper
                      open={openMenuIndex === index}
                      anchorEl={menuAnchorEl}
                      placement="bottom-start"
                      transition
                      disablePortal
                      sx={{
                        zIndex: 1300,
                      }}
                    >
                      {({ TransitionProps }) => (
                        <Grow
                          {...TransitionProps}
                          style={{ transformOrigin: "top left" }}
                        >
                          <Paper
                            elevation={3}
                            sx={{
                              mt: 0.5,
                              minWidth: 180,
                              backgroundColor: theme.palette.grey[200],
                              borderBottom: `2px solid ${theme.palette.grey[400]}`,
                            }}
                          >
                            <ClickAwayListener
                              onClickAway={() => setOpenMenuIndex(null)}
                            >
                              <List dense sx={{ py: 0.5 }}>
                                {item.childItems?.map((child) => (
                                  <ListItem key={child.path} disablePadding>
                                    <ListItemButton
                                      onClick={() =>
                                        handleNavigation(child.path)
                                      }
                                      dense
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: "14px",
                                          fontWeight: "bold",
                                          color: theme.palette.primary.main,
                                          padding: "7px",
                                        }}
                                      >
                                        {child.text}
                                      </Typography>
                                    </ListItemButton>
                                  </ListItem>
                                ))}
                              </List>
                            </ClickAwayListener>
                          </Paper>
                        </Grow>
                      )}
                    </Popper>
                  )}
                </Box>
              ))}
            </Box>
          )}

          {/* Search box */}
          <Box sx={{ display: { xs: isMobile ? "none" : "flex", md: "flex" } }}>
            <SearchBar onSearch={onSearch || (() => {})} />
          </Box>

          {/* User menu */}
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
              <MenuItem sx={{ color: "red" }} onClick={handleLogout}>
                Logout
              </MenuItem>
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
