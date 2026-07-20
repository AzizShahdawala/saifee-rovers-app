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
import { INSTRUMENTS, PATROLS } from "../../constants/memberOptions";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
  const [originalMember, setOriginalMember] = useState(null);
  const [dialogMode, setDialogMode] = useState("edit");
  const [reviewOpen, setReviewOpen] = useState(false);
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
      const matchesQuery = !query || [member.name, member.email, member.phone, member.patrol, member.instrument].some(
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

  const patrolLeader = editMember ? members.find((member) => member._id !== editMember._id && member.patrol === editMember.patrol && member.isPatrolLeader) : null;
  const bandInspector = editMember ? members.find((member) => member._id !== editMember._id && member.instrument === "Band Inspector") : null;
  const memberChanges = useMemo(() => {
    if (!editMember || !originalMember) return [];
    const fields = [
      ["name", "Full name"], ["email", "Email"], ["phone", "Phone"], ["patrol", "Patrol"],
      ["instrument", "Instrument"], ["status", "Member status"], ["isPatrolLeader", "Patrol leader"],
    ];
    const display = (key, value) => key === "isPatrolLeader" ? (value ? "Yes" : "No") : String(value || "Not set");
    return fields.filter(([key]) => (editMember[key] ?? "") !== (originalMember[key] ?? "")).map(([key, label]) => ({ key, label, before: display(key, originalMember[key]), after: display(key, editMember[key]) }));
  }, [editMember, originalMember]);

  const openMember = (member, mode) => {
    setSaveError("");
    setDialogMode(mode);
    setOriginalMember({ ...member });
    setEditMember({ ...member });
  };

  const closeMember = () => {
    if (saving) return;
    setReviewOpen(false);
    setEditMember(null);
    setOriginalMember(null);
  };

  const requestSaveConfirmation = () => {
    if (!memberChanges.length) {
      setSaveError("No member details have been changed.");
      return;
    }
    setSaveError("");
    setReviewOpen(true);
  };

  const handleSaveMember = async () => {
    if (!editMember?.name?.trim()) return;
    setSaving(true);
    setSaveError("");
    try {
      const isEditing = Boolean(editMember._id);
      const response = await fetch(`${API_URL}/members${isEditing ? `/${editMember._id}` : ""}`, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editMember, expectedUpdatedAt: originalMember?.updatedAt }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to update member");
      const updated = result.member || result.data || { ...editMember };
      setMembers((current) => isEditing ? current.map((member) => member._id === editMember._id ? { ...member, ...updated } : member) : [updated, ...current]);
      setReviewOpen(false);
      setEditMember(null);
      setOriginalMember(null);
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
      id: "instrument",
      label: "Instrument",
      sortable: true,
      minWidth: 150,
      render: (member) => member.instrument || "Not assigned",
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
                openMember(member, "view");
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
                openMember(member, "edit");
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
          placeholder="Search by name, email, phone, patrol or instrument..."
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

      <Dialog open={Boolean(editMember)} onClose={closeMember} fullWidth maxWidth="sm">
        <DialogTitle>{dialogMode === "view" ? "View member" : "Edit member"}</DialogTitle>
        <DialogContent><Stack spacing={2} sx={{ pt: 1 }}>
          <Stack alignItems="center" spacing={1} sx={{ pb: 1 }}><Avatar src={editMember?.profileImage || editMember?.imageUrl || undefined} alt={editMember?.name || "Member"} sx={{ width: 112, height: 112, bgcolor: "primary.main", fontSize: "2rem", fontWeight: 800 }}>{editMember?.name?.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</Avatar><Typography variant="caption" color="text.secondary">Member profile photo</Typography></Stack>
          {saveError && <Alert severity="error">{saveError}</Alert>}
          <TextField disabled={dialogMode === "view"} label="Full name" value={editMember?.name || ""} onChange={(event) => setEditMember((current) => ({ ...current, name: event.target.value }))} required />
          <TextField disabled={dialogMode === "view"} label="Email" type="email" value={editMember?.email || ""} onChange={(event) => setEditMember((current) => ({ ...current, email: event.target.value }))} />
          <TextField disabled={dialogMode === "view"} label="Phone" value={editMember?.phone || ""} onChange={(event) => setEditMember((current) => ({ ...current, phone: event.target.value }))} />
          <TextField disabled={dialogMode === "view"} select label="Patrol" value={editMember?.patrol || ""} onChange={(event) => setEditMember((current) => ({ ...current, patrol: event.target.value, isPatrolLeader: members.some((member) => member._id !== current._id && member.patrol === event.target.value && member.isPatrolLeader) ? false : current.isPatrolLeader }))}>{PATROLS.map((patrol) => <MenuItem key={patrol} value={patrol}>{patrol}</MenuItem>)}</TextField>
          <TextField disabled={dialogMode === "view"} required select label="Instrument" value={editMember?.instrument || ""} onChange={(event) => setEditMember((current) => ({ ...current, instrument: event.target.value }))} helperText={dialogMode === "edit" ? (bandInspector ? `Band Inspector is assigned to ${bandInspector.name}.` : "Select the instrument played by this member.") : ""}>{INSTRUMENTS.map((instrument) => <MenuItem key={instrument} value={instrument} disabled={instrument === "Band Inspector" && Boolean(bandInspector)}>{instrument}{instrument === "Band Inspector" && bandInspector ? " (already assigned)" : ""}</MenuItem>)}</TextField>
          <TextField disabled={dialogMode === "view"} select label="Member status" value={editMember?.status || "active"} onChange={(event) => setEditMember((current) => ({ ...current, status: event.target.value }))} helperText={dialogMode === "edit" ? (editMember?.status === "inactive" ? "Inactive members are sleeping and cannot sign in." : "Active members can access the member portal.") : ""}><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive (sleeping)</MenuItem></TextField>
          <FormControlLabel control={<Checkbox checked={Boolean(editMember?.isPatrolLeader)} disabled={dialogMode === "view" || Boolean(patrolLeader)} onChange={(event) => setEditMember((current) => ({ ...current, isPatrolLeader: event.target.checked }))} />} label="Patrol leader" />
          {patrolLeader && <Typography variant="caption" color="text.secondary">{editMember?.patrol} is already led by {patrolLeader.name}; this option is unavailable.</Typography>}
        </Stack></DialogContent>
        <DialogActions><Button color="inherit" onClick={closeMember} disabled={saving}>{dialogMode === "view" ? "Close" : "Cancel"}</Button>{dialogMode === "edit" && <Button variant="contained" onClick={requestSaveConfirmation} disabled={saving || !editMember?.name?.trim() || !editMember?.instrument}>Review changes</Button>}</DialogActions>
      </Dialog>

      <Dialog open={reviewOpen} onClose={() => !saving && setReviewOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Confirm member changes</DialogTitle>
        <DialogContent><Typography color="text.secondary" sx={{ mb: 2 }}>Review the changes for {originalMember?.name} before confirming.</Typography><Stack spacing={1.25}>{memberChanges.map((change) => <Box key={change.key} sx={{ p: 1.5, borderRadius: 2, bgcolor: "action.hover" }}><Typography fontWeight={800}>{change.label}</Typography><Typography variant="body2" color="text.secondary" sx={{ overflowWrap: "anywhere" }}>{change.before} → {change.after}</Typography></Box>)}</Stack></DialogContent>
        <DialogActions><Button color="inherit" onClick={() => setReviewOpen(false)} disabled={saving}>Go back</Button><Button variant="contained" onClick={handleSaveMember} disabled={saving}>{saving ? "Saving..." : "Confirm changes"}</Button></DialogActions>
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
