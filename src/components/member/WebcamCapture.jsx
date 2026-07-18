import { useRef } from "react";
import PropTypes from "prop-types";
import Webcam from "react-webcam";
import { Box, Button, Typography } from "@mui/material";
import { CameraAltOutlined, CheckCircleOutlined } from "@mui/icons-material";

import { FACE_POSES } from "../../utils/facePoses";
import FaceOverlay from "../FaceOverlay";

export default function WebcamCapture({ currentStep, setCapturedImages, setCurrentStep }) {
  const webcamRef = useRef(null);
  const complete = currentStep >= FACE_POSES.length;

  const capture = () => {
    if (complete) return;
    const image = webcamRef.current?.getScreenshot();
    if (!image) return;
    const pose = FACE_POSES[currentStep];
    setCapturedImages((previous) => ({ ...previous, [pose.key]: image }));
    setCurrentStep((previous) => previous + 1);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ position: "relative", width: "100%", maxWidth: 640, mx: "auto", overflow: "hidden", borderRadius: 2.5, bgcolor: "#07111f", aspectRatio: "4 / 3" }}>
        <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg" videoConstraints={{ facingMode: "user" }} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        <FaceOverlay />
      </Box>
      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
        {complete ? <Typography color="success.main" fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 1 }}><CheckCircleOutlined />All required images captured</Typography> : <Button type="button" variant="contained" startIcon={<CameraAltOutlined />} onClick={capture} sx={{ width: { xs: "100%", sm: "auto" } }}>Capture {FACE_POSES[currentStep].title}</Button>}
      </Box>
    </Box>
  );
}

WebcamCapture.propTypes = {
  currentStep: PropTypes.number.isRequired,
  setCapturedImages: PropTypes.func.isRequired,
  setCurrentStep: PropTypes.func.isRequired,
};
