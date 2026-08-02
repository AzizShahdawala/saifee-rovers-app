import { useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, Grid, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { CloudUploadOutlined, CollectionsOutlined, DownloadOutlined } from "@mui/icons-material";
import { getEventMedia, uploadEventMedia } from "../../services/eventMediaService";

const messageOf = (error, fallback) => error.response?.data?.message || error.message || fallback;

export default function EventMediaGallery({ eventId, canUpload = false }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = async () => {
    try { const { data } = await getEventMedia(eventId); setMedia(data.media || []); }
    catch (requestError) { setError(messageOf(requestError, "Could not load event photos and videos")); }
    finally { setLoading(false); }
  };
  useEffect(() => {
    let current = true;
    getEventMedia(eventId).then(({ data }) => { if (current) setMedia(data.media || []); }).catch((requestError) => { if (current) setError(messageOf(requestError, "Could not load event photos and videos")); }).finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [eventId]);

  const selectFiles = async (event) => {
    const files = [...(event.target.files || [])];
    event.target.value = "";
    if (!files.length) return;
    setUploading(true); setProgress(0); setError(""); setNotice("");
    try {
      const { data } = await uploadEventMedia(eventId, files, ({ loaded, total }) => setProgress(total ? Math.round((loaded / total) * 100) : 0));
      setNotice(data.message); await load();
    } catch (requestError) { setError(messageOf(requestError, "Could not upload event media")); }
    finally { setUploading(false); setProgress(0); }
  };

  return <Stack spacing={2}>
    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={1.5}><Box><Typography variant="h6" fontWeight={900}>Event photos and videos</Typography><Typography variant="body2" color="text.secondary">Relive the completed event through its shared gallery.</Typography></Box>{canUpload && <Button component="label" variant="contained" startIcon={<CloudUploadOutlined />} disabled={uploading}>Upload photos or videos<input hidden multiple type="file" accept="image/*,video/*" onChange={selectFiles} /></Button>}</Stack>
    {uploading && <Box><LinearProgress variant={progress ? "determinate" : "indeterminate"} value={progress} /><Typography variant="caption" color="text.secondary">Uploading{progress ? ` ${progress}%` : "…"} — keep this page open for large files.</Typography></Box>}
    {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}{notice && <Alert severity="success" onClose={() => setNotice("")}>{notice}</Alert>}
    {loading ? <Box sx={{ py: 4, textAlign: "center" }}><CircularProgress /></Box> : media.length ? <Grid container spacing={2}>{media.map((item) => <Grid key={item._id} size={{ xs: 12, sm: 6, lg: 4 }}><Paper variant="outlined" sx={{ overflow: "hidden", height: "100%" }}>{item.mediaType === "video" ? <Box component="video" src={item.url} controls preload="metadata" sx={{ width: "100%", aspectRatio: "16/10", display: "block", bgcolor: "black", objectFit: "contain" }} /> : <Box component="img" src={item.url} alt={item.originalName} loading="lazy" sx={{ width: "100%", aspectRatio: "16/10", display: "block", objectFit: "cover" }} />}<Box sx={{ p: 1.5 }}><Typography variant="body2" fontWeight={700} noWrap title={item.originalName}>{item.originalName}</Typography><Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}><Typography variant="caption" color="text.secondary">{new Date(item.createdAt).toLocaleString("en-IN")}</Typography><Button component="a" href={item.downloadUrl || item.url} size="small" startIcon={<DownloadOutlined />}>Download</Button></Stack></Box></Paper></Grid>)}</Grid> : <Paper variant="outlined" sx={{ py: 5, px: 2, textAlign: "center", bgcolor: "background.default" }}><CollectionsOutlined sx={{ fontSize: 48, color: "text.disabled" }} /><Typography fontWeight={800} sx={{ mt: 1 }}>No event media uploaded yet</Typography><Typography variant="body2" color="text.secondary">Photos and videos shared for this event will appear here.</Typography></Paper>}
  </Stack>;
}
