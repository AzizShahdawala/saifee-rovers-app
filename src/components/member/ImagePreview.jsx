import PropTypes from "prop-types";
import { Box, Button, Typography } from "@mui/material";
import { ReplayOutlined } from "@mui/icons-material";
import { FACE_POSES } from "../../utils/facePoses";

export default function ImagePreview({ capturedImages, setCapturedImages, setCurrentStep }) {
  const retake = (pose, index) => {
    const updated = { ...capturedImages };
    delete updated[pose.key];
    setCapturedImages(updated);
    setCurrentStep(index);
  };

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))", lg: "repeat(5, minmax(0, 1fr))" }, gap: { xs: 1.25, sm: 2 }, mt: 2 }}>
      {FACE_POSES.map((pose, index) => (
        <Box key={pose.key} sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight={700} sx={{ mb: 0.75 }}>{pose.title}</Typography>
          <Box sx={{ aspectRatio: "4 / 3", borderRadius: 2, overflow: "hidden", bgcolor: "action.hover", display: "grid", placeItems: "center" }}>
            {capturedImages[pose.key] ? <Box component="img" src={capturedImages[pose.key]} alt={pose.title} sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ px: 1 }}>Not captured</Typography>}
          </Box>
          {capturedImages[pose.key] && <Button type="button" size="small" startIcon={<ReplayOutlined />} onClick={() => retake(pose, index)} fullWidth sx={{ mt: 0.75 }}>Retake</Button>}
        </Box>
      ))}
    </Box>
  );
}

ImagePreview.propTypes = {
  capturedImages: PropTypes.object.isRequired,
  setCapturedImages: PropTypes.func.isRequired,
  setCurrentStep: PropTypes.func.isRequired,
};
