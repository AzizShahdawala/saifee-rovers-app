import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  Alert, Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, Grid, InputLabel, LinearProgress, MenuItem, Paper, Select, Stack, Typography,
} from "@mui/material";
import { CameraAltOutlined, CheckCircleOutlined, PersonAddOutlined, RestartAltOutlined } from "@mui/icons-material";
import { DataTable, PageHeader, StatusChip } from "../components/common";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Attendance() {
  const cameraRef = useRef(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [records, setRecords] = useState([]);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);
  const [manualOpen, setManualOpen] = useState(false);
  const [manual, setManual] = useState({ memberId: "", eventId: "", status: "present" });

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/attendance`).then((response) => response.ok ? response.json() : []),
      fetch(`${API_URL}/members`).then((response) => response.ok ? response.json() : []),
      fetch(`${API_URL}/events`).then((response) => response.ok ? response.json() : []),
    ]).then(([attendanceData, memberData, eventData]) => {
      setRecords(attendanceData.attendance || attendanceData.records || attendanceData.data || (Array.isArray(attendanceData) ? attendanceData : []));
      setMembers(memberData.members || memberData.data || (Array.isArray(memberData) ? memberData : []));
      setEvents(eventData.events || eventData.data || (Array.isArray(eventData) ? eventData : []));
    }).catch(() => setMessage("Live data is unavailable. Scanner controls are still ready."));
  }, []);

  const scanFace = async () => {
    const image = cameraRef.current?.getScreenshot();
    if (!image) { setMessage("Camera image is not ready yet."); return; }
    setScanning(true); setMessage(""); setResult(null);
    try {
      const response = await fetch(`${API_URL}/attendance/recognize`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image }) });
      if (!response.ok) throw new Error("No registered face was recognized");
      const payload = await response.json();
      const recognized = payload.attendance || payload.data || payload;
      setResult(recognized);
      if (recognized._id) setRecords((current) => [recognized, ...current]);
    } catch (error) { setMessage(error.message); } finally { setScanning(false); }
  };

  const saveManual = async () => {
    try {
      const response = await fetch(`${API_URL}/attendance/manual`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(manual) });
      if (!response.ok) throw new Error("Unable to save manual attendance");
      const payload = await response.json();
      setRecords((current) => [payload.attendance || payload.data || payload, ...current]);
      setManualOpen(false);
    } catch (error) { setMessage(error.message); }
  };

  const columns = [
    { id: "memberName", label: "Member", render: (row) => <Stack direction="row" spacing={1} alignItems="center"><Avatar src={row.member?.profileImage} sx={{ width: 34, height: 34 }}>{(row.member?.name || row.memberName || "M")[0]}</Avatar><Typography variant="body2" fontWeight={700}>{row.member?.name || row.memberName || "Unknown member"}</Typography></Stack> },
    { id: "eventName", label: "Event", render: (row) => row.event?.title || row.eventName || "General check-in" },
    { id: "timestamp", label: "Check-in", sortable: true, render: (row) => row.timestamp ? new Date(row.timestamp).toLocaleString("en-IN") : "Just now" },
    { id: "confidence", label: "Confidence", render: (row) => row.confidence != null ? `${Math.round(row.confidence * (row.confidence <= 1 ? 100 : 1))}%` : "Manual" },
    { id: "status", label: "Status", render: (row) => <StatusChip status={row.status || "present"} /> },
  ];

  return (
    <Box>
      <PageHeader title="Attendance Scanner" subtitle="Live face recognition with instant attendance and manual override." actionLabel="Manual Attendance" actionIcon={<PersonAddOutlined />} onAction={() => setManualOpen(true)} />
      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ overflow: "hidden", bgcolor: "#06111f", position: "relative", minHeight: { xs: 320, md: 520 } }}>
            {cameraEnabled ? <Webcam ref={cameraRef} audio={false} screenshotFormat="image/jpeg" videoConstraints={{ facingMode: "user" }} style={{ width: "100%", height: "100%", minHeight: 520, objectFit: "cover", display: "block" }} /> : <Box sx={{ minHeight: 520, display: "grid", placeItems: "center", color: "white" }}><Typography>Camera paused</Typography></Box>}
            <Box sx={{ position: "absolute", inset: "12% 24%", border: "3px solid", borderColor: result ? "success.main" : "rgba(255,255,255,.8)", borderRadius: "48% 48% 42% 42%", boxShadow: "0 0 0 999px rgba(0,10,22,.28)", pointerEvents: "none" }} />
            <Stack direction="row" spacing={1.5} sx={{ position: "absolute", bottom: 18, left: "50%", transform: "translateX(-50%)" }}><Button variant="contained" startIcon={<CameraAltOutlined />} onClick={scanFace} disabled={scanning || !cameraEnabled}>{scanning ? "Recognizing..." : "Scan Face"}</Button><Button variant="contained" color="inherit" startIcon={<RestartAltOutlined />} onClick={() => setCameraEnabled((value) => !value)}>{cameraEnabled ? "Pause" : "Resume"}</Button></Stack>
            {scanning && <LinearProgress sx={{ position: "absolute", left: 0, right: 0, bottom: 0 }} />}
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Stack spacing={2.5}>
            <Paper sx={{ p: 3, border: "1px solid", borderColor: "divider" }}><Typography variant="h6" fontWeight={800}>Recognition Panel</Typography><Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Keep one face centered with good lighting.</Typography>{result ? <Stack alignItems="center" spacing={1.5}><Avatar src={result.member?.profileImage} sx={{ width: 92, height: 92 }} /><Typography variant="h6">{result.member?.name || result.memberName}</Typography><Chip icon={<CheckCircleOutlined />} label="Attendance recorded" color="success" /><Typography color="text.secondary">Confidence: {result.confidence ? `${Math.round(result.confidence * 100)}%` : "Verified"}</Typography></Stack> : <Box sx={{ py: 6, textAlign: "center", color: "text.secondary" }}><CameraAltOutlined sx={{ fontSize: 52, mb: 1 }} /><Typography>Waiting for a face scan</Typography></Box>}</Paper>
            {message && <Alert severity="warning">{message}</Alert>}
            <Paper sx={{ p: 2.5 }}><Typography fontWeight={700}>Session</Typography><Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}><Typography color="text.secondary">Camera</Typography><StatusChip status={cameraEnabled ? "active" : "inactive"} /></Stack><Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}><Typography color="text.secondary">Check-ins</Typography><Typography fontWeight={800}>{records.length}</Typography></Stack></Paper>
          </Stack>
        </Grid>
        <Grid item xs={12}><Typography variant="h6" fontWeight={800} sx={{ mb: 1.5 }}>Live Attendance</Typography><DataTable columns={columns} rows={records} getRowId={(row) => row._id || `${row.memberId}-${row.timestamp}`} defaultOrderBy="timestamp" defaultOrder="desc" emptyTitle="No attendance yet" emptyDescription="Recognized and manually recorded check-ins will appear here." /></Grid>
      </Grid>

      <Dialog open={manualOpen} onClose={() => setManualOpen(false)} fullWidth maxWidth="sm"><DialogTitle>Manual attendance override</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}><FormControl><InputLabel>Member</InputLabel><Select value={manual.memberId} label="Member" onChange={(event) => setManual((current) => ({ ...current, memberId: event.target.value }))}>{members.map((member) => <MenuItem key={member._id} value={member._id}>{member.name}</MenuItem>)}</Select></FormControl><FormControl><InputLabel>Event</InputLabel><Select value={manual.eventId} label="Event" onChange={(event) => setManual((current) => ({ ...current, eventId: event.target.value }))}>{events.map((event) => <MenuItem key={event._id} value={event._id}>{event.title}</MenuItem>)}</Select></FormControl><FormControl><InputLabel>Status</InputLabel><Select value={manual.status} label="Status" onChange={(event) => setManual((current) => ({ ...current, status: event.target.value }))}><MenuItem value="present">Present</MenuItem><MenuItem value="late">Late</MenuItem><MenuItem value="excused">Excused</MenuItem></Select></FormControl></Stack></DialogContent><DialogActions><Button color="inherit" onClick={() => setManualOpen(false)}>Cancel</Button><Button variant="contained" onClick={saveManual} disabled={!manual.memberId || !manual.eventId}>Record attendance</Button></DialogActions></Dialog>
    </Box>
  );
}
