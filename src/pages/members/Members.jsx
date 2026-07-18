import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  DeleteOutlined,
  EditOutlined,
  PersonAddAlt1,
  PeopleOutlined,
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
const PATROLS = ["Fox", "Dove", "Bull", "Peacock"];

const Members = () => {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patrolFilter, setPatrolFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editMember, setEditMember] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const fetchMembers = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/members`);

      if (!response.ok) {
        throw new Error("Unable to fetch members");
      }

      const result = await response.json();

      const memberList = result.members || result.data || result || [];

      setMembers(Array.isArray(memberList) ? memberList : []);
    } catch (error) {
      console.error("Fetch members error:", error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(fetchMembers, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const filteredMembers = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return members.filter((member) => {
      const matchesQuery = !query || [member.name, member.email, member.phone, member.patrol].some(
        (value) =>
          String(value || "")
            .toLowerCase()
            .includes(query),
      );
      const matchesPatrol = patrolFilter === "all" || member.patrol === patrolFilter;
      const matchesStatus = statusFilter === "all" || (member.status || "active") === statusFilter;
      return matchesQuery && matchesPatrol && matchesStatus;
    });
  }, [members, patrolFilter, searchText, statusFilter]);

  const handleSaveMember = async () => {
    if (!editMember?.name?.trim()) return;
    setSaving(true);
    setSaveError("");
    try {
      const isEditing = Boolean(editMember._id);
      const response = await fetch(`${API_URL}/members${isEditing ? `/${editMember._id}` : ""}`, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editMember),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to update member");
      const updated = result.member || result.data || { ...editMember };
      setMembers((current) => isEditing ? current.map((member) => member._id === editMember._id ? { ...member, ...updated } : member) : [updated, ...current]);
      setEditMember(null);
    } catch (error) {
      console.error("Update member error:", error);
      setSaveError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOpen = (member) => {
    setSelectedMember(member);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    if (deleteLoading) {
      return;
    }

    setSelectedMember(null);
    setDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMember?._id) {
      return;
    }

    try {
      setDeleteLoading(true);

      const response = await fetch(`${API_URL}/members/${selectedMember._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete member");
      }

      setMembers((currentMembers) =>
        currentMembers.filter((member) => member._id !== selectedMember._id),
      );

      handleDeleteClose();
    } catch (error) {
      console.error("Delete member error:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      id: "name",
      label: "Member",
      sortable: true,
      minWidth: 220,
      render: (member) => (
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar
            src={member.profileImage || member.imageUrl || undefined}
            alt={member.name}
            sx={{
              width: 40,
              height: 40,
              bgcolor: "primary.main",
              fontSize: "0.875rem",
              fontWeight: 700,
            }}
          >
            {member.name
              ?.split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </Avatar>

          <Box>
            <Typography variant="body2" fontWeight={700}>
              {member.name || "Unnamed member"}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {member.email || "No email"}
            </Typography>
          </Box>
        </Stack>
      ),
    },
    {
      id: "phone",
      label: "Phone",
      sortable: true,
      minWidth: 130,
      nowrap: true,
      render: (member) => member.phone || "Not provided",
    },
    {
      id: "patrol",
      label: "Patrol",
      sortable: true,
      minWidth: 120,
      render: (member) => member.patrol || "Not assigned",
    },
    {
      id: "isPatrolLeader",
      label: "Patrol role",
      minWidth: 130,
      render: (member) => member.isPatrolLeader ? <StatusChip status="leader" label="Leader" /> : "Member",
    },
    {
      id: "faceEnrolled",
      label: "Face Enrollment",
      minWidth: 150,
      render: (member) => (
        <StatusChip
          status={
            member.faceEnrolled ||
            member.descriptor?.length > 0 ||
            member.images?.length >= 5
              ? "enrolled"
              : "not-enrolled"
          }
        />
      ),
    },
    {
      id: "status",
      label: "Status",
      minWidth: 110,
      render: (member) => <StatusChip status={member.status || "active"} />,
    },
    {
      id: "actions",
      label: "Actions",
      align: "right",
      minWidth: 150,
      nowrap: true,
      render: (member) => (
        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
          <Tooltip title="View member">
            <IconButton
              size="small"
              onClick={(event) => {
                event.stopPropagation();
                setSaveError(""); setEditMember({ ...member });
              }}
            >
              <VisibilityOutlined fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit member">
            <IconButton
              size="small"
              color="primary"
              onClick={(event) => {
                event.stopPropagation();
                setSaveError(""); setEditMember({ ...member });
              }}
            >
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete member">
            <IconButton
              size="small"
              color="error"
              onClick={(event) => {
                event.stopPropagation();
                handleDeleteOpen(member);
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
        title="Members"
        subtitle="Manage registered members, patrol information and face enrollment."
        breadcrumbs={[
          {
            label: "Dashboard",
            path: "/dashboard",
          },
          {
            label: "Members",
          },
        ]}
        actionLabel="Add Member"
        actionIcon={<PersonAddAlt1 />}
        onAction={() => navigate("/members/add")}
      />

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2.5 }}>
        <Box sx={{ flexGrow: 1, maxWidth: 560 }}>
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          placeholder="Search by name, email, phone or patrol..."
        />
        </Box>
        <FormControl size="small" sx={{ minWidth: 160 }}><InputLabel>Patrol</InputLabel><Select value={patrolFilter} label="Patrol" onChange={(event) => setPatrolFilter(event.target.value)}><MenuItem value="all">All patrols</MenuItem>{PATROLS.map((patrol) => <MenuItem key={patrol} value={patrol}>{patrol}</MenuItem>)}</Select></FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}><InputLabel>Status</InputLabel><Select value={statusFilter} label="Status" onChange={(event) => setStatusFilter(event.target.value)}><MenuItem value="all">All statuses</MenuItem><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem></Select></FormControl>
      </Stack>

      <DataTable
        columns={columns}
        rows={filteredMembers}
        loading={loading}
        getRowId={(member) => member._id}
        defaultOrderBy="name"
        emptyTitle={
          searchText ? "No matching members" : "No members registered"
        }
        emptyDescription={
          searchText
            ? "Try changing the search text or clearing the current search."
            : "Register your first member to start recording attendance."
        }
        emptyIcon={<PeopleOutlined />}
        emptyAction={
          !searchText ? (
            <Box
              component="button"
              type="button"
              onClick={() => navigate("/members/add")}
              sx={{
                mt: 1,
                px: 2,
                py: 1,
                border: 0,
                borderRadius: 2,
                color: "primary.contrastText",
                backgroundColor: "primary.main",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Add first member
            </Box>
          ) : null
        }
      />

      <Dialog open={Boolean(editMember)} onClose={() => !saving && setEditMember(null)} fullWidth maxWidth="sm">
        <DialogTitle>Edit member</DialogTitle>
        <DialogContent><Stack spacing={2} sx={{ pt: 1 }}>
          {saveError && <Alert severity="error">{saveError}</Alert>}
          <TextField label="Full name" value={editMember?.name || ""} onChange={(event) => setEditMember((current) => ({ ...current, name: event.target.value }))} required />
          <TextField label="Email" type="email" value={editMember?.email || ""} onChange={(event) => setEditMember((current) => ({ ...current, email: event.target.value }))} />
          <TextField label="Phone" value={editMember?.phone || ""} onChange={(event) => setEditMember((current) => ({ ...current, phone: event.target.value }))} />
          <TextField select label="Patrol" value={editMember?.patrol || ""} onChange={(event) => setEditMember((current) => ({ ...current, patrol: event.target.value }))}>{PATROLS.map((patrol) => <MenuItem key={patrol} value={patrol}>{patrol}</MenuItem>)}</TextField>
          <FormControlLabel control={<Checkbox checked={Boolean(editMember?.isPatrolLeader)} onChange={(event) => setEditMember((current) => ({ ...current, isPatrolLeader: event.target.checked }))} />} label="Patrol leader" />
        </Stack></DialogContent>
        <DialogActions><Button color="inherit" onClick={() => setEditMember(null)} disabled={saving}>Cancel</Button><Button variant="contained" onClick={handleSaveMember} disabled={saving || !editMember?.name?.trim()}>{saving ? "Saving..." : "Save changes"}</Button></DialogActions>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete member?"
        description={`Are you sure you want to delete ${
          selectedMember?.name || "this member"
        }? Their registration and face enrollment information will be removed.`}
        confirmText="Delete Member"
        confirmColor="error"
        loading={deleteLoading}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default Members;
