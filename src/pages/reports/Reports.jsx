import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";

import { Box, Button, Grid, MenuItem, Stack, TextField, Typography } from "@mui/material";

import {
  AssessmentOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  PictureAsPdfOutlined,
  GroupsOutlined,
  PercentOutlined,
} from "@mui/icons-material";

import {
  DashboardCard,
  DataTable,
  PageHeader,
  SearchBar,
  StatCard,
  StatusChip,
} from "../../components/common";
import AttendanceChart from "../../components/charts/AttendanceChart";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const formatDateTime = (dateValue) => {
  if (!dateValue) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateValue));
};

const Reports = () => {
  const [records, setRecords] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/attendance`);

        if (!response.ok) {
          throw new Error("Unable to fetch attendance reports");
        }

        const result = await response.json();

        const attendanceRecords =
          result.attendance || result.records || result.data || result || [];

        setRecords(Array.isArray(attendanceRecords) ? attendanceRecords : []);
      } catch (error) {
        console.error("Fetch reports error:", error);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredRecords = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return records.filter((record) => {
      const memberName = record.member?.name || record.memberName;
      const eventTitle = record.event?.title || record.eventTitle;

      const matchesQuery = !query || [
        memberName,
        eventTitle,
        record.status,
        record.member?.patrol,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query),
      );
      const status = String(record.status || "present").toLowerCase();
      const date = new Date(record.timestamp || record.createdAt);
      const matchesStatus = statusFilter === "all" || status === statusFilter;
      const matchesFrom = !fromDate || date >= new Date(`${fromDate}T00:00:00`);
      const matchesTo = !toDate || date <= new Date(`${toDate}T23:59:59`);
      return matchesQuery && matchesStatus && matchesFrom && matchesTo;
    });
  }, [fromDate, records, searchText, statusFilter, toDate]);

  const presentCount = records.filter(
    (record) => String(record.status || "present").toLowerCase() === "present",
  ).length;

  const absentCount = records.filter(
    (record) => String(record.status || "").toLowerCase() === "absent",
  ).length;

  const attendanceRate =
    records.length > 0 ? Math.round((presentCount / records.length) * 100) : 0;

  const exportRows = filteredRecords.map((record) => ({ Member: record.member?.name || record.memberName || "", Patrol: record.member?.patrol || record.patrol || "", Event: record.event?.title || record.eventTitle || "", Status: record.status || "present", Timestamp: formatDateTime(record.timestamp || record.createdAt) }));
  const handleExcelExport = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    worksheet["!cols"] = [{ wch: 24 }, { wch: 18 }, { wch: 28 }, { wch: 12 }, { wch: 24 }];
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, `attendance-report-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const chartData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => { const date = new Date(); date.setDate(date.getDate() - (6 - index)); return date; });
    return days.map((date) => ({ label: date.toLocaleDateString("en-IN", { weekday: "short" }), value: records.filter((record) => new Date(record.timestamp || record.createdAt).toDateString() === date.toDateString() && String(record.status || "present").toLowerCase() === "present").length }));
  }, [records]);

  const columns = [
    {
      id: "memberName",
      label: "Member",
      sortable: true,
      minWidth: 180,
      render: (record) => (
        <Box>
          <Typography variant="body2" fontWeight={700}>
            {record.member?.name || record.memberName || "Unknown member"}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            {record.member?.patrol || record.patrol || "No patrol"}
          </Typography>
        </Box>
      ),
    },
    {
      id: "eventTitle",
      label: "Event",
      sortable: true,
      minWidth: 200,
      render: (record) =>
        record.event?.title || record.eventTitle || "Unknown event",
    },
    {
      id: "timestamp",
      label: "Attendance Time",
      sortable: true,
      minWidth: 190,
      nowrap: true,
      render: (record) => formatDateTime(record.timestamp || record.createdAt),
    },
    {
      id: "status",
      label: "Status",
      minWidth: 110,
      render: (record) => <StatusChip status={record.status || "present"} />,
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Attendance Reports"
        subtitle="Review member attendance records and export event reports."
        breadcrumbs={[
          {
            label: "Dashboard",
            path: "/dashboard",
          },
          {
            label: "Reports",
          },
        ]}
        actions={
          <Stack direction="row" spacing={1}><Button
            variant="contained"
            startIcon={<DownloadOutlined />}
            onClick={handleExcelExport}
            disabled={filteredRecords.length === 0}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: "none",
            }}
          >
            Export Excel
          </Button><Button variant="outlined" startIcon={<PictureAsPdfOutlined />} onClick={() => window.print()} disabled={filteredRecords.length === 0}>Export PDF</Button></Stack>
        }
      />

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Records"
            value={records.length}
            icon={<AssessmentOutlined />}
            color="primary"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Present"
            value={presentCount}
            icon={<CheckCircleOutlined />}
            color="success"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Absent"
            value={absentCount}
            icon={<GroupsOutlined />}
            color="error"
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Attendance Rate"
            value={`${attendanceRate}%`}
            icon={<PercentOutlined />}
            color="warning"
            loading={loading}
          />
        </Grid>
      </Grid>

      <DashboardCard title="Seven-day Attendance" subtitle="Present check-ins by day" sx={{ mb: 3 }}><AttendanceChart data={chartData} /></DashboardCard>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2.5 }}>
        <TextField select size="small" label="Status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} sx={{ maxWidth: { md: 180 } }}><MenuItem value="all">All statuses</MenuItem><MenuItem value="present">Present</MenuItem><MenuItem value="absent">Absent</MenuItem><MenuItem value="late">Late</MenuItem><MenuItem value="excused">Excused</MenuItem></TextField>
        <TextField size="small" label="From" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} InputLabelProps={{ shrink: true }} sx={{ maxWidth: { md: 180 } }} />
        <TextField size="small" label="To" type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} InputLabelProps={{ shrink: true }} sx={{ maxWidth: { md: 180 } }} />
        {(statusFilter !== "all" || fromDate || toDate) && <Button color="inherit" onClick={() => { setStatusFilter("all"); setFromDate(""); setToDate(""); }}>Clear filters</Button>}
      </Stack>

      <DashboardCard
        title="Attendance Records"
        subtitle="Search and review attendance by member and event"
        noPadding
        action={
          <SearchBar
            value={searchText}
            onChange={setSearchText}
            placeholder="Search reports..."
            fullWidth={false}
            sx={{
              width: {
                xs: 190,
                sm: 300,
              },
            }}
          />
        }
      >
        <DataTable
          columns={columns}
          rows={filteredRecords}
          loading={loading}
          getRowId={(record) =>
            record._id ||
            `${record.memberId}-${record.eventId}-${record.timestamp}`
          }
          defaultOrderBy="timestamp"
          defaultOrder="desc"
          emptyTitle={
            searchText
              ? "No matching attendance records"
              : "No attendance records"
          }
          emptyDescription={
            searchText
              ? "Try changing the member name, event or status."
              : "Attendance records will appear after an event check-in."
          }
          sx={{
            border: 0,
            borderRadius: 0,
          }}
        />
      </DashboardCard>
    </Box>
  );
};

export default Reports;
