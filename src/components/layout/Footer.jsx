import { Box, Typography, Link, Stack, Divider } from "@mui/material";

const APP_VERSION = "v1.0.0";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        bgcolor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Divider />

      <Box
        sx={{
          px: {
            xs: 2,
            md: 4,
          },
          py: 2.5,
        }}
      >
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "center",
            md: "center",
          }}
          spacing={2}
        >
          {/* Left */}

          <Box
            textAlign={{
              xs: "center",
              md: "left",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              © {year} Scout Attendance System
            </Typography>

            <Typography variant="caption" color="text.disabled">
              Attendance Management Platform
            </Typography>
          </Box>

          {/* Center */}

          <Typography variant="caption" color="text.secondary">
            Version {APP_VERSION}
          </Typography>

          {/* Right */}

          <Stack direction="row" spacing={3}>
            <Link href="#" underline="hover" color="inherit" variant="body2">
              Privacy
            </Link>

            <Link href="#" underline="hover" color="inherit" variant="body2">
              Support
            </Link>

            <Link href="#" underline="hover" color="inherit" variant="body2">
              Documentation
            </Link>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
