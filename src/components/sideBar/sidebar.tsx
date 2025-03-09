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
import MenuIcon from "@mui/icons-material/Menu";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MENU_ITEMS } from "./menuItems";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => navigate(path);
  const toggleDrawer = () => setOpen(!open);

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: open ? "200px" : "80px",
        flexShrink: 0,
        transition: "width 0.3s ease-in-out",
        "& .MuiDrawer-paper": {
          width: open ? "200px" : "80px",
          backgroundColor: "#ffffff",
          borderRight: "1px solid #ddd",
          overflowX: "hidden",
          direction: "ltr",
          transition: "all 0.3s ease-in-out",
          padding: "10px 0",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: open ? "flex-end" : "center",
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
        {MENU_ITEMS.map((item: any) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
                disabled={item.disabled}
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
              <ListItemIcon
                sx={{
                  color: "#37474f",
                  fontSize: "24px",
                  minWidth: 40,
                  display: "flex",
                  justifyContent: "center",
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
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {item.text}
                </Typography>
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
