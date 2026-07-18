import PropTypes from "prop-types";

import {
  Backdrop,
  Box,
  CircularProgress,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

/**
 * Reusable loading component.
 *
 * Variants:
 * - inline: Loader inside a component or page
 * - fullscreen: Full-screen application loader
 * - overlay: Transparent overlay over current content
 * - linear: Linear progress bar
 */
const Loader = ({
  open = true,
  variant = "inline",
  message = "Loading...",
  size = 42,
  thickness = 4,
  showMessage = true,
  minHeight = 240,
  transparent = false,
  sx = {},
}) => {
  if (!open) {
    return null;
  }

  if (variant === "linear") {
    return (
      <Box
        role="status"
        aria-live="polite"
        sx={{
          width: "100%",
          ...sx,
        }}
      >
        <LinearProgress
          sx={{
            height: 4,
            borderRadius: 4,
          }}
        />

        {showMessage && message && (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ mt: 1.5 }}
          >
            {message}
          </Typography>
        )}
      </Box>
    );
  }

  if (variant === "fullscreen") {
    return (
      <Backdrop
        open
        role="status"
        aria-live="polite"
        sx={{
          zIndex: (theme) => theme.zIndex.modal + 10,
          backgroundColor: transparent
            ? "rgba(255, 255, 255, 0.72)"
            : "background.default",
          backdropFilter: transparent ? "blur(3px)" : "none",
          ...sx,
        }}
      >
        <LoaderContent
          message={message}
          size={size}
          thickness={thickness}
          showMessage={showMessage}
        />
      </Backdrop>
    );
  }

  if (variant === "overlay") {
    return (
      <Box
        role="status"
        aria-live="polite"
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: transparent
            ? "rgba(255, 255, 255, 0.72)"
            : "background.paper",
          backdropFilter: transparent ? "blur(2px)" : "none",
          borderRadius: "inherit",
          ...sx,
        }}
      >
        <LoaderContent
          message={message}
          size={size}
          thickness={thickness}
          showMessage={showMessage}
        />
      </Box>
    );
  }

  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        minHeight,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...sx,
      }}
    >
      <LoaderContent
        message={message}
        size={size}
        thickness={thickness}
        showMessage={showMessage}
      />
    </Box>
  );
};

const LoaderContent = ({
  message,
  size,
  thickness,
  showMessage,
}) => (
  <Stack
    spacing={1.75}
    alignItems="center"
    justifyContent="center"
  >
    <CircularProgress
      size={size}
      thickness={thickness}
      aria-label={message || "Loading"}
    />

    {showMessage && message && (
      <Typography
        variant="body2"
        color="text.secondary"
        fontWeight={500}
        textAlign="center"
      >
        {message}
      </Typography>
    )}
  </Stack>
);

Loader.propTypes = {
  open: PropTypes.bool,
  variant: PropTypes.oneOf([
    "inline",
    "fullscreen",
    "overlay",
    "linear",
  ]),
  message: PropTypes.string,
  size: PropTypes.number,
  thickness: PropTypes.number,
  showMessage: PropTypes.bool,
  minHeight: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  transparent: PropTypes.bool,
  sx: PropTypes.object,
};

LoaderContent.propTypes = {
  message: PropTypes.string,
  size: PropTypes.number.isRequired,
  thickness: PropTypes.number.isRequired,
  showMessage: PropTypes.bool.isRequired,
};

export default Loader;