import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import {
  AddOutlined,
  ChatBubbleOutlineOutlined as ChatBubbleOutline,
  CloseOutlined,
  DeleteOutlineOutlined as DeleteOutline,
  Inventory2Outlined,
  LocalOfferOutlined,
  PlayCircleOutlineOutlined as PlayCircleOutline,
  VolunteerActivismOutlined,
} from "@mui/icons-material";
import PageHeader from "../../components/common/PageHeader";
import API from "../../api/axios";
import { getStoredUser } from "../../utils/auth";
import {
  addMarketplaceComment,
  createMarketplaceListing,
  getMarketplaceListings,
  removeMarketplaceComment,
  updateMarketplaceStatus,
} from "../../services/marketplaceService";

const messageOf = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;
const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
const dateTime = (value) =>
  new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
const statusColor = {
  available: "success",
  reserved: "warning",
  sold: "info",
  donated: "secondary",
  withdrawn: "default",
};

function Media({ item, compact = false }) {
  return item?.mediaType === "video" ? (
    <Box
      component="video"
      src={item.url}
      controls={!compact}
      muted={compact}
      preload="metadata"
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        bgcolor: "black",
      }}
    />
  ) : (
    <Box
      component="img"
      src={item?.url}
      alt={item?.originalName || "Marketplace item"}
      loading="lazy"
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
      }}
    />
  );
}

