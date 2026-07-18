import { useEffect, useState } from "react";
import { Alert, Avatar, Box, CircularProgress, Divider, Paper, Stack, Typography } from "@mui/material";
import { getMemberProfile } from "../../services/memberPortalService";

export default function MemberProfile() {
  const [member, setMember] = useState(null); const [error, setError] = useState("");
  useEffect(() => { getMemberProfile().then(({ data }) => setMember(data.member)).catch((e) => setError(e.response?.data?.message || "Could not load profile")); }, []);
  if (!member && !error) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  const fields = [["Full name", member.name], ["Email", member.email], ["Phone", member.phone], ["Patrol", member.patrol], ["Member status", member.status], ["Joined", new Date(member.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })]];
  return <Stack spacing={3}><Box><Typography variant="h4" fontWeight={900}>My profile</Typography><Typography color="text.secondary">Your registered membership information.</Typography></Box><Paper sx={{ p: { xs: 2.5, sm: 4 }, maxWidth: 760 }}><Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems={{ xs: "flex-start", sm: "center" }}><Avatar src={member.profileImage} sx={{ width: 96, height: 96, fontSize: 36 }}>{member.name?.[0]}</Avatar><Box><Typography variant="h5" fontWeight={900}>{member.name}</Typography><Typography color="text.secondary">{member.patrol} patrol</Typography></Box></Stack><Divider sx={{ my: 3 }} /><GridFields fields={fields} /></Paper></Stack>;
}
function GridFields({ fields }) { return <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>{fields.map(([label, value]) => <Box key={label}><Typography variant="caption" color="text.secondary" textTransform="uppercase" fontWeight={700}>{label}</Typography><Typography fontWeight={600} sx={{ mt: .5 }}>{value || "—"}</Typography></Box>)}</Box>; }
