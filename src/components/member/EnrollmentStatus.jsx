import { Alert, AlertTitle, Box, Typography } from "@mui/material";

import FaceIcon from "@mui/icons-material/Face";

const POSES = [
  {
    title: "Face Straight",
    description: "Look directly into the camera.",
  },
  {
    title: "Look Left",
    description: "Turn your face approximately 30° to the left.",
  },
  {
    title: "Look Right",
    description: "Turn your face approximately 30° to the right.",
  },
  {
    title: "Look Up",
    description: "Lift your chin slightly upward.",
  },
  {
    title: "Smile",
    description: "Keep your eyes open and smile naturally.",
  },
];

const STATUS_CONFIG = {
  waiting: {
    severity: "info",
    title: "Required Pose",
  },
  detected: {
    severity: "success",
    title: "Face Detected",
  },
  nodetect: {
    severity: "warning",
    title: "No Face Detected",
  },
  multiple: {
    severity: "error",
    title: "Multiple Faces",
  },
  lighting: {
    severity: "warning",
    title: "Poor Lighting",
  },
  verified: {
    severity: "success",
    title: "Pose Verified",
  },
};

export default function EnrollmentStatus({ currentStep, status = "waiting" }) {
  const pose = POSES[currentStep];

  if (!pose) {
    return (
      <Box sx={{ mb: 2 }}>
        <Alert severity="success" icon={<FaceIcon />}>
          <AlertTitle>Enrollment complete</AlertTitle>
          <Typography variant="body2">All required face positions have been captured.</Typography>
        </Alert>
      </Box>
    );
  }

  const config = STATUS_CONFIG[status];

  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity={config.severity} icon={<FaceIcon />}>
        <AlertTitle>{config.title}</AlertTitle>

        <Typography fontWeight={600}>{pose.title}</Typography>

        <Typography variant="body2">{pose.description}</Typography>
      </Alert>
    </Box>
  );
}
