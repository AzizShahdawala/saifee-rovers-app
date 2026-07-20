import { Box, Divider, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box component="footer" sx={{ mt: "auto", bgcolor: "background.paper", borderTop: "1px solid", borderColor: "divider" }}>
      <Divider />
      <Box sx={{ px: { xs: 2, md: 4 }, py: 2.5 }}>
        <Typography variant="body2" color="text.secondary" textAlign="center" fontWeight={600}>
          © {new Date().getFullYear()} Aziz Shahdawala
        </Typography>
      </Box>
    </Box>
  );
}
