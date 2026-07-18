import PropTypes from "prop-types";

import { Box, Button, Stack, Typography } from "@mui/material";

import { InboxOutlined } from "@mui/icons-material";

const EmptyState = ({
  title = "Nothing here yet",
  description = "No records are available at the moment.",
  icon,
  action,
  actionLabel,
  actionIcon,
  onAction,
  minHeight = 300,
  sx = {},
}) => {
  return (
    <Box
      sx={{
        minHeight,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 5,
        ...sx,
      }}
    >
      <Stack
        spacing={1.5}
        alignItems="center"
        textAlign="center"
        sx={{
          maxWidth: 460,
        }}
      >
        <Box
          sx={{
            width: 76,
            height: 76,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "text.secondary",
            backgroundColor: "action.hover",
            "& svg": {
              fontSize: 38,
            },
          }}
        >
          {icon || <InboxOutlined />}
        </Box>

        <Typography
          variant="h6"
          component="h3"
          fontWeight={700}
          color="text.primary"
        >
          {title}
        </Typography>

        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              lineHeight: 1.7,
            }}
          >
            {description}
          </Typography>
        )}

        {action}

        {!action && actionLabel && (
          <Button
            variant="contained"
            startIcon={actionIcon}
            onClick={onAction}
            sx={{
              mt: 1,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
            }}
          >
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Box>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.node,
  action: PropTypes.node,
  actionLabel: PropTypes.string,
  actionIcon: PropTypes.node,
  onAction: PropTypes.func,
  minHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  sx: PropTypes.object,
};

export default EmptyState;
