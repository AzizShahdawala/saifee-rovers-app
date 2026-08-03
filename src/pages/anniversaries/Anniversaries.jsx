import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Avatar, Box, Button, Chip, Grid, MenuItem, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { CalendarMonthOutlined, CelebrationOutlined, DownloadOutlined, FavoriteOutlined, GroupsOutlined } from "@mui/icons-material";
import API from "../../api/axios";
import { DataTable, PageHeader } from "../../components/common";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const date = (value) => value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "long" }) : "—";
const proximity = (days) => days === 0 ? "Today" : days === 1 ? "Tomorrow" : days > 1 ? `In ${days} days` : `${Math.abs(days)} days ago`;

const downloadCard = (item) => {
  const canvas = document.createElement("canvas"); canvas.width = 1080; canvas.height = 1080;
  const context = canvas.getContext("2d"); const gradient = context.createLinearGradient(0, 0, 1080, 1080);
  gradient.addColorStop(0, "#312E81"); gradient.addColorStop(.52, "#BE185D"); gradient.addColorStop(1, "#F59E0B");
  context.fillStyle = gradient; context.fillRect(0, 0, 1080, 1080); context.fillStyle = "rgba(255,255,255,.13)";
  context.beginPath(); context.arc(540, 470, 360, 0, Math.PI * 2); context.fill();
  context.fillStyle = "#FFFFFF"; context.textAlign = "center"; context.font = "700 40px Arial"; context.fillText("SAIFEE ROVERS", 540, 110);
  context.font = "900 110px Arial"; context.fillText("♥", 540, 345); context.font = "900 70px Arial"; context.fillText("HAPPY ANNIVERSARY", 540, 545);
  context.font = `900 ${item.coupleName.length > 30 ? 42 : 56}px Arial`; context.fillText(item.coupleName, 540, 655);
  context.font = "500 34px Arial"; context.fillText(`Celebrating ${item.years} wonderful years together`, 540, 745);
  context.fillText("Wishing you many more years of happiness and togetherness!", 540, 820);
  context.font = "700 30px Arial"; context.fillText(item.patrol || "Rover Family", 540, 960);
  const link = document.createElement("a"); link.download = `anniversary-wish-${item.memberName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`; link.href = canvas.toDataURL("image/png"); link.click();
};

