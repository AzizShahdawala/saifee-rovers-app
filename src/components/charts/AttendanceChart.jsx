import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";

export default function AttendanceChart({ data = [] }) {
  const values = data.length ? data : [0, 0, 0, 0, 0, 0, 0];
  const max = Math.max(...values.map((item) => Number(item.value ?? item) || 0), 1);
  const points = values.map((item, index) => {
    const value = Number(item.value ?? item) || 0;
    return `${(index / Math.max(values.length - 1, 1)) * 100},${92 - (value / max) * 76}`;
  }).join(" ");

  return (
    <Box>
      <Box component="svg" viewBox="0 0 100 100" preserveAspectRatio="none" sx={{ width: "100%", height: 210, overflow: "visible" }} aria-label="Attendance trend chart">
        <defs>
          <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1976d2" stopOpacity=".35" />
            <stop offset="100%" stopColor="#1976d2" stopOpacity=".02" />
          </linearGradient>
        </defs>
        {[16, 35, 54, 73, 92].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="#dfe5ec" strokeWidth=".5" />)}
        <polygon points={`0,92 ${points} 100,92`} fill="url(#attendanceFill)" />
        <polyline points={points} fill="none" stroke="#1976d2" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))` }}>
        {values.map((item, index) => <Typography key={index} variant="caption" color="text.secondary" textAlign="center" sx={{ fontSize: { xs: "0.625rem", sm: "0.75rem" }, minWidth: 0 }}>{item.label || ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][index] || index + 1}</Typography>)}
      </Box>
    </Box>
  );
}

AttendanceChart.propTypes = { data: PropTypes.array };
