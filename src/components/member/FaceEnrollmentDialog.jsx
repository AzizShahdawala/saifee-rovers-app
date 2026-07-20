import { useState } from "react";
import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, Typography } from "@mui/material";
import WebcamCapture from "./WebcamCapture";
import ImagePreview from "./ImagePreview";
import CaptureProgress from "./CaptureProgress";
import EnrollmentStatus from "./EnrollmentStatus";
import { checkEnrollmentService, enrollMemberFace } from "../../services/memberService";

export default function FaceEnrollmentDialog({ member, onClose, onEnrolled }) {
  const [capturedImages, setCapturedImages] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const count = Object.keys(capturedImages).length;

  const close = () => { if (!saving) onClose(); };
  const save = async () => {
    if (count !== 5) return setError("Capture all five required face poses");
    setSaving(true); setError("");
    try {
      await checkEnrollmentService();
      const form = new FormData();
      for (const pose of Object.keys(capturedImages)) {
        const blob = await fetch(capturedImages[pose]).then((response) => response.blob());
        form.append("images", blob, `${pose}.jpg`);
      }
      const { data } = await enrollMemberFace(member._id, form);
      onEnrolled(data.member, data.message);
    } catch (requestError) { setError(requestError.response?.data?.message || requestError.message || "Face enrollment failed"); }
    finally { setSaving(false); }
  };

  return <Dialog open onClose={close} fullWidth maxWidth="md"><DialogTitle>{member.faceEnrolled ? "Update face enrollment" : "Enroll member face"}</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}><Typography color="text.secondary">Capture all five poses for {member.name}. Saving replaces any previous face enrollment.</Typography>{error && <Alert severity="error">{error}</Alert>}<CaptureProgress current={count} total={5} /><EnrollmentStatus currentStep={currentStep} /><WebcamCapture currentStep={currentStep} capturedImages={capturedImages} setCapturedImages={setCapturedImages} setCurrentStep={setCurrentStep} /><Divider /><ImagePreview capturedImages={capturedImages} setCapturedImages={setCapturedImages} setCurrentStep={setCurrentStep} /></Stack></DialogContent><DialogActions><Button color="inherit" onClick={close} disabled={saving}>Cancel</Button><Button variant="contained" onClick={save} disabled={saving || count !== 5}>{saving ? <CircularProgress size={22} color="inherit" /> : "Save face enrollment"}</Button></DialogActions></Dialog>;
}