function ListingCard({ listing, onOpen }) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        cursor: "pointer",
        transition: ".2s",
        "&:hover": { transform: "translateY(-3px)", boxShadow: 4 },
      }}
      onClick={() => onOpen(listing)}
    >
      <Box sx={{ height: 210, position: "relative", bgcolor: "grey.100" }}>
        <Media item={listing.media[0]} compact />
        {listing.media[0]?.mediaType === "video" && (
          <PlayCircleOutline
            sx={{
              position: "absolute",
              inset: 0,
              m: "auto",
              fontSize: 54,
              color: "white",
              filter: "drop-shadow(0 2px 5px #000)",
            }}
          />
        )}
        <Chip
          size="small"
          color={statusColor[listing.status]}
          label={listing.status}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            textTransform: "capitalize",
            fontWeight: 800,
          }}
        />
      </Box>
      <CardContent sx={{ flex: 1 }}>
        <Stack direction="row" justifyContent="space-between" gap={1}>
          <Typography variant="h6" fontWeight={900}>
            {listing.title}
          </Typography>
          <Typography
            fontWeight={900}
            color={
              listing.listingType === "donation"
                ? "secondary.main"
                : "primary.main"
            }
          >
            {listing.listingType === "donation" ? "FREE" : money(listing.price)}
          </Typography>
        </Stack>
        <Typography
          color="text.secondary"
          sx={{
            mt: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {listing.description}
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 2 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar
              src={listing.seller?.profileImage}
              sx={{ width: 28, height: 28 }}
            >
              {listing.seller?.name?.[0]}
            </Avatar>
            <Typography variant="body2" fontWeight={700}>
              {listing.seller?.name}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <ChatBubbleOutline fontSize="small" />
            <Typography variant="body2">{listing.comments.length}</Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function Marketplace() {
  const user = getStoredUser() || {};
  const isMember = user.role === "member";
  const [scope, setScope] = useState("browse"),
    [listings, setListings] = useState([]),
    [members, setMembers] = useState([]),
    [selected, setSelected] = useState(null);
  const [createOpen, setCreateOpen] = useState(false),
    [loading, setLoading] = useState(true),
    [saving, setSaving] = useState(false),
    [error, setError] = useState(""),
    [comment, setComment] = useState("");
  const [status, setStatus] = useState("available"),
    [buyerId, setBuyerId] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    listingType: "sale",
    price: "",
    media: [],
  });
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await getMarketplaceListings(
        scope === "browse" ? {} : { scope },
      );
      setListings(data.listings || []);
    } catch (e) {
      setError(messageOf(e, "Could not load marketplace listings"));
    } finally {
      setLoading(false);
    }
  }, [scope]);
  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [load]);
  useEffect(() => {
    if (!isMember) return;
    API.get("/members")
      .then(({ data }) =>
        setMembers(
          (data.members || []).filter(
            (m) => m.status === "active" && m._id !== user.id,
          ),
        ),
      )
      .catch(() => {});
  }, [isMember, user.id]);
  const selectedIsMine = String(selected?.seller?._id) === String(user.id);
  const buyerOptions = useMemo(
    () => members.toSorted((a, b) => a.name.localeCompare(b.name)),
    [members],
  );
  const replaceListing = (listing) => {
    setSelected(listing);
    setListings((items) =>
      items.map((item) => (item._id === listing._id ? listing : item)),
    );
  };
  const submitListing = async (event) => {
    event.preventDefault();
    setError("");
    if (
      form.media.reduce((total, file) => total + file.size, 0) >
      4 * 1024 * 1024
    ) {
      setError(
        "Photos and videos must be 4 MB or less in total. Please compress larger videos.",
      );
      return;
    }
    setSaving(true);
    try {
      const body = new FormData();
      body.append("title", form.title);
      body.append("description", form.description);
      body.append("listingType", form.listingType);
      body.append("price", form.price || "0");
      form.media.forEach((file) => body.append("media", file));
      await createMarketplaceListing(body);
      setForm({
        title: "",
        description: "",
        listingType: "sale",
        price: "",
        media: [],
      });
      setCreateOpen(false);
      setScope("mine");
      await load();
    } catch (e) {
      setError(messageOf(e, "Could not publish listing"));
    } finally {
      setSaving(false);
    }
  };
  const submitComment = async () => {
    if (!comment.trim()) return;
    setSaving(true);
    try {
      const { data } = await addMarketplaceComment(selected._id, comment);
      setComment("");
      replaceListing(data.listing);
    } catch (e) {
      setError(messageOf(e, "Could not add comment"));
    } finally {
      setSaving(false);
    }
  };
  const changeStatus = async () => {
    setSaving(true);
    try {
      const { data } = await updateMarketplaceStatus(
        selected._id,
        status,
        buyerId || undefined,
      );
      replaceListing(data.listing);
    } catch (e) {
      setError(messageOf(e, "Could not update listing"));
    } finally {
      setSaving(false);
    }
  };
  const deleteComment = async (commentId) => {
    try {
      const { data } = await removeMarketplaceComment(selected._id, commentId);
      replaceListing(data.listing);
    } catch (e) {
      setError(messageOf(e, "Could not remove comment"));
    }
  };

  return (
    <Box>
      <PageHeader
        title="Rovers Marketplace"
        subtitle="Sell, donate and discover useful items within the Saifee Rovers community."
        action={
          isMember ? (
            <Button
              variant="contained"
              startIcon={<AddOutlined />}
              onClick={() => setCreateOpen(true)}
            >
              Post an item
            </Button>
          ) : null
        }
      />
      {error && (
        <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Paper variant="outlined" sx={{ mb: 3, overflow: "hidden" }}>
        <Tabs
          value={scope}
          onChange={(_, value) => setScope(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab value="browse" label="Browse all" />
          {isMember && <Tab value="mine" label="My listings & sales" />}
          {isMember && <Tab value="purchases" label="My purchases" />}
        </Tabs>
      </Paper>
      {loading ? (
        <Stack alignItems="center" sx={{ py: 10 }}>
          <CircularProgress />
        </Stack>
      ) : !listings.length ? (
        <Paper variant="outlined">
          <Stack
            alignItems="center"
            textAlign="center"
            spacing={1}
            sx={{ py: 10, px: 3 }}
          >
            <Inventory2Outlined sx={{ fontSize: 64, color: "text.disabled" }} />
            <Typography variant="h6" fontWeight={900}>
              No items here yet
            </Typography>
            <Typography color="text.secondary">
              Be the first member to post something useful.
            </Typography>
          </Stack>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2,minmax(0,1fr))",
              lg: "repeat(3,minmax(0,1fr))",
            },
            gap: 2.5,
          }}
        >
          {listings.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
              onOpen={(item) => {
                setSelected(item);
                setStatus(item.status);
                setBuyerId(item.buyer?._id || "");
              }}
            />
          ))}
        </Box>
      )}
      <Dialog
        open={createOpen}
        onClose={() => !saving && setCreateOpen(false)}
        fullWidth
        maxWidth="sm"
        component="form"
        onSubmit={submitListing}
      >
        <DialogTitle>Post an item</DialogTitle>
        <DialogContent>
          <Stack spacing={2.25} sx={{ pt: 1 }}>
            <TextField
              required
              label="Title"
              value={form.title}
              inputProps={{ maxLength: 120 }}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <TextField
              required
              multiline
              minRows={4}
              label="Description and condition"
              value={form.description}
              inputProps={{ maxLength: 3000 }}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <FormControl>
              <InputLabel>Offer type</InputLabel>
              <Select
                label="Offer type"
                value={form.listingType}
                onChange={(e) =>
                  setForm({ ...form, listingType: e.target.value })
                }
              >
                <MenuItem value="sale">
                  <LocalOfferOutlined fontSize="small" sx={{ mr: 1 }} />
                  For sale
                </MenuItem>
                <MenuItem value="donation">
                  <VolunteerActivismOutlined fontSize="small" sx={{ mr: 1 }} />
                  Free / Donate
                </MenuItem>
              </Select>
            </FormControl>
            {form.listingType === "sale" && (
              <TextField
                required
                type="number"
                label="Asking price (₹)"
                value={form.price}
                inputProps={{ min: 0 }}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            )}
            <Button component="label" variant="outlined">
              Choose photos or videos
              <input
                hidden
                multiple
                required
                type="file"
                accept="image/*,video/*"
                onChange={(e) =>
                  setForm({ ...form, media: [...e.target.files] })
                }
              />
            </Button>
            <Typography variant="caption" color="text.secondary">
              {form.media.length
                ? `${form.media.length} file(s) selected · ${(form.media.reduce((total, file) => total + file.size, 0) / 1024 / 1024).toFixed(1)} MB total`
                : "Add 1–8 compressed photos or short videos, up to 4 MB combined."}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={saving || !form.media.length}
          >
            {saving ? "Publishing…" : "Publish"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        fullWidth
        maxWidth="md"
        scroll="paper"
      >
        <DialogTitle sx={{ pr: 7 }}>
          {selected?.title}
          <IconButton
            onClick={() => setSelected(null)}
            aria-label="Close"
            sx={{ position: "absolute", right: 12, top: 12 }}
          >
            <CloseOutlined />
          </IconButton>
        </DialogTitle>
        {selected && (
          <DialogContent dividers>
            <Stack spacing={3}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: selected.media.length > 1 ? "repeat(2,1fr)" : "1fr",
                  },
                  gap: 1,
                }}
              >
                {selected.media.map((item) => (
                  <Box
                    key={item._id}
                    sx={{
                      height: { xs: 240, sm: 320 },
                      borderRadius: 2,
                      overflow: "hidden",
                      bgcolor: "grey.100",
                    }}
                  >
                    <Media item={item} />
                  </Box>
                ))}
              </Box>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                spacing={1}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar src={selected.seller?.profileImage}>
                    {selected.seller?.name?.[0]}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={800}>
                      {selected.seller?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selected.seller?.patrol} · Posted{" "}
                      {dateTime(selected.createdAt)}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Chip
                    color={statusColor[selected.status]}
                    label={selected.status}
                    sx={{ textTransform: "capitalize" }}
                  />
                  <Chip
                    color={
                      selected.listingType === "donation"
                        ? "secondary"
                        : "primary"
                    }
                    label={
                      selected.listingType === "donation"
                        ? "FREE"
                        : money(selected.price)
                    }
                  />
                </Stack>
              </Stack>
              <Typography sx={{ whiteSpace: "pre-wrap" }}>
                {selected.description}
              </Typography>
              {selected.buyer && (
                <Alert severity="info">
                  {selected.status === "reserved"
                    ? "Reserved for"
                    : selected.status === "donated"
                      ? "Donated to"
                      : "Sold to"}{" "}
                  <strong>{selected.buyer.name}</strong>
                  {selected.completedAt
                    ? ` on ${dateTime(selected.completedAt)}`
                    : ""}
                  .
                </Alert>
              )}
              {selectedIsMine && (
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography fontWeight={800} sx={{ mb: 1.5 }}>
                    Manage this listing
                  </Typography>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={status}
                        label="Status"
                        onChange={(e) => setStatus(e.target.value)}
                      >
                        {[
                          "available",
                          "reserved",
                          selected.listingType === "donation"
                            ? "donated"
                            : "sold",
                          "withdrawn",
                        ].map((value) => (
                          <MenuItem
                            key={value}
                            value={value}
                            sx={{ textTransform: "capitalize" }}
                          >
                            {value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {["reserved", "sold", "donated"].includes(status) && (
                      <FormControl fullWidth>
                        <InputLabel>Receiving member</InputLabel>
                        <Select
                          value={buyerId}
                          label="Receiving member"
                          onChange={(e) => setBuyerId(e.target.value)}
                        >
                          {buyerOptions.map((m) => (
                            <MenuItem key={m._id} value={m._id}>
                              {m.name} · {m.patrol}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                    <Button
                      variant="contained"
                      onClick={changeStatus}
                      disabled={
                        saving ||
                        (["reserved", "sold", "donated"].includes(status) &&
                          !buyerId)
                      }
                    >
                      Save
                    </Button>
                  </Stack>
                </Paper>
              )}
              <Divider />
              <Box>
                <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>
                  Discussion ({selected.comments.length})
                </Typography>
                <Stack spacing={1.5}>
                  {selected.comments.map((item) => (
                    <Paper key={item._id} variant="outlined" sx={{ p: 1.5 }}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Stack direction="row" spacing={1.25}>
                          <Avatar
                            src={item.author?.profileImage}
                            sx={{ width: 34, height: 34 }}
                          >
                            {item.author?.name?.[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={800}>
                              {item.author?.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {dateTime(item.createdAt)}
                            </Typography>
                          </Box>
                        </Stack>
                        {(user.role === "admin" ||
                          String(item.author?._id) === String(user.id)) && (
                          <IconButton
                            size="small"
                            aria-label="Delete comment"
                            onClick={() => deleteComment(item._id)}
                          >
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        )}
                      </Stack>
                      <Typography sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
                        {item.text}
                      </Typography>
                    </Paper>
                  ))}
                  {!selected.comments.length && (
                    <Typography color="text.secondary">
                      No comments yet. Ask a question or show your interest.
                    </Typography>
                  )}
                </Stack>
                {isMember && selected.status !== "withdrawn" && (
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1}
                    sx={{ mt: 2 }}
                  >
                    <TextField
                      fullWidth
                      multiline
                      maxRows={4}
                      placeholder="Write a public comment…"
                      value={comment}
                      inputProps={{ maxLength: 1000 }}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button
                      variant="contained"
                      onClick={submitComment}
                      disabled={saving || !comment.trim()}
                    >
                      Comment
                    </Button>
                  </Stack>
                )}
              </Box>
            </Stack>
          </DialogContent>
        )}
      </Dialog>
    </Box>
  );
}
