import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, Stack, Typography } from "@mui/material";
import { CalendarMonthOutlined, CollectionsOutlined, LocationOnOutlined, ScheduleOutlined } from "@mui/icons-material";
import { getMemberEvents } from "../../services/memberPortalService";
import EventMediaGallery from "../../components/events/EventMediaGallery";

const displayDate = (value) => new Date(value).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" });

export default function MemberEvents() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [galleryEvent, setGalleryEvent] = useState(null);
  useEffect(() => { getMemberEvents().then(({ data: result }) => setData(result)).catch((requestError) => setError(requestError.response?.data?.message || "Could not load events")); }, []);
  const attendedEvents = useMemo(() => {
    const unique = new Map();
    for (const attendance of data?.attendedEvents || []) if (attendance.event?._id) unique.set(attendance.event._id, attendance.event);
    return [...unique.values()];
  }, [data]);

  return <Stack spacing={3}>
    <Box><Typography variant="h4" fontWeight={900}>Events</Typography><Typography color="text.secondary">View upcoming activities and memories from events you attended.</Typography></Box>
    {error && <Alert severity="error">{error}</Alert>}
    {!data && !error ? <CircularProgress /> : <>
      <Typography variant="h6" fontWeight={800}>Upcoming</Typography>
      <Grid container spacing={2}>{data?.upcomingEvents?.length ? data.upcomingEvents.map((event) => <Grid key={event._id} size={{ xs: 12, md: 6, xl: 4 }}><EventCard event={event} /></Grid>) : <Grid size={12}><Alert severity="info">No upcoming events are scheduled.</Alert></Grid>}</Grid>
      <Typography variant="h6" fontWeight={800}>Previously attended</Typography>
      <Grid container spacing={2}>{attendedEvents.length ? attendedEvents.map((event) => <Grid key={event._id} size={{ xs: 12, md: 6, xl: 4 }}><EventCard event={event} action={event.status === "completed" ? <Button startIcon={<CollectionsOutlined />} onClick={() => setGalleryEvent(event)}>View gallery</Button> : null} /></Grid>) : <Grid size={12}><Alert severity="info">You have no previously attended events yet.</Alert></Grid>}</Grid>
    </>}
    <Dialog open={Boolean(galleryEvent)} onClose={() => setGalleryEvent(null)} fullWidth maxWidth="lg"><DialogTitle>{galleryEvent?.title} gallery</DialogTitle><DialogContent sx={{ pb: 3 }}>{galleryEvent && <EventMediaGallery eventId={galleryEvent._id} />}</DialogContent></Dialog>
  </Stack>;
}

function EventCard({ event, action }) { return <Card sx={{ height: "100%" }}><CardContent><Stack spacing={1.25}><Stack direction="row" justifyContent="space-between"><Chip label={event.status} color={event.status === "completed" ? "success" : "primary"} size="small" /><CalendarMonthOutlined color="primary" /></Stack><Typography variant="h6" fontWeight={800}>{event.title}</Typography><Typography color="text.secondary"><ScheduleOutlined fontSize="inherit" /> {displayDate(event.date)} · {event.startTime || "Time TBA"}</Typography><Typography color="text.secondary"><LocationOnOutlined fontSize="inherit" /> {event.venue || "Venue TBA"}</Typography>{event.agenda && <Typography variant="body2">{event.agenda}</Typography>}{action && <Box sx={{ pt: 1 }}>{action}</Box>}</Stack></CardContent></Card>; }
