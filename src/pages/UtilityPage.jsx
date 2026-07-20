import { Box, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { PageHeader } from "../components/common";

const content = {
  "/profile": ["Profile", "Review the signed-in administrator account."],
  "/notifications": ["Notifications", "Recent application updates and attendance alerts."],
};

export default function UtilityPage() {
  const location = useLocation();
  const [title, subtitle] = content[location.pathname] || ["Application", "Application information"];
  return <Box><PageHeader title={title} subtitle={subtitle} /><Paper sx={{ p: 4, border: "1px solid", borderColor: "divider" }}><Typography color="text.secondary">No additional {title.toLowerCase()} are available yet.</Typography></Paper></Box>;
}
