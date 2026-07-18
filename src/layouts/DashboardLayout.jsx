import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import AppDrawer from "../components/layout/AppDrawer";
import TopBar from "../components/layout/TopBar";
import Footer from "../components/layout/Footer";

/**
 * Shared authenticated application layout.
 *
 * Used by Dashboard, Members, Events, Attendance and Reports pages.
 *
 * @param {object} props
 * @param {import("react").ReactNode} props.children
 */
export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMobileDrawerToggle = () => {
    setMobileOpen((previousValue) => !previousValue);
  };

  const handleMobileDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Responsive navigation drawer */}
      <AppDrawer
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onMobileClose={handleMobileDrawerClose}
      />

      {/* Right-side application area */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minWidth: 0,
          minHeight: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Application header */}
        <TopBar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          onMenuClick={handleMobileDrawerToggle}
        />

        {/* Page content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: "100%",
            overflowX: "hidden",
            px: {
              xs: 1.5,
              sm: 3,
              lg: 4,
            },
            py: {
              xs: 2,
              sm: 3,
              lg: 4,
            },
          }}
        >
          {children ?? <Outlet />}
        </Box>

        {/* Shared footer */}
        <Footer />
      </Box>
    </Box>
  );
}
