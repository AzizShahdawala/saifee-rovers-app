import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { AddCircleOutlineOutlined, EmojiEventsOutlined, LeaderboardOutlined, RemoveCircleOutlineOutlined } from "@mui/icons-material";
import API from "../../api/axios";
import { DataTable, PageHeader } from "../../components/common";

const initialEntry = { patrol: "", operation: "ADD", points: "", reason: "", date: new Date().toISOString().slice(0, 10) };
const podium = [
  { label: "1st", color: "#B7791F", background: "linear-gradient(135deg, #FFF4C7, #FFE08A)" },
  { label: "2nd", color: "#5F6B7A", background: "linear-gradient(135deg, #F5F7FA, #D9E0E8)" },
  { label: "3rd", color: "#9C5A2E", background: "linear-gradient(135deg, #FBE4D5, #E8B58D)" },
];
const date = (value) => value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "-";

export default function PatrolScoreboard({ readOnly = false }) {
  const [data, setData] = useState({ scoreboard: [], entries: [], years: [], eligiblePatrols: [] });
  const [filters, setFilters] = useState({ year: "all", dateFrom: "", dateTo: "" });
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [entry, setEntry] = useState(initialEntry);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const params = {};
      if (filters.year !== "all") params.year = filters.year;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;
      const response = await API.get("/patrol-scores", { params });
      setData(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load patrol scores");
    } finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { const timeoutId = setTimeout(load, 0); return () => clearTimeout(timeoutId); }, [load]);

  const leaders = useMemo(() => data.scoreboard.slice(0, 3), [data.scoreboard]);
  const changeFilter = (field) => (event) => setFilters((current) => ({ ...current, [field]: event.target.value, ...(field === "year" && event.target.value !== "all" ? { dateFrom: "", dateTo: "" } : {}), ...(field !== "year" && event.target.value ? { year: "all" } : {}) }));
  const openAdd = () => { setError(""); setEntry({ ...initialEntry, patrol: data.eligiblePatrols[0] || "" }); setDialogOpen(true); };
  const save = async () => {
    const amount = Number(entry.points);
    if (!entry.patrol || !Number.isInteger(amount) || amount <= 0 || !entry.reason.trim() || !entry.date) { setError("Patrol, whole-number points, reason and date are required."); return; }
    setSaving(true); setError("");
    try {
      await API.post("/patrol-scores", { patrol: entry.patrol, points: entry.operation === "DEDUCT" ? -amount : amount, reason: entry.reason.trim(), date: entry.date });
      setDialogOpen(false); await load();
    } catch (requestError) { setError(requestError.response?.data?.message || "Unable to save points"); }
    finally { setSaving(false); }
  };

  const scoreColumns = [
    { id: "rank", label: "Rank", sortable: true, minWidth: 85, render: (row) => <Chip size="small" label={`#${row.rank}`} sx={row.rank <= 3 ? { fontWeight: 900, color: podium[row.rank - 1].color, bgcolor: "rgba(255,255,255,.72)" } : { fontWeight: 800 }} /> },
    { id: "patrol", label: "Patrol", sortable: true, minWidth: 160, render: (row) => <Typography fontWeight={900}>{row.patrol}</Typography> },
    { id: "added", label: "Points Added", sortable: true, minWidth: 140, render: (row) => <Typography color="success.main" fontWeight={800}>+{row.added}</Typography> },
    { id: "deducted", label: "Points Deducted", sortable: true, minWidth: 155, render: (row) => <Typography color="error.main" fontWeight={800}>-{row.deducted}</Typography> },
    { id: "score", label: "Total Score", sortable: true, minWidth: 140, render: (row) => <Typography variant="h6" fontWeight={900} color={row.score >= 0 ? "primary.main" : "error.main"}>{row.score}</Typography> },
    { id: "entries", label: "Transactions", sortable: true, minWidth: 130 },
  ];
  const historyColumns = [
    { id: "date", label: "Date", sortable: true, minWidth: 130, render: (row) => date(row.date) },
    { id: "patrol", label: "Patrol", sortable: true, minWidth: 130, render: (row) => <Typography fontWeight={800}>{row.patrol}</Typography> },
    { id: "points", label: "Points", sortable: true, minWidth: 110, render: (row) => <Chip size="small" icon={row.points > 0 ? <AddCircleOutlineOutlined /> : <RemoveCircleOutlineOutlined />} label={`${row.points > 0 ? "+" : ""}${row.points}`} color={row.points > 0 ? "success" : "error"} /> },
    { id: "reason", label: "Reason", minWidth: 300, render: (row) => row.reason },
  ];

  return <Box>
    <PageHeader title={readOnly ? "Patrol Dashboard" : "Patrol Scoreboard"} subtitle={readOnly ? "See the current patrol leaders and every points transaction. Scores are managed by administrators." : "Award or deduct patrol points and review rankings for any date range."} actionLabel={readOnly ? undefined : "Add Points"} actionIcon={readOnly ? undefined : <LeaderboardOutlined />} onAction={readOnly ? undefined : openAdd} />
    {error && !dialogOpen && <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>{error}</Alert>}
    {readOnly && <Alert severity="info" sx={{ mb: 2 }}>This dashboard is read-only. Only administrators can add or deduct patrol points.</Alert>}

    <Grid container spacing={2.5} sx={{ mb: 3 }}>{leaders.map((leader, index) => <Grid size={{ xs: 12, md: 4 }} key={leader.patrol}><Paper sx={{ p: 3, minHeight: 170, background: podium[index].background, border: "1px solid rgba(0,0,0,.08)", position: "relative", overflow: "hidden" }}><EmojiEventsOutlined sx={{ position: "absolute", right: 18, top: 16, fontSize: 72, color: podium[index].color, opacity: .22 }} /><Typography variant="overline" fontWeight={900} sx={{ color: podium[index].color }}>{podium[index].label} Place</Typography><Typography variant="h4" fontWeight={950}>{leader.patrol}</Typography><Typography variant="h3" fontWeight={950} sx={{ color: podium[index].color, mt: 1 }}>{leader.score}</Typography><Typography variant="caption" fontWeight={700}>POINTS</Typography></Paper></Grid>)}</Grid>

    <Paper sx={{ p: 2, mb: 3, border: "1px solid", borderColor: "divider" }}><Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}><Typography fontWeight={900} sx={{ mr: { md: "auto" } }}>Ranking period</Typography><TextField select size="small" label="Year" value={filters.year} onChange={changeFilter("year")} sx={{ minWidth: 150 }}><MenuItem value="all">All years</MenuItem>{data.years.map((year) => <MenuItem key={year} value={String(year)}>{year}</MenuItem>)}</TextField><TextField size="small" type="date" label="From" value={filters.dateFrom} onChange={changeFilter("dateFrom")} slotProps={{ inputLabel: { shrink: true } }} /><TextField size="small" type="date" label="To" value={filters.dateTo} onChange={changeFilter("dateTo")} slotProps={{ inputLabel: { shrink: true } }} /><Button color="inherit" onClick={() => setFilters({ year: "all", dateFrom: "", dateTo: "" })}>Clear</Button></Stack></Paper>

    <Typography variant="h6" fontWeight={900} sx={{ mb: 1.5 }}>Patrol rankings</Typography>
    <DataTable columns={scoreColumns} rows={data.scoreboard} loading={loading} getRowId={(row) => row.patrol} defaultOrderBy="rank" pagination={false} rowSx={(row) => row.rank <= 3 ? { background: podium[row.rank - 1].background } : {}} emptyTitle="No eligible patrols" />

    <Typography variant="h6" fontWeight={900} sx={{ mt: 4, mb: 1.5 }}>Points history</Typography>
    <DataTable columns={historyColumns} rows={data.entries} loading={loading} getRowId={(row) => row._id} defaultOrderBy="date" defaultOrder="desc" emptyTitle="No point transactions" emptyDescription="Add points or change the selected period." />

    {!readOnly && <Dialog open={dialogOpen} onClose={() => !saving && setDialogOpen(false)} fullWidth maxWidth="sm"><DialogTitle>Add patrol points</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}>{error && <Alert severity="error">{error}</Alert>}<TextField select label="Patrol" value={entry.patrol} onChange={(event) => setEntry((current) => ({ ...current, patrol: event.target.value }))} required>{data.eligiblePatrols.map((patrol) => <MenuItem key={patrol} value={patrol}>{patrol}</MenuItem>)}</TextField><TextField select label="Operation" value={entry.operation} onChange={(event) => setEntry((current) => ({ ...current, operation: event.target.value }))}><MenuItem value="ADD">Add points</MenuItem><MenuItem value="DEDUCT">Deduct points</MenuItem></TextField><TextField label="Points" type="number" value={entry.points} onChange={(event) => setEntry((current) => ({ ...current, points: event.target.value }))} inputProps={{ min: 1, max: 10000, step: 1 }} required /><TextField label="Reason" value={entry.reason} onChange={(event) => setEntry((current) => ({ ...current, reason: event.target.value }))} multiline minRows={3} inputProps={{ maxLength: 500 }} required /><TextField type="date" label="Date" value={entry.date} onChange={(event) => setEntry((current) => ({ ...current, date: event.target.value }))} slotProps={{ inputLabel: { shrink: true } }} required /></Stack></DialogContent><DialogActions><Button color="inherit" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button><Button variant="contained" color={entry.operation === "DEDUCT" ? "error" : "primary"} onClick={save} disabled={saving}>{saving ? "Saving..." : entry.operation === "DEDUCT" ? "Deduct Points" : "Add Points"}</Button></DialogActions></Dialog>}
  </Box>;
}
