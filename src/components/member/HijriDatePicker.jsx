import { useMemo, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { CalendarMonthOutlined, ChevronLeftOutlined, ChevronRightOutlined } from "@mui/icons-material";
import { getHijriMonthDays, gregorianToHijriParts, HIJRI_MONTHS, isValidHijriDate } from "../../utils/memberDates";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const pad = (value) => String(value).padStart(2, "0");
const currentHijri = gregorianToHijriParts(new Date());
const years = Array.from({ length: 401 }, (_, index) => 1600 - index);

export default function HijriDatePicker({ label = "Hijri Date of Birth", value = "", onChange, disabled = false, error = false, helperText = "Select a date from the Dawoodi Bohra Misri calendar", required = false }) {
  const parsed = isValidHijriDate(value) ? value.split("-").map(Number) : [currentHijri.year, currentHijri.month, currentHijri.day];
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(parsed[0]);
  const [month, setMonth] = useState(parsed[1]);
  const days = useMemo(() => getHijriMonthDays(year, month), [month, year]);
  const selectedDay = isValidHijriDate(value) ? Number(value.slice(-2)) : null;
  const openPicker = () => {
    const next = isValidHijriDate(value) ? value.split("-").map(Number) : [currentHijri.year, currentHijri.month];
    setYear(next[0]); setMonth(next[1]); setOpen(true);
  };
  const moveMonth = (offset) => {
    const next = month + offset;
    if (next < 1) { setMonth(12); setYear((current) => Math.max(1200, current - 1)); }
    else if (next > 12) { setMonth(1); setYear((current) => Math.min(1600, current + 1)); }
    else setMonth(next);
  };
  const choose = (day) => { onChange(`${year}-${pad(month)}-${pad(day)}`); setOpen(false); };

  return <>
    <TextField fullWidth label={label} value={value ? `${value} · ${HIJRI_MONTHS[Number(value.slice(5, 7)) - 1] || ""}` : ""} onClick={disabled ? undefined : openPicker} required={required} disabled={disabled} error={error} helperText={helperText} inputProps={{ readOnly: true, "aria-label": label }} InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={disabled ? undefined : openPicker} disabled={disabled} aria-label={`Open ${label} calendar`}><CalendarMonthOutlined /></IconButton></InputAdornment> }} />
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs"><DialogTitle>Select {label.toLowerCase()}</DialogTitle><DialogContent>
      <Stack direction="row" spacing={1} sx={{ pt: 1, mb: 2 }}><TextField select label="Hijri year" value={year} onChange={(event) => setYear(Number(event.target.value))} fullWidth>{years.map((item) => <MenuItem key={item} value={item}>{item} AH</MenuItem>)}</TextField><TextField select label="Month" value={month} onChange={(event) => setMonth(Number(event.target.value))} fullWidth>{HIJRI_MONTHS.map((name, index) => <MenuItem key={name} value={index + 1}>{name}</MenuItem>)}</TextField></Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}><IconButton onClick={() => moveMonth(-1)} aria-label="Previous Hijri month"><ChevronLeftOutlined /></IconButton><Typography fontWeight={900}>{HIJRI_MONTHS[month - 1]} {year} AH</Typography><IconButton onClick={() => moveMonth(1)} aria-label="Next Hijri month"><ChevronRightOutlined /></IconButton></Stack>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: .5 }}>{WEEKDAYS.map((name, index) => <Typography key={`${name}-${index}`} align="center" variant="caption" color="text.secondary" fontWeight={800}>{name}</Typography>)}{days.length ? <>{Array.from({ length: days[0].weekday }, (_, index) => <Box key={`empty-${index}`} />)}{days.map(({ day }) => <Button key={day} onClick={() => choose(day)} variant={selectedDay === day && Number(value.slice(0, 4)) === year && Number(value.slice(5, 7)) === month ? "contained" : "text"} aria-label={`${day} ${HIJRI_MONTHS[month - 1]} ${year} AH`} sx={{ minWidth: 0, aspectRatio: "1", borderRadius: "50%" }}>{day}</Button>)}</> : <Typography color="error" sx={{ gridColumn: "1 / -1", py: 3, textAlign: "center" }}>This month could not be loaded.</Typography>}</Box>
    </DialogContent><DialogActions><Button color="inherit" onClick={() => setOpen(false)}>Cancel</Button></DialogActions></Dialog>
  </>;
}
