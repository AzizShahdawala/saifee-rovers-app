import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Box, Button, CircularProgress, Divider, Grid, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { CalendarMonthOutlined, LocationOnOutlined, SaveOutlined, ScheduleOutlined, SubjectOutlined } from "@mui/icons-material";
import { PageHeader, StatusChip } from "../components/common";
import EventMediaGallery from "../components/events/EventMediaGallery";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const initialForm = { title: "", date: "", startTime: "", endTime: "", venue: "", agenda: "", status: "upcoming" };

export default function CreateEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadingEvent, setLoadingEvent] = useState(Boolean(id));

  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}/events/${id}`).then((response) => {
      if (!response.ok) throw new Error("Unable to load event");
      return response.json();
    }).then((result) => {
      const event = result.event || result.data || result;
      setForm({ ...initialForm, ...event, date: event.date?.slice(0, 10) || "" });
    }).catch((requestError) => setError(requestError.message)).finally(() => setLoadingEvent(false));
  }, [id]);

  const readOnly = Boolean(id && ["completed", "cancelled"].includes(form.status));
  const fieldsDisabled = readOnly || loadingEvent || saving;

  const change = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true); setError("");
    try {
      const response = await fetch(`${API_URL}/events${id ? `/${id}` : ""}`, { method: id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || `Unable to ${id ? "update" : "create"} event`);
      navigate("/events");
    } catch (requestError) { setError(requestError.message); } finally { setSaving(false); }
  };

  if (loadingEvent) return <Box sx={{ minHeight: 360, display: "grid", placeItems: "center" }}><CircularProgress /></Box>;

  if (readOnly) return <Box>
    <PageHeader title="View Event" subtitle="Review the event schedule, venue, agenda, and shared memories." backPath="/events" />
    <Stack spacing={2.5}>
      <Alert severity={form.status === "completed" ? "success" : "warning"}>This event is {form.status} and its details are read-only.</Alert>
      <Paper sx={{ p: { xs: 2.5, md: 4 }, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "flex-start" }} spacing={2}><Box sx={{ minWidth: 0 }}><Typography variant="overline" color="primary.main" fontWeight={900}>Event details</Typography><Typography variant="h4" fontWeight={900} sx={{ overflowWrap: "anywhere" }}>{form.title}</Typography></Box><StatusChip status={form.status} /></Stack>
        <Divider sx={{ my: 3 }} />
        <Grid container spacing={2}><Detail icon={<CalendarMonthOutlined />} label="Date" value={form.date ? new Date(`${form.date}T00:00:00`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "Not set"} /><Detail icon={<ScheduleOutlined />} label="Time" value={`${form.startTime || "Not set"}${form.endTime ? ` – ${form.endTime}` : ""}`} /><Detail icon={<LocationOnOutlined />} label="Venue" value={form.venue || "Not set"} /></Grid>
        <Divider sx={{ my: 3 }} /><Stack direction="row" spacing={1.5} alignItems="flex-start"><SubjectOutlined color="primary" /><Box><Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={800}>Agenda</Typography><Typography sx={{ mt: .5, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{form.agenda || "No agenda was added."}</Typography></Box></Stack>
      </Paper>
      {form.status === "completed" && <Paper sx={{ p: { xs: 2.5, md: 4 }, border: "1px solid", borderColor: "divider" }}><EventMediaGallery eventId={id} canUpload /></Paper>}
      <Box><Button color="inherit" onClick={() => navigate("/events")}>Back to events</Button></Box>
    </Stack>
  </Box>;

  return (
    <Box>
      <PageHeader title={readOnly ? "View Event" : id ? "Edit Event" : "Create Event"} subtitle={readOnly ? "Completed and cancelled events are retained as read-only records." : "Schedule the agenda, venue, and attendance window."} backPath="/events" />
      <Paper component="form" onSubmit={submit} sx={{ p: { xs: 2.5, md: 4 }, border: "1px solid", borderColor: "divider", ...(readOnly && { bgcolor: "grey.50", "& .MuiInputBase-root.Mui-disabled": { bgcolor: "grey.200" }, "& .MuiInputBase-input.Mui-disabled": { WebkitTextFillColor: "rgba(0, 0, 0, 0.62)" }, "& .MuiInputLabel-root.Mui-disabled": { color: "text.secondary" } }) }}>
        {readOnly && <Alert severity="info" sx={{ mb: 3 }}>This event is {form.status} and can no longer be changed.</Alert>}
        <fieldset disabled={fieldsDisabled} style={{ border: 0, margin: 0, padding: 0, minWidth: 0 }}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 8 }}><TextField disabled={fieldsDisabled} label="Event title" value={form.title} onChange={change("title")} required /></Grid>
          <Grid size={{ xs: 12, md: 4 }}><TextField disabled={fieldsDisabled} select label="Status" value={form.status} onChange={change("status")}><MenuItem value="upcoming">Upcoming</MenuItem><MenuItem value="active">Active</MenuItem><MenuItem value="completed">Completed</MenuItem><MenuItem value="cancelled">Cancelled</MenuItem></TextField></Grid>
          <Grid size={{ xs: 12, sm: 4 }}><TextField disabled={fieldsDisabled} label="Date" type="date" value={form.date} onChange={change("date")} required InputLabelProps={{ shrink: true }} /></Grid>
          <Grid size={{ xs: 6, sm: 4 }}><TextField disabled={fieldsDisabled} label="Start time" type="time" value={form.startTime} onChange={change("startTime")} InputLabelProps={{ shrink: true }} /></Grid>
          <Grid size={{ xs: 6, sm: 4 }}><TextField disabled={fieldsDisabled} label="End time" type="time" value={form.endTime} onChange={change("endTime")} InputLabelProps={{ shrink: true }} /></Grid>
          <Grid size={12}><TextField disabled={fieldsDisabled} label="Venue" value={form.venue} onChange={change("venue")} required /></Grid>
          <Grid size={12}><TextField disabled={fieldsDisabled} label="Agenda" value={form.agenda} onChange={change("agenda")} multiline minRows={5} placeholder="Add activities, timings, responsibilities, and notes..." /></Grid>
        </Grid>
        </fieldset>
        {error && <Box color="error.main" sx={{ mt: 2 }}>{error}</Box>}
        <Stack direction={{ xs: "column-reverse", sm: "row" }} justifyContent="flex-end" spacing={1.5} sx={{ mt: 3, "& .MuiButton-root": { width: { xs: "100%", sm: "auto" } } }}><Button color="inherit" onClick={() => navigate("/events")}>{readOnly ? "Back to events" : "Cancel"}</Button>{!readOnly && <Button type="submit" variant="contained" startIcon={<SaveOutlined />} disabled={saving || loadingEvent}>{saving ? "Saving..." : id ? "Update Event" : "Create Event"}</Button>}</Stack>
      </Paper>
    </Box>
  );
}

function Detail({ icon, label, value }) { return <Grid size={{ xs: 12, sm: 6 }}><Stack direction="row" spacing={1.5} sx={{ p: 2, borderRadius: 2, bgcolor: "background.default", height: "100%" }}><Box color="primary.main">{icon}</Box><Box sx={{ minWidth: 0 }}><Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={800}>{label}</Typography><Typography fontWeight={700} sx={{ overflowWrap: "anywhere" }}>{value}</Typography></Box></Stack></Grid>; }
