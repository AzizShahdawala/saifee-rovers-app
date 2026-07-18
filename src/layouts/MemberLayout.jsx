import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppBar, Avatar, Box, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import { DashboardOutlined, EventOutlined, FactCheckOutlined, LogoutOutlined, MenuOutlined, PersonOutlined } from "@mui/icons-material";
import logo from "../assets/logo.png";
import { clearSession, getStoredUser } from "../utils/auth";

const width = 250;
const links = [
  { label: "Overview", path: "/member", icon: DashboardOutlined },
  { label: "My attendance", path: "/member/attendance", icon: FactCheckOutlined },
  { label: "Events", path: "/member/events", icon: EventOutlined },
  { label: "My profile", path: "/member/profile", icon: PersonOutlined },
];

export default function MemberLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getStoredUser() || {};
  const logout = () => { clearSession(); navigate("/", { replace: true }); };
  const content = <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <Toolbar sx={{ gap: 1.5 }}><Avatar src={logo} /><Box><Typography fontWeight={800}>Saifee Rovers</Typography><Typography variant="caption" color="text.secondary">Member portal</Typography></Box></Toolbar>
    <Divider />
    <List sx={{ p: 1.5, flex: 1 }}>{links.map(({ label, path, icon: Icon }) => <ListItemButton key={path} component={Link} to={path} onClick={() => setOpen(false)} selected={location.pathname === path} sx={{ borderRadius: 2.5, mb: .5 }}><ListItemIcon><Icon /></ListItemIcon><ListItemText primary={label} /></ListItemButton>)}</List>
    <Divider /><Box sx={{ p: 2 }}><Typography fontWeight={700} noWrap>{user.name || "Member"}</Typography><Typography variant="caption" color="text.secondary">{user.patrol || "Rover member"}</Typography><ListItemButton onClick={logout} sx={{ mt: 1, borderRadius: 2 }}><ListItemIcon><LogoutOutlined /></ListItemIcon><ListItemText primary="Sign out" /></ListItemButton></Box>
  </Box>;
  return <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
    <Drawer variant="temporary" open={open} onClose={() => setOpen(false)} sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { width } }}>{content}</Drawer>
    <Drawer variant="permanent" sx={{ display: { xs: "none", md: "block" }, width, flexShrink: 0, "& .MuiDrawer-paper": { width } }}>{content}</Drawer>
    <Box sx={{ minWidth: 0, flex: 1 }}><AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}><Toolbar><IconButton onClick={() => setOpen(true)} sx={{ display: { md: "none" }, mr: 1 }} aria-label="Open menu"><MenuOutlined /></IconButton><Box sx={{ flex: 1 }}><Typography fontWeight={800}>Member Portal</Typography><Typography variant="caption" color="text.secondary">Welcome, {user.name || "member"}</Typography></Box><Avatar src={user.profileImage}>{user.name?.[0]}</Avatar></Toolbar></AppBar><Box component="main" sx={{ p: { xs: 2, sm: 3, lg: 4 }, maxWidth: 1400, mx: "auto" }}><Outlet /></Box></Box>
  </Box>;
}
