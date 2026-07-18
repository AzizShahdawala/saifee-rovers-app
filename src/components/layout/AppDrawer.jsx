import { useState } from "react";

import { Link, useLocation } from "react-router-dom";

import {
  Drawer,
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";

import MenuOpenIcon from "@mui/icons-material/MenuOpen";

import MenuIcon from "@mui/icons-material/Menu";

import LogoutIcon from "@mui/icons-material/Logout";

import navigation from "../../constants/navigation";

import logo from "../../assets/logo.png";

import { useTheme, useMediaQuery } from "@mui/material";

export default function AppDrawer({
  mobileOpen,
  setMobileOpen,
  onMobileClose,
}) {
  const drawerWidth = 260;

  const collapsedWidth = 82;

  const location = useLocation();

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.assign(`${import.meta.env.BASE_URL}#/`);
  };

  const isActiveRoute = (path) => {
    if (location.pathname === path) {
      return true;
    }

    const hasMoreSpecificMatch = navigation.some(
      (item) =>
        item.path !== path &&
        item.path.length > path.length &&
        location.pathname.startsWith(item.path),
    );

    return location.pathname.startsWith(`${path}/`) && !hasMoreSpecificMatch;
  };

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",

          justifyContent: collapsed ? "center" : "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Avatar
            src={logo}
            sx={{
              width: 44,

              height: 44,
            }}
          />

          {!collapsed && (
            <Box>
              <Typography fontWeight={700}>Scout Attendance</Typography>

              <Typography variant="caption" color="text.secondary">
                Face Recognition
              </Typography>
            </Box>
          )}
        </Box>

        <IconButton onClick={toggleCollapse} sx={{ display: isMobile ? "none" : "inline-flex" }}>
          {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
        </IconButton>
      </Toolbar>

      <Divider />

      <List
        sx={{
          mt: 1,
          px: 1,
        }}
      >
        {navigation.map((item) => {
          const IconComponent = item.icon;
          const selected = isActiveRoute(item.path);

          return (
            <ListItem
              key={item.path}
              disablePadding
              sx={{
                mb: 0.75,
                display: "block",
              }}
            >
              <Tooltip
                title={collapsed ? item.title : ""}
                placement="right"
                arrow
              >
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={selected}
                  onClick={() => {
                    if (onMobileClose) {
                      onMobileClose();
                    } else if (setMobileOpen) {
                      setMobileOpen(false);
                    }
                  }}
                  sx={{
                    minHeight: 52,
                    px: 2,
                    borderRadius: 3,
                    justifyContent: collapsed ? "center" : "flex-start",
                    transition: "all 0.2s ease",

                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "primary.contrastText",

                      "&:hover": {
                        bgcolor: "primary.dark",
                      },

                      "& .MuiListItemIcon-root": {
                        color: "primary.contrastText",
                      },
                    },

                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: collapsed ? 0 : 2,
                      justifyContent: "center",
                      color: selected
                        ? "primary.contrastText"
                        : "text.secondary",
                    }}
                  >
                    <IconComponent />
                  </ListItemIcon>

                  {!collapsed && (
                    <ListItemText
                      primary={item.title}
                      primaryTypographyProps={{
                        fontWeight: selected ? 700 : 500,
                        noWrap: true,
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Box
        sx={{
          mt: "auto",
          p: 2,
        }}
      >
        <Divider sx={{ mb: 2 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar>A</Avatar>

            {!collapsed && (
              <Box>
                <Typography variant="subtitle2">Admin</Typography>

                <Typography variant="caption" color="text.secondary">
                  Scout Manager
                </Typography>
              </Box>
            )}
          </Box>

          {!collapsed && (
            <Tooltip title="Logout">
              <IconButton onClick={handleLogout}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose || (() => setMobileOpen?.(false))}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: "min(86vw, 290px)", overflowX: "hidden" },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: {
            xs: "none",
            md: "block",
          },

          width: collapsed ? collapsedWidth : drawerWidth,

          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: collapsed ? collapsedWidth : drawerWidth,

            transition: "all .25s ease",

            overflowX: "hidden",

            borderRight: "1px solid #ECEFF1",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
