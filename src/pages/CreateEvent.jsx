import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Box, Button, Grid, MenuItem, Paper, Stack, TextField } from "@mui/material";
import { SaveOutlined } from "@mui/icons-material";
import { PageHeader } from "../components/common";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const initialForm = { title: "", date: "", startTime: "", endTime: "", venue: "", agenda: "", capacity: "", status: "upcoming" };

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

  return (
    <Box>
      <PageHeader title={readOnly ? "View Event" : id ? "Edit Event" : "Create Event"} subtitle={readOnly ? "Completed and cancelled events are retained as read-only records." : "Schedule the agenda, venue, capacity, and attendance window."} backPath="/events" />
      <Paper component="form" onSubmit={submit} sx={{ p: { xs: 2.5, md: 4 }, border: "1px solid", borderColor: "divider" }}>
        {readOnly && <Alert severity="info" sx={{ mb: 3 }}>This event is {form.status} and can no longer be changed.</Alert>}
        <fieldset disabled={readOnly || loadingEvent || saving} style={{ border: 0, margin: 0, padding: 0, minWidth: 0 }}>
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 8 }}><TextField label="Event title" value={form.title} onChange={change("title")} required /></Grid>
          <Grid size={{ xs: 12, md: 4 }}><TextField select label="Status" value={form.status} onChange={change("status")}><MenuItem value="upcoming">Upcoming</MenuItem><MenuItem value="active">Active</MenuItem><MenuItem value="completed">Completed</MenuItem><MenuItem value="cancelled">Cancelled</MenuItem></TextField></Grid>
          <Grid size={{ xs: 12, sm: 4 }}><TextField label="Date" type="date" value={form.date} onChange={change("date")} required InputLabelProps={{ shrink: true }} /></Grid>
          <Grid size={{ xs: 6, sm: 4 }}><TextField label="Start time" type="time" value={form.startTime} onChange={change("startTime")} InputLabelProps={{ shrink: true }} /></Grid>
          <Grid size={{ xs: 6, sm: 4 }}><TextField label="End time" type="time" value={form.endTime} onChange={change("endTime")} InputLabelProps={{ shrink: true }} /></Grid>
          <Grid size={{ xs: 12, md: 8 }}><TextField label="Venue" value={form.venue} onChange={change("venue")} required /></Grid>
          <Grid size={{ xs: 12, md: 4 }}><TextField label="Capacity" type="number" value={form.capacity} onChange={change("capacity")} inputProps={{ min: 1 }} /></Grid>
          <Grid size={12}><TextField label="Agenda" value={form.agenda} onChange={change("agenda")} multiline minRows={5} placeholder="Add activities, timings, responsibilities, and notes..." /></Grid>
        </Grid>
        </fieldset>
        {error && <Box color="error.main" sx={{ mt: 2 }}>{error}</Box>}
        <Stack direction={{ xs: "column-reverse", sm: "row" }} justifyContent="flex-end" spacing={1.5} sx={{ mt: 3, "& .MuiButton-root": { width: { xs: "100%", sm: "auto" } } }}><Button color="inherit" onClick={() => navigate("/events")}>{readOnly ? "Back to events" : "Cancel"}</Button>{!readOnly && <Button type="submit" variant="contained" startIcon={<SaveOutlined />} disabled={saving || loadingEvent}>{saving ? "Saving..." : id ? "Update Event" : "Create Event"}</Button>}</Stack>
      </Paper>
    </Box>
  );
}
