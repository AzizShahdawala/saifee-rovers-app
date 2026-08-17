import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Avatar, Box, Chip, Grid, MenuItem, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { AutoAwesomeOutlined, CalendarMonthOutlined, CelebrationOutlined, FamilyRestroomOutlined, NightsStayOutlined, PersonOutlined } from "@mui/icons-material";
import API from "../../api/axios";
import { DataTable, PageHeader } from "../../components/common";
import { HIJRI_MONTHS } from "../../utils/memberDates";

const typeMeta = {
  MEMBER: { label: "Member", color: "primary", icon: <PersonOutlined /> },
  SPOUSE: { label: "Spouse", color: "secondary", icon: <FamilyRestroomOutlined /> },
  CHILD: { label: "Child", color: "success", icon: <CelebrationOutlined /> },
};
const proximity = (days) => days === 0 ? "Today" : days === 1 ? "Tomorrow" : days > 1 ? `In ${days} days` : `${Math.abs(days)} days ago`;
const hijriLabel = (value) => {
  const [year, month, day] = String(value || "").split("-").map(Number);
  return year && month && day ? `${day} ${HIJRI_MONTHS[month - 1]} ${year} AH` : "—";
};

export default function Waras() {
  const [view, setView] = useState("today");
  const [month, setMonth] = useState(1);
  const [data, setData] = useState({ waras: [], todayWaras: [], summary: { today: 0, week: 0, month: 0, totalPeople: 0 }, currentHijriDate: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await API.get("/waras", { params: { view, ...(view === "month" ? { month } : {}) } });
      setData(response.data);
      if (view !== "month" && response.data.currentHijriDate) setMonth(Number(response.data.currentHijriDate.slice(5, 7)));
    } catch (requestError) { setError(requestError.response?.data?.message || "Unable to load Waras"); }
    finally { setLoading(false); }
  }, [month, view]);
  useEffect(() => { const id = setTimeout(load, 0); return () => clearTimeout(id); }, [load]);
  const featured = useMemo(() => data.waras.slice(0, 3), [data.waras]);
  const cards = [["Today", data.summary.today, "#5B21B6", <NightsStayOutlined />], ["Next 7 Days", data.summary.week, "#0F766E", <AutoAwesomeOutlined />], ["This Hijri Month", data.summary.month, "#B45309", <CalendarMonthOutlined />], ["People Tracked", data.summary.totalPeople, "#0369A1", <FamilyRestroomOutlined />]];
  const columns = [
    { id: "daysAway", label: "When", sortable: true, minWidth: 125, render: (row) => <Chip size="small" label={proximity(row.daysAway)} color={row.daysAway === 0 ? "secondary" : "default"} sx={{ fontWeight: 800 }} /> },
    { id: "hijriDateOfBirth", label: "Hijri date", sortable: true, minWidth: 220, render: (row) => hijriLabel(row.hijriDateOfBirth) },
    { id: "name", label: "Name", sortable: true, minWidth: 190, render: (row) => <Typography fontWeight={850}>{row.name}</Typography> },
    { id: "type", label: "Category", sortable: true, minWidth: 125, render: (row) => <Chip size="small" icon={typeMeta[row.type].icon} label={typeMeta[row.type].label} color={typeMeta[row.type].color} variant="outlined" /> },
    { id: "memberName", label: "Member / Family", sortable: true, minWidth: 190, render: (row) => row.type === "MEMBER" ? "Self" : row.memberName },
    { id: "patrol", label: "Patrol", sortable: true, minWidth: 120, render: (row) => row.patrol || "—" },
    { id: "turningAge", label: "Waras", sortable: true, minWidth: 100, render: (row) => `${row.turningAge}` },
  ];
  return <Box>
    <PageHeader title="Waras" subtitle="Track members and their families by their Umm al-Qura birth dates." />
    {error ? <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>{error}</Alert> : null}
    <Paper sx={{ p: { xs: 2.5, md: 4 }, mb: 3, color: "white", overflow: "hidden", position: "relative", background: "linear-gradient(125deg, #172554 0%, #5B21B6 52%, #0F766E 100%)" }}><NightsStayOutlined sx={{ position: "absolute", right: { xs: -20, md: 35 }, top: -25, fontSize: 190, opacity: .14 }} /><Typography variant="overline" fontWeight={900}>Islamic calendar</Typography><Typography variant="h3" fontWeight={950} sx={{ maxWidth: 700, fontSize: { xs: "2rem", md: "3rem" } }}>Waras Mubarak.</Typography><Typography sx={{ mt: 1, opacity: .9 }}>Today is {hijriLabel(data.currentHijriDate)}. Plan ahead for every member and family Waras.</Typography></Paper>
    <Grid container spacing={2} sx={{ mb: 3 }}>{cards.map(([label, value, color, icon]) => <Grid size={{ xs: 6, md: 3 }} key={label}><Paper sx={{ p: 2.25, border: "1px solid", borderColor: "divider", height: "100%" }}><Stack direction="row" spacing={1.5} alignItems="center"><Avatar sx={{ bgcolor: color }}>{icon}</Avatar><Box><Typography variant="h4" fontWeight={950}>{value}</Typography><Typography color="text.secondary" fontWeight={700}>{label}</Typography></Box></Stack></Paper></Grid>)}</Grid>
    {featured.length ? <Grid container spacing={2} sx={{ mb: 3 }}>{featured.map((item) => <Grid size={{ xs: 12, md: 4 }} key={item.id}><Paper sx={{ p: 2.5, height: "100%", border: "1px solid", borderColor: item.daysAway === 0 ? "secondary.light" : "divider", background: item.daysAway === 0 ? "linear-gradient(135deg, #F5F3FF, #ECFDF5)" : "background.paper" }}><Stack direction="row" spacing={2}><Avatar sx={{ bgcolor: "secondary.main" }}>{item.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("")}</Avatar><Box minWidth={0}><Typography color="secondary.main" fontWeight={900}>{proximity(item.daysAway)}</Typography><Typography variant="h6" fontWeight={900} noWrap>{item.name}</Typography><Typography color="text.secondary">{typeMeta[item.type].label} · {hijriLabel(item.hijriDateOfBirth)}</Typography></Box></Stack></Paper></Grid>)}</Grid> : null}
    <Paper sx={{ p: 2, mb: 3, border: "1px solid", borderColor: "divider" }}><Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}><Typography fontWeight={900} sx={{ mr: { md: "auto" } }}>Show Waras</Typography><ToggleButtonGroup exclusive value={view} onChange={(_, value) => value && setView(value)} size="small"><ToggleButton value="today">Today</ToggleButton><ToggleButton value="week">Next 7 days</ToggleButton><ToggleButton value="month">Hijri month</ToggleButton></ToggleButtonGroup>{view === "month" ? <TextField select size="small" label="Hijri month" value={month} onChange={(event) => setMonth(Number(event.target.value))} sx={{ minWidth: 190 }}>{HIJRI_MONTHS.map((name, index) => <MenuItem value={index + 1} key={name}>{name}</MenuItem>)}</TextField> : null}</Stack></Paper>
    <Typography variant="h6" fontWeight={900} sx={{ mb: 1.5 }}>{view === "today" ? "Today's Waras" : view === "week" ? "Waras in the next 7 days" : `${HIJRI_MONTHS[month - 1]} Waras`}</Typography><DataTable columns={columns} rows={data.waras} loading={loading} getRowId={(row) => row.id} defaultOrderBy="daysAway" pagination={data.waras.length > 10} emptyTitle="No Waras found" emptyDescription="There are no Waras for the selected Islamic-calendar period." />
  </Box>;
}
