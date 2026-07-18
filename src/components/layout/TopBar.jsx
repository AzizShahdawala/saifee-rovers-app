/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  InputBase,
  ListItemIcon,
  ListItemText,
  alpha,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsIcon from "@mui/icons-material/Settings";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

import { getNavigationTitle } from "../../constants/navigation";

const notifications = [
  {
    id: 1,
    title: "Attendance recorded",
    description: "12 members checked in for Band Practice.",
    time: "5 minutes ago",
    icon: <CheckCircleOutlinedIcon fontSize="small" />,
    color: "success.main",
  },
  {
    id: 2,
    title: "Upcoming event",
    description: "General Meeting starts today at 7:00 PM.",
    time: "30 minutes ago",
    icon: <EventAvailableIcon fontSize="small" />,
    color: "primary.main",
  },
  {
    id: 3,
    title: "New member registered",
    description: "A new scout member was added successfully.",
    time: "2 hours ago",
    icon: <PersonAddAlt1Icon fontSize="small" />,
    color: "info.main",
  },
];

export default function TopBar({ mobileOpen, setMobileOpen, onMenuClick }) {
  const location = useLocation();

  const navigate = useNavigate();

  const [isFullscreen, setIsFullscreen] = useState(
    Boolean(document.fullscreenElement),
  );

  const [profileAnchor, setProfileAnchor] = useState(null);

  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const title = getNavigationTitle(location.pathname);

  const getStoredUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return {
          name: "Admin User",
          role: "Scout Leader",
          email: "admin@scouts.local",
        };
      }

      const parsedUser = JSON.parse(storedUser);

      return {
        name: parsedUser.name || "Admin User",
        role: parsedUser.role || "Scout Leader",
        email: parsedUser.email || "admin@scouts.local",
      };
    } catch {
      return {
        name: "Admin User",
        role: "Scout Leader",
        email: "admin@scouts.local",
      };
    }
  };

  const user = getStoredUser();

  const userInitials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const toggleDrawer = () => {
    if (onMenuClick) {
      onMenuClick();
      return;
    }

    setMobileOpen((previousValue) => !previousValue);
  };

  const openProfile = (event) => {
    setProfileAnchor(event.currentTarget);
  };

  const closeProfile = () => {
    setProfileAnchor(null);
  };

  const openNotifications = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const closeNotifications = () => {
    setNotificationAnchor(null);
  };

  const logout = () => {
    closeProfile();

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/", {
      replace: true,
    });
  };

  const goToProfile = () => {
    closeProfile();
    navigate("/profile");
  };

  const goToSettings = () => {
    closeProfile();
    navigate("/settings");
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen operation failed:", error);
    }
  };

  const SearchBox = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        px: 2,
        py: 0.5,
        borderRadius: 3,
        background: (theme) => alpha(theme.palette.common.white, 0.15),

        "&:hover": {
          background: (theme) => alpha(theme.palette.common.white, 0.25),
        },

        width: 320,
      }}
    >
      <SearchIcon />

      <InputBase
        placeholder="Search..."
        sx={{
          color: "inherit",
          ml: 1,
          flex: 1,
        }}
      />
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: "1px solid #ECEFF1",

        zIndex: 1300,
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          onClick={toggleDrawer}
          aria-label="Open navigation menu"
          sx={{
            mr: 2,
            display: {
              xs: "inline-flex",
              lg: "none",
            },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box>
          <Typography variant="h5" fontWeight={700}>
            {title}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {dateTime.toLocaleDateString()}•{dateTime.toLocaleTimeString()}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box
          sx={{
            display: {
              xs: "none",

              md: "block",
            },

            mr: 3,
          }}
        >
          {SearchBox}
        </Box>

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton
            onClick={openNotifications}
            aria-label="Open notifications"
            aria-controls={notificationAnchor ? "notification-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={notificationAnchor ? "true" : undefined}
            sx={{ mr: 0.5 }}
          >
            <Badge badgeContent={notifications.length} color="error" max={9}>
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        <Menu
          id="notification-menu"
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={closeNotifications}
          disableScrollLock
          slotProps={{
            paper: {
              sx: {
                width: {
                  xs: 310,
                  sm: 380,
                },
                maxWidth: "calc(100vw - 24px)",
                mt: 1.5,
                borderRadius: 3,
                overflow: "hidden",
              },
            },
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
          <Box
            sx={{
              px: 2.5,
              py: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h6">Notifications</Typography>

              <Typography variant="caption" color="text.secondary">
                You have {notifications.length} new updates
              </Typography>
            </Box>

            <Badge badgeContent={notifications.length} color="primary" />
          </Box>

          <Divider />

          {notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={closeNotifications}
              sx={{
                alignItems: "flex-start",
                gap: 1.5,
                whiteSpace: "normal",
                px: 2.5,
                py: 1.75,
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: `${notification.color}`,
                }}
              >
                {notification.icon}
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle2" fontWeight={700}>
                  {notification.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 0.25,
                    lineHeight: 1.4,
                  }}
                >
                  {notification.description}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{
                    display: "block",
                    mt: 0.75,
                  }}
                >
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))}

          <Divider />

          <MenuItem
            onClick={() => {
              closeNotifications();
              navigate("/notifications");
            }}
            sx={{
              justifyContent: "center",
              py: 1.5,
              color: "primary.main",
              fontWeight: 700,
            }}
          >
            View all notifications
          </MenuItem>
        </Menu>

        {/* Fullscreen */}
        <Tooltip title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
          <IconButton
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            sx={{
              display: {
                xs: "none",
                sm: "inline-flex",
              },
              mr: 0.5,
            }}
          >
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Tooltip>

        {/* Settings */}
        <Tooltip title="Settings">
          <IconButton
            onClick={() => navigate("/settings")}
            aria-label="Open settings"
            sx={{
              display: {
                xs: "none",
                sm: "inline-flex",
              },
              mr: 1,
            }}
          >
            <SettingsIcon />
          </IconButton>
        </Tooltip>

        {/* User Profile Trigger */}
        <Box
          onClick={openProfile}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              openProfile(event);
            }
          }}
          aria-label="Open user menu"
          aria-controls={profileAnchor ? "profile-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={profileAnchor ? "true" : undefined}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            p: 0.75,
            pr: {
              xs: 0.75,
              md: 1.5,
            },
            borderRadius: 3,
            cursor: "pointer",
            transition: "background-color 0.2s ease",
            userSelect: "none",

            "&:hover": {
              bgcolor: "action.hover",
            },

            "&:focus-visible": {
              outline: "2px solid",
              outlineColor: "primary.main",
              outlineOffset: 2,
            },
          }}
        >
          <Avatar
            sx={{
              width: 38,
              height: 38,
              bgcolor: "primary.main",
              fontSize: "0.9rem",
              fontWeight: 700,
            }}
          >
            {userInitials || "AU"}
          </Avatar>

          <Box
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
              minWidth: 0,
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={700}
              noWrap
              sx={{
                maxWidth: 150,
              }}
            >
              {user.name}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{
                display: "block",
                maxWidth: 150,
              }}
            >
              {user.role}
            </Typography>
          </Box>
        </Box>

        {/* Profile Menu */}
        <Menu
          id="profile-menu"
          anchorEl={profileAnchor}
          open={Boolean(profileAnchor)}
          onClose={closeProfile}
          disableScrollLock
          slotProps={{
            paper: {
              sx: {
                width: 260,
                mt: 1.5,
                borderRadius: 3,
                overflow: "hidden",
              },
            },
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
          <Box
            sx={{
              px: 2.25,
              py: 2,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Avatar
              sx={{
                width: 46,
                height: 46,
                bgcolor: "primary.main",
                fontWeight: 700,
              }}
            >
              {userInitials || "AU"}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle1" fontWeight={700} noWrap>
                {user.name}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{
                  display: "block",
                }}
              >
                {user.email}
              </Typography>
            </Box>
          </Box>

          <Divider />

          <MenuItem onClick={goToProfile}>
            <ListItemIcon>
              <PersonOutlinedIcon fontSize="small" />
            </ListItemIcon>

            <ListItemText primary="My Profile" />
          </MenuItem>

          <MenuItem onClick={goToSettings}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>

            <ListItemText primary="Settings" />
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={logout}
            sx={{
              color: "error.main",
            }}
          >
            <ListItemIcon
              sx={{
                color: "error.main",
              }}
            >
              <LogoutIcon fontSize="small" />
            </ListItemIcon>

            <ListItemText primary="Logout" />
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