export default function Anniversaries() {
  const [view, setView] = useState("today"); const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [data, setData] = useState({ anniversaries: [], todayAnniversaries: [], summary: { today: 0, week: 0, month: 0, totalCouples: 0 } });
  const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const load = useCallback(async () => { setLoading(true); setError(""); try { const response = await API.get("/anniversaries", { params: { view, ...(view === "month" ? { month } : {}) } }); setData(response.data); } catch (requestError) { setError(requestError.response?.data?.message || "Unable to load anniversaries"); } finally { setLoading(false); } }, [view, month]);
  useEffect(() => { const id = setTimeout(load, 0); return () => clearTimeout(id); }, [load]);
  const featured = useMemo(() => data.anniversaries.slice(0, 3), [data.anniversaries]);
  const cards = [["Today", data.summary.today, "#BE185D", <FavoriteOutlined />], ["Next 7 Days", data.summary.week, "#7C3AED", <CelebrationOutlined />], ["This Month", data.summary.month, "#0284C7", <CalendarMonthOutlined />], ["Couples", data.summary.totalCouples, "#D97706", <GroupsOutlined />]];
  const columns = [
    { id: "daysAway", label: "When", sortable: true, minWidth: 130, render: (row) => <Chip size="small" label={proximity(row.daysAway)} color={row.daysAway === 0 ? "error" : "default"} sx={{ fontWeight: 800 }} /> },
    { id: "nextAnniversary", label: "Anniversary", sortable: true, minWidth: 150, render: (row) => date(row.nextAnniversary) },
    { id: "coupleName", label: "Couple", sortable: true, minWidth: 250, render: (row) => <Typography fontWeight={850}>{row.coupleName}</Typography> },
    { id: "patrol", label: "Patrol", sortable: true, minWidth: 120, render: (row) => row.patrol || "—" },
    { id: "years", label: "Celebrating", sortable: true, minWidth: 120, render: (row) => `${row.years} years` },
  ];
  return <Box><PageHeader title="Anniversaries" subtitle="Celebrate Saifee Rovers couples and keep track of their special milestones." />{error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    <Paper sx={{ p: { xs: 2.5, md: 4 }, mb: 3, color: "white", overflow: "hidden", position: "relative", background: "linear-gradient(125deg, #312E81 0%, #BE185D 55%, #F59E0B 100%)" }}><FavoriteOutlined sx={{ position: "absolute", right: 35, top: -25, fontSize: 190, opacity: .13 }} /><Typography variant="overline" fontWeight={900}>Anniversary calendar</Typography><Typography variant="h3" fontWeight={950} sx={{ maxWidth: 700, fontSize: { xs: "2rem", md: "3rem" } }}>Celebrating journeys built together.</Typography><Typography sx={{ mt: 1, opacity: .9 }}>See today&apos;s anniversaries and plan ahead for every couple in our rover family.</Typography></Paper>
    <Grid container spacing={2} sx={{ mb: 3 }}>{cards.map(([label, value, color, icon]) => <Grid size={{ xs: 6, md: 3 }} key={label}><Paper sx={{ p: 2.25, border: "1px solid", borderColor: "divider", height: "100%" }}><Stack direction="row" spacing={1.5} alignItems="center"><Avatar sx={{ bgcolor: color }}>{icon}</Avatar><Box><Typography variant="h4" fontWeight={950}>{value}</Typography><Typography color="text.secondary" fontWeight={700}>{label}</Typography></Box></Stack></Paper></Grid>)}</Grid>
    {data.todayAnniversaries.length > 0 && <Box sx={{ mb: 3 }}><Typography variant="h5" fontWeight={950} sx={{ mb: 1.5 }}>Today&apos;s celebrations</Typography><Box sx={{ display: "flex", gap: 2.5, overflowX: "auto", pb: 1.5 }}>{data.todayAnniversaries.map((item) => <Paper key={item.id} sx={{ flex: "0 0 auto", width: { xs: "88vw", sm: 390 }, p: 3, color: "white", textAlign: "center", background: "linear-gradient(140deg, #312E81, #BE185D 58%, #F59E0B)" }}><FavoriteOutlined sx={{ fontSize: 90, opacity: .8 }} /><Typography variant="h4" fontWeight={950}>Happy Anniversary!</Typography><Typography variant="h6" fontWeight={900} sx={{ mt: 1 }}>{item.coupleName}</Typography><Typography sx={{ mt: 2 }}>Celebrating {item.years} wonderful years together.</Typography><Button variant="contained" startIcon={<DownloadOutlined />} onClick={() => downloadCard(item)} sx={{ mt: 2.5, bgcolor: "white", color: "#831843" }}>Download Card</Button></Paper>)}</Box></Box>}
    <Paper sx={{ p: 2, mb: 3, border: "1px solid", borderColor: "divider" }}><Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}><Typography fontWeight={900} sx={{ mr: { md: "auto" } }}>Show anniversaries</Typography><ToggleButtonGroup exclusive value={view} onChange={(_, value) => value && setView(value)} size="small"><ToggleButton value="today">Today</ToggleButton><ToggleButton value="week">Next 7 days</ToggleButton><ToggleButton value="month">Month</ToggleButton></ToggleButtonGroup>{view === "month" && <TextField select size="small" label="Month" value={month} onChange={(event) => setMonth(Number(event.target.value))} sx={{ minWidth: 160 }}>{months.map((name, index) => <MenuItem value={index + 1} key={name}>{name}</MenuItem>)}</TextField>}</Stack></Paper>
    {featured.length > 0 && <Grid container spacing={2} sx={{ mb: 3 }}>{featured.map((item) => <Grid size={{ xs: 12, md: 4 }} key={item.id}><Paper sx={{ p: 2.5, height: "100%", border: "1px solid", borderColor: item.daysAway === 0 ? "error.light" : "divider" }}><Typography color={item.daysAway === 0 ? "error.main" : "primary.main"} fontWeight={900}>{proximity(item.daysAway)}</Typography><Typography variant="h6" fontWeight={900}>{item.coupleName}</Typography><Typography color="text.secondary">{date(item.nextAnniversary)} • {item.years} years</Typography></Paper></Grid>)}</Grid>}
    <Typography variant="h6" fontWeight={900} sx={{ mb: 1.5 }}>{view === "today" ? "Today's anniversaries" : view === "week" ? "Anniversaries in the next 7 days" : `${months[month - 1]} anniversaries`}</Typography><DataTable columns={columns} rows={data.anniversaries} loading={loading} getRowId={(row) => row.id} defaultOrderBy="daysAway" pagination={data.anniversaries.length > 10} emptyTitle="No anniversaries found" emptyDescription="There are no anniversaries for the selected period." />
  </Box>;
}
