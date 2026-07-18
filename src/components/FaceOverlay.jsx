import { Box } from "@mui/material";

export default function FaceOverlay() {
  return <Box sx={{ position: "absolute", width: "clamp(140px, 42%, 250px)", height: "clamp(190px, 68%, 320px)", border: "3px dashed #45e38b", borderRadius: "50%", top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none" }} />;
}
