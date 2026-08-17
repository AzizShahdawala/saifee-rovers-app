import { useCallback, useEffect, useState } from "react";
import { Badge, Box, Button, CircularProgress, Divider, IconButton, Menu, Stack, Typography } from "@mui/material";
import { NotificationsOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const timeAgo = (value) => {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60_000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return hours < 24 ? `${hours}h ago` : `${Math.floor(hours / 24)}d ago`;
};

export default function NotificationBell() {
  const [anchor, setAnchor] = useState(null);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const load = useCallback(async () => {
    try { const { data } = await API.get("/notifications"); setItems(data.notifications || []); setUnread(data.unreadCount || 0); }
    catch { /* Authentication handling is centralized in the API interceptor. */ }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { const initial = setTimeout(load, 0); const timer = setInterval(load, 60_000); return () => { clearTimeout(initial); clearInterval(timer); }; }, [load]);
  const openItem = async (item) => {
    if (!item.readAt) { await API.patch(`/notifications/${item._id}/read`); setUnread((count) => Math.max(0, count - 1)); setItems((current) => current.map((entry) => entry._id === item._id ? { ...entry, readAt: new Date().toISOString() } : entry)); }
    setAnchor(null); if (item.link) navigate(item.link);
  };
  const markAll = async () => { await API.patch("/notifications/read-all"); setUnread(0); setItems((current) => current.map((item) => ({ ...item, readAt: item.readAt || new Date().toISOString() }))); };
  return <>
    <IconButton onClick={(event) => setAnchor(event.currentTarget)} aria-label={`${unread} unread notifications`} aria-controls={anchor ? "notification-menu" : undefined} aria-haspopup="true"><Badge badgeContent={unread} color="error" max={99}><NotificationsOutlined /></Badge></IconButton>
    <Menu id="notification-menu" anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }} slotProps={{ paper: { sx: { width: { xs: "calc(100vw - 24px)", sm: 390 }, maxWidth: 390, maxHeight: "70vh", mt: 1 } } }}>
      <Box sx={{ px: 2, py: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}><Typography fontWeight={900}>Notifications</Typography><Button size="small" onClick={markAll} disabled={!unread}>Mark all read</Button></Box><Divider />
      {loading ? <Box sx={{ py: 4, display: "grid", placeItems: "center" }}><CircularProgress size={26} /></Box> : items.length ? <Stack>{items.map((item) => <Box component="button" type="button" key={item._id} onClick={() => openItem(item)} sx={{ appearance: "none", border: 0, borderBottom: "1px solid", borderColor: "divider", bgcolor: item.readAt ? "background.paper" : "action.hover", p: 2, textAlign: "left", cursor: "pointer", width: "100%", "&:hover": { bgcolor: "action.selected" } }}><Typography fontWeight={item.readAt ? 700 : 900}>{item.title}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>{item.message}</Typography><Typography variant="caption" color="primary.main" sx={{ display: "block", mt: .75 }}>{timeAgo(item.createdAt)}</Typography></Box>)}</Stack> : <Typography color="text.secondary" sx={{ p: 3, textAlign: "center" }}>No notifications yet.</Typography>}
    </Menu>
  </>;
}
