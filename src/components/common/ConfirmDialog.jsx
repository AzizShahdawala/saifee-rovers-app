import PropTypes from "prop-types";

import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  alpha,
} from "@mui/material";

import { DeleteOutlined, WarningAmberOutlined } from "@mui/icons-material";

const colorMap = {
  error: "error",
  warning: "warning",
  primary: "primary",
  info: "info",
  success: "success",
};

const ConfirmDialog = ({
  open,
  title = "Confirm action",
  description = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "error",
  icon,
  loading = false,
  disableBackdropClick = false,
  onConfirm,
  onClose,
  children,
}) => {
  const paletteColor = colorMap[confirmColor] || colorMap.error;

  const handleClose = (event, reason) => {
    if (disableBackdropClick && reason === "backdropClick") {
      return;
    }

    if (!loading) {
      onClose?.();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 0.5,
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            sx={(theme) => ({
              width: 44,
              height: 44,
              color:
                theme.palette[paletteColor]?.main || theme.palette.error.main,
              backgroundColor: alpha(
                theme.palette[paletteColor]?.main || theme.palette.error.main,
                0.12,
              ),
            })}
          >
            {icon ||
              (confirmColor === "error" ? (
                <DeleteOutlined />
              ) : (
                <WarningAmberOutlined />
              ))}
          </Avatar>

          <Typography variant="h6" component="span" fontWeight={700}>
            {title}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pl: { xs: 0, sm: 7.5 } }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.7,
            }}
          >
            {description}
          </Typography>

          {children && <Box sx={{ mt: 2 }}>{children}</Box>}
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2.5,
          pt: 1.5,
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          color="inherit"
          sx={{
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {cancelText}
        </Button>

        <Button
          variant="contained"
          color={confirmColor}
          onClick={onConfirm}
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={17} color="inherit" /> : null
          }
          sx={{
            minWidth: 110,
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: "none",
          }}
        >
          {loading ? "Please wait..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmColor: PropTypes.oneOf([
    "error",
    "warning",
    "primary",
    "info",
    "success",
  ]),
  icon: PropTypes.node,
  loading: PropTypes.bool,
  disableBackdropClick: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default ConfirmDialog;
