import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, Grid, IconButton, LinearProgress, Paper, Stack, Tooltip, Typography } from "@mui/material";

import {
  Add,
  CalendarMonthOutlined,
  DeleteOutlined,
  EditOutlined,
  LocationOnOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";

import {
  ConfirmDialog,
  DataTable,
  PageHeader,
  SearchBar,
  StatusChip,
} from "../../components/common";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const getCalendarDays = (month) => {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
};

const getEventStatus = (event) => {
  if (event.status) {
    return event.status;
  }

  const eventDate = new Date(event.date);
  const now = new Date();

  const eventDay = new Date(
    eventDate.getFullYear(),
    eventDate.getMonth(),
    eventDate.getDate(),
  );

  const currentDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (eventDay.getTime() === currentDay.getTime()) {
    return "ongoing";
  }

  if (eventDay > currentDay) {
    return "upcoming";
  }

  return "completed";
};

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateValue));
};

const Events = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState("table");
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/events`);

      if (!response.ok) {
        throw new Error("Unable to fetch events");
      }

      const result = await response.json();

      const eventList = result.events || result.data || result || [];

      setEvents(Array.isArray(eventList) ? eventList : []);
    } catch (error) {
      console.error("Fetch events error:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(fetchEvents, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const filteredEvents = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    if (!query) {
      return events;
    }

    return events.filter((event) =>
      [event.title, event.venue, event.agenda, getEventStatus(event)].some(
        (value) =>
          String(value || "")
            .toLowerCase()
            .includes(query),
      ),
    );
  }, [events, searchText]);

  const handleDeleteOpen = (eventItem) => {
    setSelectedEvent(eventItem);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    if (deleteLoading) {
      return;
    }

    setSelectedEvent(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEvent?._id) {
      return;
    }

    try {
      setDeleteLoading(true);

      const response = await fetch(`${API_URL}/events/${selectedEvent._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete event");
      }

      setEvents((currentEvents) =>
        currentEvents.filter((event) => event._id !== selectedEvent._id),
      );

      handleDeleteClose();
    } catch (error) {
      console.error("Delete event error:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      id: "title",
      label: "Event",
      sortable: true,
      minWidth: 220,
      render: (event) => (
        <Box>
          <Typography variant="body2" fontWeight={700}>
            {event.title || "Untitled Event"}
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            spacing={0.5}
            sx={{ mt: 0.5 }}
          >
            <LocationOnOutlined
              sx={{
                fontSize: 15,
                color: "text.secondary",
              }}
            />

            <Typography variant="caption" color="text.secondary">
              {event.venue || "Venue not specified"}
            </Typography>
          </Stack>
        </Box>
      ),
    },
    {
      id: "date",
      label: "Date",
      sortable: true,
      minWidth: 140,
      nowrap: true,
      render: (event) => formatDate(event.date),
    },
    {
      id: "agenda",
      label: "Agenda",
      minWidth: 240,
      render: (event) => (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            maxWidth: 320,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {event.agenda || "No agenda provided"}
        </Typography>
      ),
    },
    {
      id: "status",
      label: "Status",
      minWidth: 120,
      render: (event) => <StatusChip status={getEventStatus(event)} />,
    },
    {
      id: "actions",
      label: "Actions",
      align: "right",
      minWidth: 150,
      nowrap: true,
      render: (event) => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          <Tooltip title="View event">
            <IconButton
              size="small"
              onClick={(clickEvent) => {
                clickEvent.stopPropagation();
                navigate(`/events/${event._id}/edit`);
              }}
            >
              <VisibilityOutlined fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit event">
            <IconButton
              size="small"
              color="primary"
              onClick={(clickEvent) => {
                clickEvent.stopPropagation();
                navigate(`/events/${event._id}/edit`);
              }}
            >
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete event">
            <IconButton
              size="small"
              color="error"
              onClick={(clickEvent) => {
                clickEvent.stopPropagation();
                handleDeleteOpen(event);
              }}
            >
              <DeleteOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <PageHeader
        title="Events"
        subtitle="Create and manage attendance events, venues and agendas."
        breadcrumbs={[
          {
            label: "Dashboard",
            path: "/dashboard",
          },
          {
            label: "Events",
          },
        ]}
        actionLabel="Create Event"
        actionIcon={<Add />}
        onAction={() => navigate("/events/create")}
      />

      <Box
        sx={{
          mb: 2.5,
          maxWidth: 500,
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} alignItems={{ md: "center" }}><SearchBar
          value={searchText}
          onChange={setSearchText}
          placeholder="Search events by title, venue or status..."
        /><Stack direction="row" spacing={1} sx={{ "& .MuiButton-root": { flex: 1, px: { xs: 1, sm: 2 } } }}><Button variant={viewMode === "table" ? "contained" : "outlined"} onClick={() => setViewMode("table")}>List</Button><Button variant={viewMode === "cards" ? "contained" : "outlined"} onClick={() => setViewMode("cards")}>Cards</Button><Button variant={viewMode === "calendar" ? "contained" : "outlined"} onClick={() => setViewMode("calendar")}>Calendar</Button></Stack></Stack>
      </Box>

      {viewMode === "table" ? <DataTable
        columns={columns}
        rows={filteredEvents}
        loading={loading}
        getRowId={(event) => event._id}
        defaultOrderBy="date"
        defaultOrder="desc"
        emptyTitle={searchText ? "No matching events" : "No events created"}
        emptyDescription={
          searchText
            ? "Try changing or clearing the search text."
            : "Create your first event to begin recording member attendance."
        }
        emptyIcon={<CalendarMonthOutlined />}
      /> : viewMode === "cards" ? <Grid container spacing={2.5}>{filteredEvents.map((event) => {
        const percentage = event.attendancePercentage ?? (event.attendeeCount && event.capacity ? Math.round((event.attendeeCount / event.capacity) * 100) : 0);
        return <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={event._id}><Paper sx={{ p: { xs: 2, sm: 2.5 }, height: "100%", border: "1px solid", borderColor: "divider" }}><Stack direction="row" justifyContent="space-between" spacing={2}><Box sx={{ minWidth: 0 }}><Typography variant="overline" color="primary.main" fontWeight={800}>{event.date ? new Date(event.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Date pending"}</Typography><Typography variant="h6" fontWeight={800} sx={{ overflowWrap: "anywhere" }}>{event.title}</Typography></Box><StatusChip status={getEventStatus(event)} /></Stack><Typography color="text.secondary" sx={{ mt: 1 }}>{event.venue || "Venue not specified"}</Typography><Typography variant="body2" sx={{ mt: 2, minHeight: 42 }}>{event.agenda || event.description || "No agenda added."}</Typography><Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}><Typography variant="caption">Attendance</Typography><Typography variant="caption" fontWeight={800}>{percentage}%</Typography></Stack><LinearProgress variant="determinate" value={Math.min(percentage, 100)} sx={{ mt: .5, height: 7, borderRadius: 4 }} /><Stack direction="row" spacing={1} sx={{ mt: 2 }}><Button size="small" onClick={() => navigate(`/events/${event._id}/edit`)}>Edit</Button><Button size="small" color="error" onClick={() => handleDeleteOpen(event)}>Delete</Button></Stack></Paper></Grid>;
      })}</Grid> : <Paper sx={{ overflow: "hidden", border: "1px solid", borderColor: "divider" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}><Button onClick={() => setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))}>Previous</Button><Typography variant="h6" fontWeight={800}>{calendarMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</Typography><Button onClick={() => setCalendarMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))}>Next</Button></Stack>
        <Box sx={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}><Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(90px, 1fr))", minWidth: 700 }}>{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <Box key={day} sx={{ p: 1, textAlign: "center", bgcolor: "background.default", borderTop: "1px solid", borderBottom: "1px solid", borderColor: "divider" }}><Typography variant="caption" fontWeight={800}>{day}</Typography></Box>)}{getCalendarDays(calendarMonth).map((date) => {
          const dayEvents = filteredEvents.filter((event) => event.date && new Date(event.date).toDateString() === date.toDateString());
          const inMonth = date.getMonth() === calendarMonth.getMonth();
          return <Box key={date.toISOString()} sx={{ minHeight: 112, p: 1, borderRight: "1px solid", borderBottom: "1px solid", borderColor: "divider", bgcolor: inMonth ? "background.paper" : "action.hover" }}><Typography variant="caption" color={inMonth ? "text.primary" : "text.disabled"} fontWeight={date.toDateString() === new Date().toDateString() ? 900 : 500}>{date.getDate()}</Typography><Stack spacing={0.5} sx={{ mt: .5 }}>{dayEvents.slice(0, 3).map((event) => <Box key={event._id} onClick={() => navigate(`/events/${event._id}/edit`)} sx={{ px: .75, py: .4, borderRadius: 1, bgcolor: "primary.main", color: "primary.contrastText", cursor: "pointer" }}><Typography variant="caption" fontWeight={700} noWrap>{event.title}</Typography></Box>)}{dayEvents.length > 3 && <Typography variant="caption" color="text.secondary">+{dayEvents.length - 3} more</Typography>}</Stack></Box>;
        })}</Box></Box>
      </Paper>}

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete event?"
        description={`Are you sure you want to delete ${
          selectedEvent?.title || "this event"
        }? Attendance records connected to the event may also be affected.`}
        confirmText="Delete Event"
        confirmColor="error"
        loading={deleteLoading}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default Events;
