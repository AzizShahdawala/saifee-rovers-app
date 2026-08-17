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
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
} from "@mui/material";

import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { AddCircleOutlineOutlined as AddCircleOutline, RemoveCircleOutlineOutlined as RemoveCircleOutline } from "@mui/icons-material";

import WebcamCapture from "./WebcamCapture";
import ImagePreview from "./ImagePreview";
import EnrollmentStatus from "./EnrollmentStatus";
import CaptureProgress from "./CaptureProgress";

import Loader from "../common/Loader";

import useMemberForm from "../../hooks/useMemberForm";
import { INSTRUMENTS, PATROLS, PROFESSIONS, PROFESSION_DETAIL_LABELS, professionLabel } from "../../constants/memberOptions";
import { isValidHijriDate } from "../../utils/memberDates";

import {
  validateName,
  validatePhone,
  validateEmail,
  validatePatrol,
} from "../../utils/validators";

export default function MemberForm() {
  const [members, setMembers] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm();
  const formValues = useWatch({ control, defaultValue: {} });
  const { fields: childFields, append: addChild, remove: removeChild, replace: replaceChildren } = useFieldArray({ control, name: "children" });
  const patrolHasLeader = useMemo(() => members.some((member) => member.patrol === formValues.patrol && member.isPatrolLeader), [formValues.patrol, members]);
  const bandInspectorAssigned = useMemo(() => members.some((member) => member.instrument === "Band Inspector"), [members]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    fetch(`${apiUrl}/members`).then((response) => response.ok ? response.json() : { members: [] }).then((result) => setMembers(result.members || result.data || [])).catch(() => setMembers([]));
  }, []);

  useEffect(() => {
    if (patrolHasLeader) setValue("isPatrolLeader", false);
  }, [patrolHasLeader, setValue]);

  useEffect(() => {
    if (!formValues.hasChildren && childFields.length) replaceChildren([]);
  }, [childFields.length, formValues.hasChildren, replaceChildren]);

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
    <Container maxWidth="lg" disableGutters sx={{ mt: 0, mb: { xs: 2, sm: 5 } }}>
      <Card elevation={4}>
        <CardContent sx={{ p: { xs: 2, sm: 3 }, "&:last-child": { pb: { xs: 2, sm: 3 } } }}>
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
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="ITS ID (optional)" inputProps={{ inputMode: "numeric", maxLength: 8 }} {...register("itsId", { validate: (value) => !value || /^\d{8}$/.test(value) || "ITS ID must contain exactly 8 digits" })} error={!!errors.itsId} helperText={errors.itsId?.message || "An eight-digit ITS ID will be generated automatically if left blank."} />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  {...register("name", validateName)}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  {...register("phone", validatePhone)}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Email"
                  {...register("email", validateEmail)}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  select
                  label="Patrol"
                  defaultValue=""
                  {...register("patrol", validatePatrol)}
                  error={!!errors.patrol}
                  helperText={errors.patrol?.message}
                >
                  {PATROLS.map((patrol) => <MenuItem key={patrol} value={patrol}>{patrol}</MenuItem>)}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth type="date" label="Date of Birth" slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: new Date().toISOString().slice(0, 10) } }} {...register("dateOfBirth", { required: "Date of birth is required" })} error={!!errors.dateOfBirth} helperText={errors.dateOfBirth?.message} />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label="Hijri Date of Birth" placeholder="1442-09-15" inputProps={{ inputMode: "numeric", maxLength: 10 }} {...register("hijriDateOfBirth", { required: "Hijri date of birth is required", validate: (value) => isValidHijriDate(value) || "Use YYYY-MM-DD in the Umm al-Qura calendar" })} error={!!errors.hijriDateOfBirth} helperText={errors.hijriDateOfBirth?.message || "Umm al-Qura calendar format: YYYY-MM-DD"} />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth type="number" label="Joined Saifee Rovers in year" defaultValue={2020} slotProps={{ htmlInput: { min: 1947, max: new Date().getFullYear(), step: 1 } }} {...register("joinedYear", { valueAsNumber: true, required: "Joined year is required", min: { value: 1947, message: "Joined year cannot be earlier than 1947" }, max: { value: new Date().getFullYear(), message: "Joined year cannot be in the future" } })} error={!!errors.joinedYear} helperText={errors.joinedYear?.message || "Temporary default is 2020; update it when the actual year is known."} />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth select label="Profession" defaultValue="" {...register("profession", { required: "Profession is required" })} error={!!errors.profession} helperText={errors.profession?.message}>
                  {PROFESSIONS.map((profession) => <MenuItem key={profession} value={profession}>{professionLabel(profession)}</MenuItem>)}
                </TextField>
              </Grid>

              {formValues.profession && formValues.profession !== "RETIRED" && <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth label={PROFESSION_DETAIL_LABELS[formValues.profession] || "Profession details"} {...register("professionDetails", { validate: (value) => formValues.profession === "RETIRED" || Boolean(value?.trim()) || "Profession details are required" })} error={!!errors.professionDetails} helperText={errors.professionDetails?.message} />
              </Grid>}

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth select label="Marital Status" defaultValue="" {...register("maritalStatus", { required: "Marital status is required" })} error={!!errors.maritalStatus} helperText={errors.maritalStatus?.message}>
                  <MenuItem value="MARRIED">Married</MenuItem><MenuItem value="UNMARRIED">Unmarried</MenuItem>
                </TextField>
              </Grid>

              {formValues.maritalStatus === "MARRIED" && <>
                <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Spouse Name" {...register("spouseName", { required: "Spouse name is required" })} error={!!errors.spouseName} helperText={errors.spouseName?.message} /></Grid>
                <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth type="date" label="Spouse Date of Birth" slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: new Date().toISOString().slice(0, 10) } }} {...register("spouseDateOfBirth", { required: "Spouse date of birth is required" })} error={!!errors.spouseDateOfBirth} helperText={errors.spouseDateOfBirth?.message} /></Grid>
                <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth type="date" label="Marriage Date" slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: new Date().toISOString().slice(0, 10) } }} {...register("marriageDate", { required: "Marriage date is required" })} error={!!errors.marriageDate} helperText={errors.marriageDate?.message} /></Grid>
                <Grid size={12}><FormControlLabel control={<Checkbox {...register("hasChildren")} />} label="Children" /></Grid>
                {formValues.hasChildren && <Grid size={12}><Box sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 1.5 }}>Children details</Typography>
                  {childFields.map((field, index) => <Grid container spacing={2} key={field.id} sx={{ mb: 1.5 }}><Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label={`Child ${index + 1} Name`} {...register(`children.${index}.name`, { required: "Child name is required" })} error={!!errors.children?.[index]?.name} helperText={errors.children?.[index]?.name?.message} /></Grid><Grid size={{ xs: 10, md: 5 }}><TextField fullWidth type="date" label="Date of Birth" slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: new Date().toISOString().slice(0, 10) } }} {...register(`children.${index}.dateOfBirth`, { required: "Date of birth is required" })} error={!!errors.children?.[index]?.dateOfBirth} helperText={errors.children?.[index]?.dateOfBirth?.message} /></Grid><Grid size={{ xs: 2, md: 1 }}><IconButton color="error" onClick={() => removeChild(index)} aria-label={`Remove child ${index + 1}`}><RemoveCircleOutline /></IconButton></Grid></Grid>)}
                  <Button type="button" startIcon={<AddCircleOutline />} onClick={() => addChild({ name: "", dateOfBirth: "" })}>Add child</Button>
                  {!childFields.length && <Typography variant="caption" color="error" sx={{ ml: 1 }}>Add at least one child when Children is selected.</Typography>}
                </Box></Grid>}
              </>}

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField fullWidth select label={formValues.patrol === "OFFICERS" ? "Instrument (optional)" : "Instrument"} defaultValue="" {...register("instrument", { validate: (value) => formValues.patrol === "OFFICERS" || Boolean(value) || "Instrument is required" })} error={!!errors.instrument} helperText={errors.instrument?.message || (formValues.patrol === "OFFICERS" ? "OFFICERS can be registered without an instrument." : "Select the instrument played by this member.")}>
                  {INSTRUMENTS.map((instrument) => <MenuItem key={instrument} value={instrument} disabled={instrument === "Band Inspector" && bandInspectorAssigned}>{instrument}{instrument === "Band Inspector" && bandInspectorAssigned ? " (already assigned)" : ""}</MenuItem>)}
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <FormControlLabel control={<Checkbox {...register("isPatrolLeader")} disabled={!formValues.patrol || patrolHasLeader} />} label="Patrol leader" />
                <Typography variant="caption" color="text.secondary" display="block">{patrolHasLeader ? `${formValues.patrol} already has a patrol leader.` : formValues.patrol === "OFFICERS" ? "Patrol leader is optional for OFFICERS." : "Patrol leader is optional; only one member can lead each patrol."}</Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {loading && <Loader />}

            <Grid container spacing={4}>
              {/* LEFT PANEL */}
              <Grid size={{ xs: 12, md: 4 }}>
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
                      Verify the details before registering. Face enrollment can be completed now or later from Edit Member.
                    </Typography>

                    <Typography>
                      <strong>Name:</strong> {formValues.name || "-"}
                    </Typography>

                    <Typography>
                      <strong>Phone:</strong> {formValues.phone || "-"}
                    </Typography>

                    <Typography><strong>Date of Birth:</strong> {formValues.dateOfBirth || "-"}</Typography>

                    <Typography><strong>Hijri Date of Birth:</strong> {formValues.hijriDateOfBirth || "-"}</Typography>

                    <Typography><strong>Joined Saifee Rovers:</strong> {formValues.joinedYear || 2020}</Typography>

                    <Typography><strong>Profession:</strong> {professionLabel(formValues.profession)}</Typography>

                    {formValues.profession !== "RETIRED" && <Typography><strong>{PROFESSION_DETAIL_LABELS[formValues.profession] || "Profession details"}:</strong> {formValues.professionDetails || "-"}</Typography>}

                    <Typography><strong>Marital Status:</strong> {formValues.maritalStatus === "MARRIED" ? "Married" : formValues.maritalStatus === "UNMARRIED" ? "Unmarried" : "-"}</Typography>

                    {formValues.maritalStatus === "MARRIED" && <><Typography><strong>Spouse:</strong> {formValues.spouseName || "-"}</Typography><Typography><strong>Marriage Date:</strong> {formValues.marriageDate || "-"}</Typography><Typography><strong>Children:</strong> {formValues.children?.length || 0}</Typography></>}

                    <Typography>
                      <strong>Email:</strong> {formValues.email || "-"}
                    </Typography>

                    <Typography>
                      <strong>ITS ID:</strong> {formValues.itsId || "Generated automatically"}
                    </Typography>

                    <Typography>
                      <strong>Patrol:</strong> {formValues.patrol || "-"}
                    </Typography>

                    <Typography>
                      <strong>Instrument:</strong> {formValues.instrument || "-"}
                    </Typography>

                    <Typography>
                      <strong>Role:</strong> {formValues.isPatrolLeader ? "Patrol leader" : "Patrol member"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* RIGHT PANEL */}
              <Grid size={{ xs: 12, md: 8 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Face Enrollment (optional)
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Stepper activeStep={currentStep} alternativeLabel sx={{ overflowX: "auto", pb: 1, "& .MuiStep-root": { minWidth: { xs: 92, sm: "auto" } } }}>
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
                disabled={loading || (formValues.hasChildren && !childFields.length) || (Object.keys(capturedImages).length > 0 && Object.keys(capturedImages).length !== 5)}
                sx={{
                  width: { xs: "100%", sm: 300 },
                  height: 50,
                }}
              >
                {loading ? "Registering..." : Object.keys(capturedImages).length === 5 ? "Register with Face Enrollment" : "Register without Face Enrollment"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
