import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

import { getNavigationTitle } from "../../constants/navigation";

export default function TopBar({ setMobileOpen, onMenuClick }) {
  const location = useLocation();

  const navigate = useNavigate();

  const [isFullscreen, setIsFullscreen] = useState(
    Boolean(document.fullscreenElement),
  );

  const [profileAnchor, setProfileAnchor] = useState(null);

  const [dateTime, setDateTime] = useState(new Date());
  const [, setSessionVersion] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const refreshSession = () => setSessionVersion((version) => version + 1);
    window.addEventListener("session-updated", refreshSession);
    return () => window.removeEventListener("session-updated", refreshSession);
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
        profileImage: parsedUser.profileImage,
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
      <Toolbar sx={{ px: { xs: 1, sm: 2 }, minWidth: 0 }}>
        <IconButton
          edge="start"
          onClick={toggleDrawer}
          aria-label="Open navigation menu"
          sx={{
            mr: { xs: 0.5, sm: 2 },
            display: {
              xs: "inline-flex",
              lg: "none",
            },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h5" fontWeight={700} noWrap sx={{ fontSize: { xs: "1rem", sm: "1.5rem" }, maxWidth: { xs: 125, sm: 260 } }}>
            {title}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>
            {dateTime.toLocaleDateString()}•{dateTime.toLocaleTimeString()}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

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
            src={user.profileImage}
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
              px: 2.25,
              py: 2,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Avatar
              src={user.profileImage}
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
