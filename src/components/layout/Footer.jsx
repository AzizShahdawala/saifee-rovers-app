import { Box, Divider, Link, Stack, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box component="footer" sx={{ mt: "auto", bgcolor: "background.paper", borderTop: "1px solid", borderColor: "divider" }}>
      <Divider />
      <Box sx={{ px: { xs: 2, md: 4 }, py: 2.5 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 0.5, sm: 1 }} alignItems="center" justifyContent="center" textAlign="center">
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            © {new Date().getFullYear()}
          </Typography>
          <Link href="https://www.azizshahda.com" target="_blank" rel="noopener noreferrer" variant="body2" color="primary.main" fontWeight={700} underline="hover">
            Aziz Shahdawala · www.azizshahda.com
          </Link>
        </Stack>
      </Box>
    </Box>
  );
}
