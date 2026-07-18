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
                navigate(`/events/${event._id}`);
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
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "center" }}><SearchBar
          value={searchText}
          onChange={setSearchText}
          placeholder="Search events by title, venue or status..."
        /><Stack direction="row" spacing={1}><Button variant={viewMode === "table" ? "contained" : "outlined"} onClick={() => setViewMode("table")}>List</Button><Button variant={viewMode === "calendar" ? "contained" : "outlined"} onClick={() => setViewMode("calendar")}>Calendar</Button></Stack></Stack>
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
      /> : <Grid container spacing={2.5}>{filteredEvents.map((event) => {
        const percentage = event.attendancePercentage ?? (event.attendeeCount && event.capacity ? Math.round((event.attendeeCount / event.capacity) * 100) : 0);
        return <Grid item xs={12} sm={6} lg={4} key={event._id}><Paper sx={{ p: 2.5, height: "100%", border: "1px solid", borderColor: "divider" }}><Stack direction="row" justifyContent="space-between" spacing={2}><Box><Typography variant="overline" color="primary.main" fontWeight={800}>{event.date ? new Date(event.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Date pending"}</Typography><Typography variant="h6" fontWeight={800}>{event.title}</Typography></Box><StatusChip status={getEventStatus(event)} /></Stack><Typography color="text.secondary" sx={{ mt: 1 }}>{event.venue || "Venue not specified"}</Typography><Typography variant="body2" sx={{ mt: 2, minHeight: 42 }}>{event.agenda || event.description || "No agenda added."}</Typography><Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}><Typography variant="caption">Attendance</Typography><Typography variant="caption" fontWeight={800}>{percentage}%</Typography></Stack><LinearProgress variant="determinate" value={Math.min(percentage, 100)} sx={{ mt: .5, height: 7, borderRadius: 4 }} /><Stack direction="row" spacing={1} sx={{ mt: 2 }}><Button size="small" onClick={() => navigate(`/events/${event._id}/edit`)}>Edit</Button><Button size="small" color="error" onClick={() => handleDeleteOpen(event)}>Delete</Button></Stack></Paper></Grid>;
      })}</Grid>}

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
