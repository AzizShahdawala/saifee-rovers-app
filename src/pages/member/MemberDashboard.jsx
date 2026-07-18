import { useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, Grid, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { CalendarMonthOutlined, CheckCircleOutlined, EventAvailableOutlined, ScheduleOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { getMemberDashboard } from "../../services/memberPortalService";
import StatCard from "../../components/common/StatCard";
import StatusChip from "../../components/common/StatusChip";

const date = (value) => value ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
export default function MemberDashboard() {
  const [data, setData] = useState(null); const [error, setError] = useState("");
  useEffect(() => { getMemberDashboard().then(({ data: result }) => setData(result)).catch((e) => setError(e.response?.data?.message || "Could not load your dashboard")); }, []);
  if (!data && !error) return <Box sx={{ display: "grid", placeItems: "center", minHeight: 320 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" action={<Button onClick={() => location.reload()}>Retry</Button>}>{error}</Alert>;
  const { member, stats, recentAttendance = [], upcomingEvents = [] } = data;
  return <Stack spacing={3}>
    <Box><Typography variant="h4" fontWeight={900}>Hello, {member?.name?.split(" ")[0]}</Typography><Typography color="text.secondary">Here is your Rovers activity at a glance.</Typography></Box>
    <Grid container spacing={2}><Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard title="Attendance rate" value={`${stats.attendanceRate}%`} icon={<CheckCircleOutlined />} color="success" /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard title="Events attended" value={stats.attendedEvents} icon={<EventAvailableOutlined />} color="primary" /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard title="Attendance records" value={stats.totalRecords} icon={<CalendarMonthOutlined />} color="info" /></Grid><Grid size={{ xs: 12, sm: 6, lg: 3 }}><StatCard title="Late arrivals" value={stats.lateArrivals} icon={<ScheduleOutlined />} color="warning" /></Grid></Grid>
    <Grid container spacing={3}><Grid size={{ xs: 12, lg: 7 }}><Paper sx={{ p: { xs: 2, sm: 3 }, height: "100%" }}><Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}><Typography variant="h6" fontWeight={800}>Recent attendance</Typography><Button component={Link} to="/member/attendance">View all</Button></Stack>{recentAttendance.length ? <Stack divider={<Box sx={{ borderTop: 1, borderColor: "divider" }} />}>{recentAttendance.map((item) => <Stack key={item._id} direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1.5 }}><Box><Typography fontWeight={700}>{item.event?.title || "Rovers activity"}</Typography><Typography variant="body2" color="text.secondary">{date(item.timestamp)} · {item.event?.venue || "Venue not set"}</Typography></Box><StatusChip status={item.status} /></Stack>)}</Stack> : <Typography color="text.secondary">No attendance has been recorded yet.</Typography>}</Paper></Grid>
    <Grid size={{ xs: 12, lg: 5 }}><Paper sx={{ p: { xs: 2, sm: 3 }, height: "100%" }}><Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}><Typography variant="h6" fontWeight={800}>Upcoming events</Typography><Button component={Link} to="/member/events">View all</Button></Stack>{upcomingEvents.length ? <Stack spacing={2}>{upcomingEvents.map((event) => <Box key={event._id}><Typography fontWeight={700}>{event.title}</Typography><Typography variant="body2" color="text.secondary">{date(event.date)} · {event.startTime || "Time TBA"}</Typography><LinearProgress variant="determinate" value={100} sx={{ mt: 1, opacity: .25 }} /></Box>)}</Stack> : <Typography color="text.secondary">There are no upcoming events.</Typography>}</Paper></Grid></Grid>
  </Stack>;
}
