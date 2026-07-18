import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Box,
} from "@mui/material";

import { useForm, useWatch } from "react-hook-form";

import WebcamCapture from "./WebcamCapture";
import ImagePreview from "./ImagePreview";
import EnrollmentStatus from "./EnrollmentStatus";
import CaptureProgress from "./CaptureProgress";

import Loader from "../common/Loader";

import useMemberForm from "../../hooks/useMemberForm";

import {
  validateName,
  validatePhone,
  validateEmail,
  validatePatrol,
} from "../../utils/validators";

export default function MemberForm() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();
  const formValues = useWatch({ control, defaultValue: {} });

  const {
    loading,
    submitMember,
    capturedImages,
    setCapturedImages,
    currentStep,
    setCurrentStep,
  } = useMemberForm();

  const submit = async (data) => {
    const success = await submitMember(data);

    if (success) {
      reset();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 5 }}>
      <Card elevation={4}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Register Scout Member
          </Typography>

          <Typography variant="body1" align="center" color="text.secondary">
            Register a scout member by entering details and capturing all
            required facial poses.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Box component="form" onSubmit={handleSubmit(submit)} sx={{ mt: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  {...register("name", validateName)}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  {...register("phone", validatePhone)}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  {...register("email", validateEmail)}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Patrol Name"
                  {...register("patrol", validatePatrol)}
                  error={!!errors.patrol}
                  helperText={errors.patrol?.message}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {loading && <Loader />}

            <Grid container spacing={4}>
              {/* LEFT PANEL */}
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Member Details
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      Verify the entered details before registering.
                    </Typography>

                    <Typography>
                      <strong>Name:</strong> {formValues.name || "-"}
                    </Typography>

                    <Typography>
                      <strong>Phone:</strong> {formValues.phone || "-"}
                    </Typography>

                    <Typography>
                      <strong>Email:</strong> {formValues.email || "-"}
                    </Typography>

                    <Typography>
                      <strong>Patrol:</strong> {formValues.patrol || "-"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* RIGHT PANEL */}
              <Grid item xs={12} md={8}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Face Enrollment
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Stepper activeStep={currentStep} alternativeLabel>
                        <Step>
                          <StepLabel>Front</StepLabel>
                        </Step>

                        <Step>
                          <StepLabel>Left</StepLabel>
                        </Step>

                        <Step>
                          <StepLabel>Right</StepLabel>
                        </Step>

                        <Step>
                          <StepLabel>Up</StepLabel>
                        </Step>

                        <Step>
                          <StepLabel>Smile</StepLabel>
                        </Step>
                      </Stepper>

                      <CaptureProgress
                        current={Object.keys(capturedImages).length}
                        total={5}
                      />

                      <EnrollmentStatus currentStep={currentStep} />

                      <Divider sx={{ my: 2 }} />
                    </Box>

                    <WebcamCapture
                      currentStep={currentStep}
                      capturedImages={capturedImages}
                      setCapturedImages={setCapturedImages}
                      setCurrentStep={setCurrentStep}
                    />

                    <Box
                      sx={{
                        display: "flex",

                        justifyContent: "space-between",

                        mt: 2,
                      }}
                    >
                      <Typography color="success.main">
                        🟢 Camera Ready
                      </Typography>

                      <Typography>
                        Captured
                        {Object.keys(capturedImages).length}
                        /5
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Card sx={{ mt: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Captured Face Images
                </Typography>

                <ImagePreview
                  capturedImages={capturedImages}
                  setCapturedImages={setCapturedImages}
                  setCurrentStep={setCurrentStep}
                />
              </CardContent>
            </Card>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || Object.keys(capturedImages).length !== 5}
                sx={{
                  width: 300,
                  height: 50,
                }}
              >
                {loading ? "Registering..." : "Register Member"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
