import PropTypes from "prop-types";
import { Box, Stack, Typography } from "@mui/material";

const colors = ["#1976d2", "#16a085", "#f59e0b", "#8b5cf6", "#ef5350"];

export default function PatrolChart({ data = [] }) {
  const items = data.length ? data : [{ label: "No data", value: 1 }];
  const total = items.reduce((sum, item) => sum + (Number(item.value) || 0), 0) || 1;
  const gradient = items.map((item, index) => {
    const start = items.slice(0, index).reduce((sum, entry) => sum + ((Number(entry.value) || 0) / total) * 100, 0);
    const end = start + ((Number(item.value) || 0) / total) * 100;
    return `${colors[index % colors.length]} ${start}% ${end}%`;
  }).join(", ");

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center" justifyContent="center">
      <Box sx={{ width: 160, height: 160, borderRadius: "50%", background: `conic-gradient(${gradient})`, display: "grid", placeItems: "center" }}>
        <Box sx={{ width: 100, height: 100, borderRadius: "50%", bgcolor: "background.paper", display: "grid", placeItems: "center" }}>
          <Box textAlign="center"><Typography variant="h5" fontWeight={800}>{total === 1 && !data.length ? 0 : total}</Typography><Typography variant="caption" color="text.secondary">Members</Typography></Box>
        </Box>
      </Box>
      <Stack spacing={1} sx={{ minWidth: 150 }}>
        {items.map((item, index) => <Stack key={item.label || index} direction="row" alignItems="center" spacing={1}><Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: colors[index % colors.length] }} /><Typography variant="body2" sx={{ flexGrow: 1 }}>{item.label}</Typography><Typography variant="body2" fontWeight={700}>{data.length ? item.value : 0}</Typography></Stack>)}
      </Stack>
    </Stack>
  );
}

PatrolChart.propTypes = { data: PropTypes.array };
