import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import {
  BrokenImageOutlined,
  CloseOutlined,
  CollectionsOutlined,
  ImageOutlined,
  PlayArrowRounded,
  VideocamOutlined,
} from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import { getGalleryMedia } from "../../services/eventMediaService";

const INITIAL_EVENT_COUNT = 3;
const filters = [
  { value: "all", label: "All", icon: <CollectionsOutlined /> },
  { value: "image", label: "Photos", icon: <ImageOutlined /> },
  { value: "video", label: "Videos", icon: <VideocamOutlined /> },
];

const messageOf = (error, fallback) => error.response?.data?.message || error.message || fallback;
const formatDate = (value) => value
  ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
  : "Date unavailable";

function MediaTile({ item, onOpen }) {
  const [failed, setFailed] = useState(false);
  const isVideo = item.mediaType === "video";

  return <Box
    component="button"
    type="button"
    onClick={() => onOpen(item)}
    aria-label={`Open ${isVideo ? "video" : "photo"} ${item.originalName || "media"}`}
    sx={{
      position: "relative", border: 0, p: 0, overflow: "hidden", cursor: "pointer",
      bgcolor: "grey.200", aspectRatio: { xs: "1 / 1", sm: "4 / 3" }, borderRadius: 2,
      "&:hover .gallery-media": { transform: "scale(1.04)" },
      "&:focus-visible": { outline: "3px solid", outlineColor: "primary.main", outlineOffset: 2 },
    }}
  >
    {failed ? <Stack alignItems="center" justifyContent="center" sx={{ height: "100%", color: "text.secondary" }}><BrokenImageOutlined /><Typography variant="caption">Preview unavailable</Typography></Stack>
      : isVideo
        ? <Box component="video" className="gallery-media" src={item.url} muted preload="metadata" onError={() => setFailed(true)} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .25s" }} />
        : <Box component="img" className="gallery-media" src={item.url} alt={item.originalName || "Event photo"} loading="lazy" onError={() => setFailed(true)} sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .25s" }} />}
    {isVideo && !failed && <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", bgcolor: "rgba(0,0,0,.12)" }}><Box sx={{ display: "grid", placeItems: "center", width: 46, height: 46, borderRadius: "50%", bgcolor: "rgba(0,0,0,.65)", color: "white" }}><PlayArrowRounded fontSize="large" /></Box></Box>}
  </Box>;
}

export default function Gallery() {
  const [type, setType] = useState("all");
  const [events, setEvents] = useState([]);
  const [summary, setSummary] = useState({ total: 0, images: 0, videos: 0, events: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let current = true;
    getGalleryMedia(type)
      .then(({ data }) => { if (current) { setEvents(data.events || []); setSummary(data.summary || {}); } })
      .catch((requestError) => { if (current) { setEvents([]); setError(messageOf(requestError, "Could not load the gallery")); } })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [type, retryKey]);

  const visibleEvents = useMemo(() => showAll ? events : events.slice(0, INITIAL_EVENT_COUNT), [events, showAll]);
  const totalForTab = type === "image" ? summary.images : type === "video" ? summary.videos : summary.total;
  const changeType = (_, value) => {
    if (value === type) return;
    setType(value); setLoading(true); setError(""); setShowAll(false);
  };
  const retry = () => {
    setLoading(true); setError(""); setRetryKey((value) => value + 1);
  };

  return <Box>
    <PageHeader title="Gallery" subtitle="Browse event memories by date, with photos and videos together or separately." />
    <Paper sx={{ border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
      <Box sx={{ px: { xs: 1, sm: 2.5 }, pt: 1 }}>
        <Tabs value={type} onChange={changeType} variant="fullWidth" aria-label="Gallery media type">
          {filters.map((filter) => <Tab key={filter.value} value={filter.value} icon={filter.icon} iconPosition="start" label={filter.label} />)}
        </Tabs>
      </Box>

      {error && <Alert severity="error" sx={{ m: 2 }} action={<Button color="inherit" size="small" onClick={retry}>Retry</Button>}>{error}</Alert>}
      {loading ? <Stack alignItems="center" spacing={1.5} sx={{ py: 10 }}><CircularProgress /><Typography color="text.secondary">Loading event memories…</Typography></Stack>
        : !events.length ? <Stack alignItems="center" textAlign="center" spacing={1} sx={{ px: 3, py: 10 }}><CollectionsOutlined sx={{ fontSize: 62, color: "text.disabled" }} /><Typography variant="h6" fontWeight={900}>No {type === "all" ? "event media" : type === "image" ? "photos" : "videos"} yet</Typography><Typography color="text.secondary" sx={{ maxWidth: 480 }}>Uploads from completed events will automatically appear here, grouped by event date.</Typography></Stack>
          : <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}><Typography fontWeight={800}>{totalForTab} {totalForTab === 1 ? "item" : "items"} across {events.length} {events.length === 1 ? "event" : "events"}</Typography>{events.length > INITIAL_EVENT_COUNT && <Button onClick={() => setShowAll((value) => !value)}>{showAll ? "Show less" : `Show all (${events.length})`}</Button>}</Stack>
            <Stack spacing={4}>{visibleEvents.map(({ event, media }) => <Box key={event._id} component="section" aria-labelledby={`gallery-event-${event._id}`}>
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={0.5} sx={{ mb: 1.5 }}><Box><Typography id={`gallery-event-${event._id}`} variant="h6" fontWeight={900}>{event.title || "Untitled event"}</Typography><Typography variant="body2" color="text.secondary">{formatDate(event.date)}{event.venue ? ` · ${event.venue}` : ""}</Typography></Box><Chip size="small" label={`${media.length} ${media.length === 1 ? "item" : "items"}`} /></Stack>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(3, minmax(0, 1fr))", sm: "repeat(4, minmax(0, 1fr))", md: "repeat(5, minmax(0, 1fr))" }, gap: { xs: 0.75, sm: 1.25 } }}>{media.map((item) => <MediaTile key={item._id} item={item} onOpen={setSelected} />)}</Box>
            </Box>)}</Stack>
          </Box>}
    </Paper>

    <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullScreen PaperProps={{ sx: { bgcolor: "rgba(0,0,0,.96)" } }}>
      <DialogContent sx={{ p: 0, display: "grid", placeItems: "center", position: "relative" }}>
        <IconButton onClick={() => setSelected(null)} aria-label="Close preview" sx={{ position: "absolute", zIndex: 1, top: 16, right: 16, color: "white", bgcolor: "rgba(255,255,255,.12)" }}><CloseOutlined /></IconButton>
        {selected?.mediaType === "video" ? <Box component="video" src={selected?.url} controls autoPlay sx={{ maxWidth: "100%", maxHeight: "100vh" }} /> : <Box component="img" src={selected?.url} alt={selected?.originalName || "Event photo"} sx={{ maxWidth: "100%", maxHeight: "100vh", objectFit: "contain" }} />}
      </DialogContent>
    </Dialog>
  </Box>;
}
