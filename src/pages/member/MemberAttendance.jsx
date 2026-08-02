import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Grid, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import DataTable from "../../components/common/DataTable";
import StatusChip from "../../components/common/StatusChip";
import { getMemberAttendance } from "../../services/memberPortalService";

const displayDate = (value) => value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

export default function MemberAttendance() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getMemberAttendance()
      .then(({ data: response }) => setData({ rows: response.attendance || [], summary: response.summary || {} }))
      .catch((requestError) => setError(requestError.response?.data?.message || "Could not load attendance history"));
  }, []);

  const columns = [
    { id: "event", label: "Event", minWidth: 220, render: (row) => <Typography fontWeight={800}>{row.event?.title || "Rovers activity"}</Typography> },
    { id: "date", label: "Event date", sortable: true, minWidth: 140, value: (row) => row.event?.date, render: (row) => displayDate(row.event?.date) },
    { id: "venue", label: "Venue", minWidth: 160, render: (row) => row.event?.venue || "—" },
    { id: "status", label: "Attendance", sortable: true, minWidth: 130, render: (row) => <StatusChip status={row.status} /> },
  ];
  const summary = data?.summary || {};

  return <Stack spacing={3}>
    <Box><Typography variant="h4" fontWeight={900}>My Attendance</Typography><Typography color="text.secondary">Your attendance across all completed events.</Typography></Box>
    {error && <Alert severity="error">{error}</Alert>}
    {data === null && !error ? <CircularProgress /> : <>
      <Grid container spacing={2}>
        {[{ label: "Attendance", value: `${summary.attendanceRate || 0}%` }, { label: "Attended", value: summary.attendedEvents || 0 }, { label: "Missed", value: summary.missedEvents || 0 }, { label: "Total events", value: summary.totalEvents || 0 }].map((item) => <Grid key={item.label} size={{ xs: 6, md: 3 }}><Paper sx={{ p: 2.5, height: "100%", border: "1px solid", borderColor: "divider" }}><Typography variant="caption" color="text.secondary" fontWeight={800}>{item.label.toUpperCase()}</Typography><Typography variant="h4" fontWeight={950} sx={{ mt: .5 }}>{item.value}</Typography></Paper></Grid>)}
      </Grid>
      <Paper sx={{ p: 2.5, border: "1px solid", borderColor: "divider" }}><Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}><Typography fontWeight={800}>Overall attendance</Typography><Typography fontWeight={900} color="primary.main">{summary.attendanceRate || 0}%</Typography></Stack><LinearProgress variant="determinate" value={Math.min(summary.attendanceRate || 0, 100)} sx={{ height: 10, borderRadius: 5 }} /></Paper>
      <DataTable rows={data?.rows || []} columns={columns} getRowId={(row) => row._id} defaultOrderBy="date" defaultOrder="desc" emptyTitle="No completed events" emptyDescription="Your event history and attendance percentage will appear after an event is completed." />
    </>}
  </Stack>;
}
