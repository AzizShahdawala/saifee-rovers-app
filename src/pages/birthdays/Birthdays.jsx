import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Avatar, Box, Chip, Grid, MenuItem, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { CakeOutlined, CalendarMonthOutlined, CelebrationOutlined, FamilyRestroomOutlined, PersonOutlined } from "@mui/icons-material";
import API from "../../api/axios";
import { DataTable, PageHeader } from "../../components/common";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const typeMeta = {
  MEMBER: { label: "Member", color: "primary", icon: <PersonOutlined /> },
  SPOUSE: { label: "Spouse", color: "secondary", icon: <FamilyRestroomOutlined /> },
  CHILD: { label: "Child", color: "success", icon: <CelebrationOutlined /> },
};
const birthdayDate = (value) => new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "long" });
const proximity = (days) => days === 0 ? "Today" : days === 1 ? "Tomorrow" : days > 1 ? `In ${days} days` : `${Math.abs(days)} days ago`;

export default function Birthdays() {
  const [view, setView] = useState("today");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [data, setData] = useState({ birthdays: [], summary: { today: 0, week: 0, month: 0, totalPeople: 0 } });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await API.get("/birthdays", { params: { view, ...(view === "month" ? { month } : {}) } });
      setData(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load birthdays");
    } finally { setLoading(false); }
  }, [view, month]);

  useEffect(() => { const id = setTimeout(load, 0); return () => clearTimeout(id); }, [load]);
  const featured = useMemo(() => data.birthdays.slice(0, 3), [data.birthdays]);
  const cards = [
    ["Today", data.summary.today, "#7C3AED", <CakeOutlined />],
    ["Next 7 Days", data.summary.week, "#DB2777", <CelebrationOutlined />],
    ["This Month", data.summary.month, "#0284C7", <CalendarMonthOutlined />],
    ["People Tracked", data.summary.totalPeople, "#059669", <FamilyRestroomOutlined />],
  ];
  const columns = [
    { id: "daysAway", label: "When", sortable: true, minWidth: 130, render: (row) => <Chip size="small" label={proximity(row.daysAway)} color={row.daysAway === 0 ? "error" : "default"} sx={{ fontWeight: 800 }} /> },
    { id: "nextBirthday", label: "Birthday", sortable: true, minWidth: 150, render: (row) => birthdayDate(row.nextBirthday) },
    { id: "name", label: "Name", sortable: true, minWidth: 190, render: (row) => <Typography fontWeight={850}>{row.name}</Typography> },
    { id: "type", label: "Category", sortable: true, minWidth: 125, render: (row) => <Chip size="small" icon={typeMeta[row.type].icon} label={typeMeta[row.type].label} color={typeMeta[row.type].color} variant="outlined" /> },
    { id: "memberName", label: "Member / Family", sortable: true, minWidth: 190, render: (row) => row.type === "MEMBER" ? "Self" : row.memberName },
    { id: "patrol", label: "Patrol", sortable: true, minWidth: 125, render: (row) => row.patrol || "-" },
    { id: "turningAge", label: "Turning", sortable: true, minWidth: 100, render: (row) => `${row.turningAge} years` },
  ];

  return <Box>
    <PageHeader title="Birthdays" subtitle="Celebrate members and their families, and keep track of every upcoming birthday." />
    {error && <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>{error}</Alert>}

    <Paper sx={{ p: { xs: 2.5, md: 4 }, mb: 3, color: "white", overflow: "hidden", position: "relative", background: "linear-gradient(125deg, #5B21B6 0%, #BE185D 55%, #F97316 100%)" }}>
      <CakeOutlined sx={{ position: "absolute", right: { xs: -25, md: 35 }, top: -28, fontSize: 190, opacity: .13, transform: "rotate(12deg)" }} />
      <Typography variant="overline" fontWeight={900}>Birthday calendar</Typography>
      <Typography variant="h3" fontWeight={950} sx={{ maxWidth: 650, fontSize: { xs: "2rem", md: "3rem" } }}>Every birthday deserves a celebration.</Typography>
      <Typography sx={{ mt: 1, opacity: .9 }}>See who is celebrating today and plan ahead for the people in our rover family.</Typography>
    </Paper>

    <Grid container spacing={2} sx={{ mb: 3 }}>{cards.map(([label, value, color, icon]) => <Grid size={{ xs: 6, md: 3 }} key={label}><Paper sx={{ p: 2.25, border: "1px solid", borderColor: "divider", height: "100%" }}><Stack direction="row" spacing={1.5} alignItems="center"><Avatar sx={{ bgcolor: color }}>{icon}</Avatar><Box><Typography variant="h4" fontWeight={950}>{value}</Typography><Typography color="text.secondary" fontWeight={700}>{label}</Typography></Box></Stack></Paper></Grid>)}</Grid>

    <Paper sx={{ p: 2, mb: 3, border: "1px solid", borderColor: "divider" }}><Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}><Typography fontWeight={900} sx={{ mr: { md: "auto" } }}>Show birthdays</Typography><ToggleButtonGroup exclusive value={view} onChange={(_, value) => value && setView(value)} size="small"><ToggleButton value="today">Today</ToggleButton><ToggleButton value="week">Next 7 days</ToggleButton><ToggleButton value="month">Month</ToggleButton></ToggleButtonGroup>{view === "month" && <TextField select size="small" label="Month" value={month} onChange={(event) => setMonth(Number(event.target.value))} sx={{ minWidth: 160 }}>{months.map((name, index) => <MenuItem value={index + 1} key={name}>{name}</MenuItem>)}</TextField>}</Stack></Paper>

    {featured.length > 0 && <Grid container spacing={2} sx={{ mb: 3 }}>{featured.map((item, index) => <Grid size={{ xs: 12, md: 4 }} key={item.id}><Paper sx={{ p: 2.5, height: "100%", border: "1px solid", borderColor: item.daysAway === 0 ? "error.light" : "divider", background: item.daysAway === 0 ? "linear-gradient(135deg, #FFF1F2, #FFF7ED)" : "background.paper" }}><Stack direction="row" spacing={2}><Avatar sx={{ width: 54, height: 54, bgcolor: ["#DB2777", "#7C3AED", "#0284C7"][index] }}>{item.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("")}</Avatar><Box minWidth={0}><Typography color={item.daysAway === 0 ? "error.main" : "primary.main"} fontWeight={900}>{proximity(item.daysAway)}</Typography><Typography variant="h6" fontWeight={900} noWrap>{item.name}</Typography><Typography color="text.secondary">{typeMeta[item.type].label} • {birthdayDate(item.nextBirthday)}</Typography></Box></Stack></Paper></Grid>)}</Grid>}

    <Typography variant="h6" fontWeight={900} sx={{ mb: 1.5 }}>{view === "today" ? "Today's birthdays" : view === "week" ? "Birthdays in the next 7 days" : `${months[month - 1]} birthdays`}</Typography>
    <DataTable columns={columns} rows={data.birthdays} loading={loading} getRowId={(row) => row.id} defaultOrderBy="daysAway" pagination={data.birthdays.length > 10} emptyTitle="No birthdays found" emptyDescription="There are no birthdays for the selected period." />
  </Box>;
}
