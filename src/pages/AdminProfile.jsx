import { useEffect, useState } from "react";
import { Alert, Avatar, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import { CameraAltOutlined, LockResetOutlined, VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { changeAdminPassword, getAdminProfile, updateAdminProfilePhoto } from "../services/adminProfileService";
import { getStoredUser } from "../utils/auth";

const messageOf = (error, fallback) => error.response?.data?.message || error.message || fallback;

export default function AdminProfile() {
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [photoLoading, setPhotoLoading] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  useEffect(() => {
    getAdminProfile().then(({ data }) => setAdmin(data.admin)).catch((requestError) => setError(messageOf(requestError, "Could not load administrator profile")));
  }, []);

  const selectPhoto = async (event) => {
    const photo = event.target.files?.[0];
    event.target.value = "";
    if (!photo) return;
    if (!["image/jpeg", "image/png"].includes(photo.type) || photo.size > 5 * 1024 * 1024) return setError("Choose a JPG or PNG image no larger than 5 MB");
    setPhotoLoading(true); setError(""); setNotice("");
    try {
      const { data } = await updateAdminProfilePhoto(photo);
      setAdmin(data.admin);
      const storedUser = getStoredUser();
      if (storedUser) localStorage.setItem("user", JSON.stringify({ ...storedUser, profileImage: data.admin.profileImage }));
      window.dispatchEvent(new Event("session-updated"));
      setNotice(data.message);
    } catch (requestError) { setError(messageOf(requestError, "Could not update your profile picture")); }
    finally { setPhotoLoading(false); }
  };

  const submitPassword = async () => {
    if (!passwords.currentPassword) return setError("Enter your current password");
    if (passwords.newPassword.length < 8) return setError("New password must be at least 8 characters");
    if (passwords.newPassword !== passwords.confirmPassword) return setError("New passwords do not match");
    setPasswordLoading(true); setError(""); setNotice("");
    try {
      const { data } = await changeAdminPassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setNotice(data.message); setPasswordOpen(false); setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (requestError) { setError(messageOf(requestError, "Could not change your password")); }
    finally { setPasswordLoading(false); }
  };

  if (!admin && !error) return <Box sx={{ minHeight: 300, display: "grid", placeItems: "center" }}><CircularProgress /></Box>;
  if (!admin) return <Alert severity="error">{error}</Alert>;
  const fields = [["Full name", admin.name], ["Email", admin.email], ["Role", "Administrator"], ["Account status", admin.active ? "Active" : "Inactive"], ["Last login", admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString("en-IN") : "Not available"], ["Joined", new Date(admin.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })]];

  return <Stack spacing={3}>
    <Box><Typography variant="h4" fontWeight={900}>My profile</Typography><Typography color="text.secondary">Manage your profile picture, account security, and administrator information.</Typography></Box>
    {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}
    {notice && <Alert severity="success" onClose={() => setNotice("")}>{notice}</Alert>}
    <Paper sx={{ p: { xs: 2.5, sm: 4 }, maxWidth: 820 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ xs: "stretch", sm: "center" }}>
        <Box sx={{ position: "relative", width: 104, alignSelf: { xs: "center", sm: "auto" } }}><Avatar src={admin.profileImage} sx={{ width: 104, height: 104, fontSize: 38 }}>{admin.name?.[0]}</Avatar>{photoLoading && <Box sx={{ position: "absolute", inset: 0, borderRadius: "50%", bgcolor: "rgba(255,255,255,.75)", display: "grid", placeItems: "center" }}><CircularProgress size={30} /></Box>}</Box>
        <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}><Typography variant="h5" fontWeight={900}>{admin.name}</Typography><Typography color="text.secondary">Administrator</Typography><Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ mt: 2 }}><Button component="label" variant="outlined" startIcon={<CameraAltOutlined />} disabled={photoLoading}>Change picture<input hidden type="file" accept="image/png,image/jpeg" onChange={selectPhoto} /></Button><Button variant="outlined" startIcon={<LockResetOutlined />} onClick={() => { setError(""); setPasswordOpen(true); }}>Change password</Button></Stack><Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>JPG or PNG, maximum 5 MB.</Typography></Box>
      </Stack>
      <Divider sx={{ my: 3 }} /><ProfileFields fields={fields} />
    </Paper>
    <Dialog open={passwordOpen} onClose={() => !passwordLoading && setPasswordOpen(false)} fullWidth maxWidth="xs"><DialogTitle>Change password</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}><Typography variant="body2" color="text.secondary">Confirm your current password, then choose a new password of at least eight characters.</Typography><TextField label="Current password" type={showPasswords ? "text" : "password"} value={passwords.currentPassword} onChange={(event) => setPasswords((current) => ({ ...current, currentPassword: event.target.value }))} autoComplete="current-password" /><TextField label="New password" type={showPasswords ? "text" : "password"} value={passwords.newPassword} onChange={(event) => setPasswords((current) => ({ ...current, newPassword: event.target.value }))} autoComplete="new-password" /><TextField label="Confirm new password" type={showPasswords ? "text" : "password"} value={passwords.confirmPassword} onChange={(event) => setPasswords((current) => ({ ...current, confirmPassword: event.target.value }))} autoComplete="new-password" /><Button color="inherit" startIcon={showPasswords ? <VisibilityOffOutlined /> : <VisibilityOutlined />} onClick={() => setShowPasswords((visible) => !visible)}>{showPasswords ? "Hide passwords" : "Show passwords"}</Button></Stack></DialogContent><DialogActions><Button color="inherit" onClick={() => setPasswordOpen(false)} disabled={passwordLoading}>Cancel</Button><Button variant="contained" onClick={submitPassword} disabled={passwordLoading}>{passwordLoading ? <CircularProgress size={22} color="inherit" /> : "Update password"}</Button></DialogActions></Dialog>
  </Stack>;
}

function ProfileFields({ fields }) { return <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>{fields.map(([label, value]) => <Box key={label}><Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={700}>{label}</Typography><Typography fontWeight={600} sx={{ mt: .5 }}>{value || "—"}</Typography></Box>)}</Box>; }
