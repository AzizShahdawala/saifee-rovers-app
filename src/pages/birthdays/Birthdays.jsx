import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Avatar, Box, Button, Chip, Grid, MenuItem, Paper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { CakeOutlined, CalendarMonthOutlined, CelebrationOutlined, DownloadOutlined, FamilyRestroomOutlined, PersonOutlined } from "@mui/icons-material";
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
const initials = (name) => name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();

const downloadBirthdayCard = (item) => {
  const canvas = document.createElement("canvas");
  canvas.width = 1080; canvas.height = 1080;
  const context = canvas.getContext("2d");
  const gradient = context.createLinearGradient(0, 0, 1080, 1080);
  gradient.addColorStop(0, "#4C1D95"); gradient.addColorStop(.5, "#BE185D"); gradient.addColorStop(1, "#F97316");
  context.fillStyle = gradient; context.fillRect(0, 0, 1080, 1080);
  const colors = ["#FDE68A", "#F9A8D4", "#93C5FD", "#A7F3D0", "#FFFFFF"];
  for (let index = 0; index < 70; index += 1) {
    context.fillStyle = colors[index % colors.length]; context.globalAlpha = .75;
    context.save(); context.translate((index * 157) % 1080, (index * 263) % 1080); context.rotate(index * .7);
    context.fillRect(-5, -14, 10, 28); context.restore();
  }
  context.globalAlpha = 1; context.fillStyle = "rgba(255,255,255,.13)";
  context.beginPath(); context.arc(540, 470, 355, 0, Math.PI * 2); context.fill();
  context.fillStyle = "rgba(255,255,255,.2)"; context.beginPath(); context.arc(540, 400, 135, 0, Math.PI * 2); context.fill();
  context.fillStyle = "#FFFFFF"; context.textAlign = "center"; context.textBaseline = "middle";
  context.font = "900 94px Arial"; context.fillText(initials(item.name), 540, 405);
  context.font = "700 40px Arial"; context.fillText("SAIFEE ROVERS", 540, 105);
  context.font = "900 76px Arial"; context.fillText("HAPPY BIRTHDAY", 540, 625);
  context.font = `900 ${item.name.length > 24 ? 50 : 64}px Arial`; context.fillText(item.name, 540, 720);
  context.font = "500 35px Arial"; context.fillText("Wishing you a wonderful year filled with", 540, 810);
  context.fillText("happiness, success and memorable adventures!", 540, 858);
  context.font = "700 30px Arial"; context.fillText(`${typeMeta[item.type].label} • ${item.patrol || "Rover Family"}`, 540, 958);
  const link = document.createElement("a");
  link.download = `birthday-wish-${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
  link.href = canvas.toDataURL("image/png"); link.click();
};

export default function Birthdays() {
  const [view, setView] = useState("today");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [data, setData] = useState({ birthdays: [], todayBirthdays: [], summary: { today: 0, week: 0, month: 0, totalPeople: 0 } });
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

    {data.todayBirthdays.length > 0 && <Box sx={{ mb: 3 }}>
      <Stack direction="row" alignItems="end" justifyContent="space-between" sx={{ mb: 1.5 }}>
        <Box><Typography variant="h5" fontWeight={950}>Today&apos;s celebrations</Typography><Typography color="text.secondary">Download a greeting card and share the birthday joy.</Typography></Box>
        <Chip color="error" icon={<CakeOutlined />} label={`${data.todayBirthdays.length} celebrating`} sx={{ display: { xs: "none", sm: "flex" }, fontWeight: 800 }} />
      </Stack>
      <Box sx={{ display: "flex", gap: 2.5, overflowX: "auto", pb: 1.5, scrollSnapType: "x mandatory", scrollbarWidth: "thin" }}>
        {data.todayBirthdays.map((item) => <Paper key={`wish-${item.id}`} sx={{ flex: "0 0 auto", width: { xs: "88vw", sm: 390 }, minHeight: 440, p: 3, color: "white", textAlign: "center", scrollSnapAlign: "start", overflow: "hidden", position: "relative", background: "linear-gradient(140deg, #4C1D95, #BE185D 58%, #F97316)", border: "1px solid rgba(255,255,255,.25)" }}>
          <CelebrationOutlined sx={{ position: "absolute", left: -20, top: -20, fontSize: 130, opacity: .13, transform: "rotate(-18deg)" }} />
          <CakeOutlined sx={{ position: "absolute", right: -20, bottom: 25, fontSize: 150, opacity: .12, transform: "rotate(12deg)" }} />
          <Typography variant="overline" fontWeight={900} letterSpacing={2}>Saifee Rovers</Typography>
          <Avatar sx={{ width: 112, height: 112, mx: "auto", my: 2, bgcolor: "rgba(255,255,255,.2)", border: "3px solid rgba(255,255,255,.75)", fontSize: 38, fontWeight: 900 }}>{initials(item.name)}</Avatar>
          <Typography variant="h4" fontWeight={950}>Happy Birthday!</Typography>
          <Typography variant="h5" fontWeight={900} sx={{ mt: 1 }}>{item.name}</Typography>
          <Typography sx={{ mt: 2, opacity: .9, minHeight: 52 }}>Wishing you a wonderful year filled with happiness, success and memorable adventures!</Typography>
          <Typography variant="caption" fontWeight={800} sx={{ display: "block", mt: 1.5, opacity: .85 }}>{typeMeta[item.type].label} • {item.patrol || "Rover Family"}</Typography>
          <Button variant="contained" startIcon={<DownloadOutlined />} onClick={() => downloadBirthdayCard(item)} sx={{ mt: 2.5, bgcolor: "white", color: "#7C1D83", fontWeight: 900, "&:hover": { bgcolor: "#FFF7ED" } }}>Download Card</Button>
        </Paper>)}
      </Box>
    </Box>}

    <Paper sx={{ p: 2, mb: 3, border: "1px solid", borderColor: "divider" }}><Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}><Typography fontWeight={900} sx={{ mr: { md: "auto" } }}>Show birthdays</Typography><ToggleButtonGroup exclusive value={view} onChange={(_, value) => value && setView(value)} size="small"><ToggleButton value="today">Today</ToggleButton><ToggleButton value="week">Next 7 days</ToggleButton><ToggleButton value="month">Month</ToggleButton></ToggleButtonGroup>{view === "month" && <TextField select size="small" label="Month" value={month} onChange={(event) => setMonth(Number(event.target.value))} sx={{ minWidth: 160 }}>{months.map((name, index) => <MenuItem value={index + 1} key={name}>{name}</MenuItem>)}</TextField>}</Stack></Paper>

    {featured.length > 0 && <Grid container spacing={2} sx={{ mb: 3 }}>{featured.map((item, index) => <Grid size={{ xs: 12, md: 4 }} key={item.id}><Paper sx={{ p: 2.5, height: "100%", border: "1px solid", borderColor: item.daysAway === 0 ? "error.light" : "divider", background: item.daysAway === 0 ? "linear-gradient(135deg, #FFF1F2, #FFF7ED)" : "background.paper" }}><Stack direction="row" spacing={2}><Avatar sx={{ width: 54, height: 54, bgcolor: ["#DB2777", "#7C3AED", "#0284C7"][index] }}>{item.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("")}</Avatar><Box minWidth={0}><Typography color={item.daysAway === 0 ? "error.main" : "primary.main"} fontWeight={900}>{proximity(item.daysAway)}</Typography><Typography variant="h6" fontWeight={900} noWrap>{item.name}</Typography><Typography color="text.secondary">{typeMeta[item.type].label} • {birthdayDate(item.nextBirthday)}</Typography></Box></Stack></Paper></Grid>)}</Grid>}

    <Typography variant="h6" fontWeight={900} sx={{ mb: 1.5 }}>{view === "today" ? "Today's birthdays" : view === "week" ? "Birthdays in the next 7 days" : `${months[month - 1]} birthdays`}</Typography>
    <DataTable columns={columns} rows={data.birthdays} loading={loading} getRowId={(row) => row.id} defaultOrderBy="daysAway" pagination={data.birthdays.length > 10} emptyTitle="No birthdays found" emptyDescription="There are no birthdays for the selected period." />
  </Box>;
}
