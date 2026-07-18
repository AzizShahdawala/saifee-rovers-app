import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  CalendarMonthOutlined,
  CheckCircleOutlined,
  EventAvailable,
  GroupsOutlined,
  PeopleOutlined,
  TrendingUp,
} from "@mui/icons-material";

import {
  DashboardCard,
  EmptyState,
  Loader,
  PageHeader,
  StatCard,
  StatusChip,
} from "../../components/common";
import AttendanceChart from "../../components/charts/AttendanceChart";
import PatrolChart from "../../components/charts/PatrolChart";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateValue));
};

const formatTime = (dateValue) => {
  if (!dateValue) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateValue));
};

const Dashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalMembers: 0,
    activeEvents: 0,
    todayAttendance: 0,
    attendanceRate: 0,
    recentAttendance: [],
    recentMembers: [],
    upcomingEvents: [],
    attendanceTrend: [],
    patrolDistribution: [],
    recognitionAccuracy: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/dashboard`);

        if (!response.ok) {
          throw new Error("Unable to fetch dashboard data");
        }

        const result = await response.json();

        setDashboardData({
          totalMembers: result.totalMembers ?? result.data?.totalMembers ?? 0,
          activeEvents: result.activeEvents ?? result.data?.activeEvents ?? 0,
          todayAttendance:
            result.todayAttendance ?? result.data?.todayAttendance ?? 0,
          attendanceRate:
            result.attendanceRate ?? result.data?.attendanceRate ?? 0,
          recentAttendance:
            result.recentAttendance ?? result.data?.recentAttendance ?? [],
          recentMembers:
            result.recentMembers ?? result.data?.recentMembers ?? [],
          upcomingEvents:
            result.upcomingEvents ?? result.data?.upcomingEvents ?? [],
          attendanceTrend:
            result.attendanceTrend ?? result.data?.attendanceTrend ?? [],
          patrolDistribution:
            result.patrolDistribution ?? result.data?.patrolDistribution ?? [],
          recognitionAccuracy:
            result.recognitionAccuracy ?? result.data?.recognitionAccuracy ?? 0,
        });
      } catch (error) {
        console.error("Fetch dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loader message="Loading dashboard..." minHeight="70vh" />;
  }

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of members, events and attendance activity."
      />

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Members"
            value={dashboardData.totalMembers}
            icon={<PeopleOutlined />}
            color="primary"
            helperText="Registered members"
            onClick={() => navigate("/members")}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <DashboardCard title="Attendance Analytics" subtitle="Seven-day check-in trend" icon={<TrendingUp />}>
            <AttendanceChart data={dashboardData.attendanceTrend} />
          </DashboardCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <DashboardCard title="Patrol Distribution" subtitle="Members by patrol" icon={<GroupsOutlined />}>
            <PatrolChart data={dashboardData.patrolDistribution} />
          </DashboardCard>
        </Grid>

        <Grid size={12}>
          <DashboardCard title="Recognition Health" subtitle="Live face-recognition readiness" icon={<CheckCircleOutlined />}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={3} divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />}>
              <Box><Typography variant="h4" fontWeight={800} color="success.main">{dashboardData.recognitionAccuracy}%</Typography><Typography color="text.secondary">Recognition accuracy</Typography></Box>
              <Box><Typography variant="h4" fontWeight={800}>{dashboardData.totalMembers}</Typography><Typography color="text.secondary">Enrolled identities</Typography></Box>
              <Box><StatusChip status={dashboardData.recognitionAccuracy >= 80 ? "active" : "pending"} /><Typography color="text.secondary" sx={{ mt: 1 }}>Recognition status</Typography></Box>
            </Stack>
          </DashboardCard>
        </Grid>

        <Grid size={12}>
          <DashboardCard title="Recent Members" subtitle="Latest registrations" icon={<PeopleOutlined />} action={<Button size="small" onClick={() => navigate("/members")}>View Members</Button>}>
            {dashboardData.recentMembers.length ? <Stack direction="row" spacing={2} sx={{ overflowX: "auto", pb: 1 }}>{dashboardData.recentMembers.map((member) => <Paper key={member._id} variant="outlined" sx={{ p: 2, minWidth: 190, boxShadow: "none" }}><Stack direction="row" spacing={1.25} alignItems="center"><Avatar src={member.profileImage}>{member.name?.[0] || "M"}</Avatar><Box><Typography variant="body2" fontWeight={800}>{member.name}</Typography><Typography variant="caption" color="text.secondary">{member.patrol || "No patrol"}</Typography></Box></Stack></Paper>)}</Stack> : <EmptyState title="No recent members" description="New registrations will appear here." minHeight={150} />}
          </DashboardCard>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Active Events"
            value={dashboardData.activeEvents}
            icon={<CalendarMonthOutlined />}
            color="info"
            helperText="Current and upcoming"
            onClick={() => navigate("/events")}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Today's Attendance"
            value={dashboardData.todayAttendance}
            icon={<CheckCircleOutlined />}
            color="success"
            helperText="Members checked in"
            onClick={() => navigate("/attendance")}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Attendance Rate"
            value={`${dashboardData.attendanceRate}%`}
            icon={<TrendingUp />}
            color="warning"
            trend={dashboardData.attendanceRate}
            trendLabel="overall rate"
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 7 }}>
          <DashboardCard
            title="Recent Attendance"
            subtitle="Latest member check-ins"
            icon={<GroupsOutlined />}
            action={
              <Button
                size="small"
                onClick={() => navigate("/attendance")}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                View All
              </Button>
            }
          >
            {dashboardData.recentAttendance.length === 0 ? (
              <EmptyState
                title="No recent attendance"
                description="Attendance records will appear here after members check in."
                minHeight={280}
              />
            ) : (
              <List disablePadding>
                {dashboardData.recentAttendance.map((attendance, index) => (
                  <Box
                    key={attendance._id || `${attendance.memberId}-${index}`}
                  >
                    <ListItem
                      disableGutters
                      secondaryAction={
                        <StatusChip status={attendance.status || "present"} />
                      }
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={attendance.member?.profileImage}
                          sx={{
                            bgcolor: "primary.main",
                          }}
                        >
                          {attendance.member?.name?.charAt(0).toUpperCase() ||
                            "M"}
                        </Avatar>
                      </ListItemAvatar>

                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight={700}>
                            {attendance.member?.name ||
                              attendance.memberName ||
                              "Unknown member"}
                          </Typography>
                        }
                        secondary={`${formatDate(
                          attendance.timestamp,
                        )} at ${formatTime(attendance.timestamp)}`}
                      />
                    </ListItem>

                    {index < dashboardData.recentAttendance.length - 1 && (
                      <Divider />
                    )}
                  </Box>
                ))}
              </List>
            )}
          </DashboardCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <DashboardCard
            title="Upcoming Events"
            subtitle="Events scheduled next"
            icon={<EventAvailable />}
            action={
              <Button
                size="small"
                onClick={() => navigate("/events")}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                View All
              </Button>
            }
          >
            {dashboardData.upcomingEvents.length === 0 ? (
              <EmptyState
                title="No upcoming events"
                description="Create an event to schedule the next attendance session."
                actionLabel="Create Event"
                onAction={() => navigate("/events/create")}
                minHeight={280}
              />
            ) : (
              <Stack spacing={1.5}>
                {dashboardData.upcomingEvents.map((event) => (
                  <Box
                    key={event._id}
                    onClick={() => navigate(`/events/${event._id}/edit`)}
                    sx={{
                      p: 1.75,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      cursor: "pointer",
                      transition: "background-color 0.2s ease",
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={700} noWrap>
                          {event.title}
                        </Typography>

                        <Typography variant="caption" color="text.secondary">
                          {formatDate(event.date)} •{" "}
                          {event.venue || "Venue not specified"}
                        </Typography>
                      </Box>

                      <StatusChip status="upcoming" />
                    </Stack>
                  </Box>
                ))}
              </Stack>
            )}
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
