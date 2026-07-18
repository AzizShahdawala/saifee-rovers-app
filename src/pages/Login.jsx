import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  ArrowForwardOutlined,
  LockOutlined,
  MailOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";

import API from "../api/axios";
import logo from "../assets/logo.png";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState(() => ({
    email: localStorage.getItem("rememberedEmail") || "",
    password: "",
  }));
  const [remember, setRemember] = useState(
    Boolean(localStorage.getItem("rememberedEmail")),
  );
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: "" }));
    setError("");
  };

  const validate = () => {
    const nextErrors = {};
    if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address";
    }
    if (form.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError("");
    try {
      const response = await API.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });
      const token = response.data?.token || response.data?.accessToken;
      if (!token) throw new Error("The server did not return an access token.");
      localStorage.setItem("token", token);
      if (response.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      if (remember) localStorage.setItem("rememberedEmail", form.email.trim());
      else localStorage.removeItem("rememberedEmail");
      navigate("/dashboard", { replace: true });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          requestError.message ||
          "Unable to sign in. Check your credentials and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        position: "relative",
        overflow: "hidden",
        p: 2,
        background:
          "linear-gradient(135deg, #071a33 0%, #0b4b73 48%, #1ca6a0 100%)",
        "@keyframes float": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(20px, -28px, 0) scale(1.08)" },
        },
      }}
    >
      {[{ top: "-12%", left: "-6%", size: 360, delay: "0s" }, { bottom: "-16%", right: "-5%", size: 440, delay: "-3s" }, { top: "18%", right: "16%", size: 160, delay: "-5s" }].map((orb, index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            top: orb.top,
            bottom: orb.bottom,
            left: orb.left,
            right: orb.right,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,.10)",
            filter: "blur(2px)",
            animation: "float 8s ease-in-out infinite",
            animationDelay: orb.delay,
          }}
        />
      ))}

      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 460,
          p: { xs: 3, sm: 5 },
          border: "1px solid rgba(255,255,255,.35)",
          bgcolor: "rgba(255,255,255,.86)",
          backdropFilter: "blur(22px)",
          boxShadow: "0 28px 80px rgba(0,20,45,.34)",
        }}
      >
        <Stack spacing={3}>
          <Stack alignItems="center" spacing={1.25}>
            <Box component="img" src={logo} alt="Saifee Rovers" sx={{ width: 72, height: 72, objectFit: "contain" }} />
            <Typography variant="h4" fontWeight={800} textAlign="center">
              Welcome back
            </Typography>
            <Typography color="text.secondary" textAlign="center">
              Sign in to manage members, events, and attendance.
            </Typography>
          </Stack>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Email address"
            value={form.email}
            onChange={updateField("email")}
            error={Boolean(errors.email)}
            helperText={errors.email}
            autoComplete="email"
            autoFocus
            InputProps={{
              startAdornment: <InputAdornment position="start"><MailOutlined color="action" /></InputAdornment>,
            }}
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={updateField("password")}
            error={Boolean(errors.password)}
            helperText={errors.password}
            autoComplete="current-password"
            InputProps={{
              startAdornment: <InputAdornment position="start"><LockOutlined color="action" /></InputAdornment>,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((visible) => !visible)} edge="end" aria-label="Toggle password visibility">
                    {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <FormControlLabel
              control={<Checkbox checked={remember} onChange={(event) => setRemember(event.target.checked)} />}
              label="Remember me"
            />
            <Link component="button" type="button" underline="hover" fontWeight={600}>
              Forgot password?
            </Link>
          </Stack>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            endIcon={!loading && <ArrowForwardOutlined />}
            sx={{ minHeight: 52 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign in"}
          </Button>
          <Typography variant="caption" color="text.secondary" textAlign="center">
            Secure JWT-ready administrator access
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
