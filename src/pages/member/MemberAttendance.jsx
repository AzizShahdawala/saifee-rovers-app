import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Stack, Typography } from "@mui/material";
import DataTable from "../../components/common/DataTable";
import StatusChip from "../../components/common/StatusChip";
import { getMemberAttendance } from "../../services/memberPortalService";

const displayDate = (value) => new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
export default function MemberAttendance() {
  const [rows, setRows] = useState(null); const [error, setError] = useState("");
  useEffect(() => { getMemberAttendance().then(({ data }) => setRows(data.attendance || [])).catch((e) => setError(e.response?.data?.message || "Could not load attendance")); }, []);
  const columns = [{ id: "event", label: "Event", render: (row) => row.event?.title || "Rovers activity" }, { id: "timestamp", label: "Date", render: (row) => displayDate(row.timestamp) }, { id: "venue", label: "Venue", render: (row) => row.event?.venue || "—" }, { id: "status", label: "Status", render: (row) => <StatusChip status={row.status} /> }];
  return <Stack spacing={3}><Box><Typography variant="h4" fontWeight={900}>My attendance</Typography><Typography color="text.secondary">Your complete check-in history.</Typography></Box>{error && <Alert severity="error">{error}</Alert>}{rows === null && !error ? <CircularProgress /> : <DataTable rows={rows || []} columns={columns} getRowId={(row) => row._id} defaultOrderBy="timestamp" defaultOrder="desc" emptyTitle="No attendance records" emptyDescription="Your event check-ins will appear here." />}</Stack>;
}
