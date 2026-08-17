import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AppBar, Avatar, Box, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import { CakeOutlined, CollectionsOutlined, DashboardOutlined, EventOutlined, FactCheckOutlined, FavoriteOutlined, LeaderboardOutlined, LogoutOutlined, MenuOutlined, NightsStayOutlined, PersonOutlined, ReceiptLongOutlined } from "@mui/icons-material";
import logo from "../assets/logo.png";
import Footer from "../components/layout/Footer";
import { clearSession, getStoredUser } from "../utils/auth";

const width = 250;
const links = [
  { label: "Dashboard", path: "/member", icon: DashboardOutlined },
  { label: "My Attendance", path: "/member/attendance", icon: FactCheckOutlined },
  { label: "Events", path: "/member/events", icon: EventOutlined },
  { label: "Receipts", path: "/member/receipts", icon: ReceiptLongOutlined },
  { label: "Gallery", path: "/member/gallery", icon: CollectionsOutlined },
  { label: "Patrol Dashboard", path: "/member/patrol-dashboard", icon: LeaderboardOutlined },
  { label: "Birthdays", path: "/member/birthdays", icon: CakeOutlined },
  { label: "Waras", path: "/member/waras", icon: NightsStayOutlined },
  { label: "Anniversaries", path: "/member/anniversaries", icon: FavoriteOutlined },
];

export default function MemberLayout() {
  const [open, setOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [, setSessionVersion] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const user = getStoredUser() || {};
  useEffect(() => { const refresh = () => setSessionVersion((version) => version + 1); window.addEventListener("session-updated", refresh); return () => window.removeEventListener("session-updated", refresh); }, []);
  const closeProfile = () => setProfileAnchor(null);
  const logout = () => { closeProfile(); clearSession(); navigate("/", { replace: true }); };
  const showProfile = () => { closeProfile(); navigate("/member/profile"); };
  const content = <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
    <Toolbar sx={{ gap: 1.5 }}><Avatar src={logo} /><Box><Typography fontWeight={800}>Saifee Rovers</Typography><Typography variant="caption" color="text.secondary">Member portal</Typography></Box></Toolbar>
    <Divider />
    <List sx={{ p: 1.5, flex: 1 }}>{links.map(({ label, path, icon: Icon }) => <ListItemButton key={path} component={Link} to={path} onClick={() => setOpen(false)} selected={location.pathname === path} sx={{ borderRadius: 2.5, mb: .5 }}><ListItemIcon><Icon /></ListItemIcon><ListItemText primary={label} /></ListItemButton>)}</List>
    <Divider /><Box sx={{ p: 2 }}><Typography fontWeight={700} noWrap>{user.name || "Member"}</Typography><Typography variant="caption" color="text.secondary">{user.patrol || "Rover member"}</Typography><ListItemButton onClick={logout} sx={{ mt: 1, borderRadius: 2 }}><ListItemIcon><LogoutOutlined /></ListItemIcon><ListItemText primary="Sign out" /></ListItemButton></Box>
  </Box>;
  return <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
    <Drawer variant="temporary" open={open} onClose={() => setOpen(false)} sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { width } }}>{content}</Drawer>
    <Drawer variant="permanent" sx={{ display: { xs: "none", md: "block" }, width, flexShrink: 0, "& .MuiDrawer-paper": { width } }}>{content}</Drawer>
    <Box sx={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", overflow: "hidden" }}><AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}><Toolbar><IconButton onClick={() => setOpen(true)} sx={{ display: { md: "none" }, mr: 1 }} aria-label="Open menu"><MenuOutlined /></IconButton><Box sx={{ flex: 1, minWidth: 0 }}><Typography fontWeight={800} noWrap>Member Portal</Typography><Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>Welcome, {user.name || "member"}</Typography></Box><Tooltip title="Account menu"><IconButton onClick={(event) => setProfileAnchor(event.currentTarget)} aria-label="Open member account menu" aria-controls={profileAnchor ? "member-profile-menu" : undefined} aria-haspopup="true" aria-expanded={profileAnchor ? "true" : undefined} sx={{ p: .5, flexShrink: 0 }}><Avatar src={user.profileImage}>{user.name?.[0]}</Avatar></IconButton></Tooltip><Menu id="member-profile-menu" anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={closeProfile} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }} slotProps={{ paper: { sx: { width: { xs: "calc(100vw - 32px)", sm: 260 }, maxWidth: 260, mt: 1, borderRadius: 3 } } }}><Box sx={{ px: 2.25, py: 2, display: "flex", alignItems: "center", gap: 1.5 }}><Avatar src={user.profileImage} sx={{ width: 46, height: 46 }}>{user.name?.[0]}</Avatar><Box sx={{ minWidth: 0 }}><Typography fontWeight={800} noWrap>{user.name || "Member"}</Typography><Typography variant="caption" color="text.secondary" noWrap sx={{ display: "block" }}>{user.email || user.patrol || "Rover member"}</Typography></Box></Box><Divider /><MenuItem onClick={showProfile}><ListItemIcon><PersonOutlined fontSize="small" /></ListItemIcon><ListItemText primary="My Profile" /></MenuItem><Divider /><MenuItem onClick={logout} sx={{ color: "error.main" }}><ListItemIcon sx={{ color: "error.main" }}><LogoutOutlined fontSize="small" /></ListItemIcon><ListItemText primary="Sign out" /></MenuItem></Menu></Toolbar></AppBar><Box component="main" sx={{ flex: 1, width: "100%", minWidth: 0, p: { xs: 2, sm: 3, lg: 4 }, maxWidth: 1400, mx: "auto" }}><Outlet /></Box><Footer /></Box>
  </Box>;
}
