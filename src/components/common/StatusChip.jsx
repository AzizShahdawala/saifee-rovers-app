import PropTypes from "prop-types";

import { Chip, alpha } from "@mui/material";

import {
  CancelOutlined,
  CheckCircleOutlined,
  ErrorOutlined,
  EventAvailableOutlined,
  HourglassEmptyOutlined,
  InfoOutlined,
  PersonOffOutlined,
  ScheduleOutlined,
} from "@mui/icons-material";

const statusConfig = {
  active: {
    label: "Active",
    color: "success",
    icon: CheckCircleOutlined,
  },
  inactive: {
    label: "Inactive",
    color: "default",
    icon: PersonOffOutlined,
  },
  present: {
    label: "Present",
    color: "success",
    icon: CheckCircleOutlined,
  },
  absent: {
    label: "Absent",
    color: "error",
    icon: CancelOutlined,
  },
  late: {
    label: "Late",
    color: "warning",
    icon: ScheduleOutlined,
  },
  upcoming: {
    label: "Upcoming",
    color: "info",
    icon: EventAvailableOutlined,
  },
  ongoing: {
    label: "Ongoing",
    color: "success",
    icon: EventAvailableOutlined,
  },
  completed: {
    label: "Completed",
    color: "primary",
    icon: CheckCircleOutlined,
  },
  cancelled: {
    label: "Cancelled",
    color: "error",
    icon: CancelOutlined,
  },
  pending: {
    label: "Pending",
    color: "warning",
    icon: HourglassEmptyOutlined,
  },
  approved: {
    label: "Approved",
    color: "success",
    icon: CheckCircleOutlined,
  },
  rejected: {
    label: "Rejected",
    color: "error",
    icon: ErrorOutlined,
  },
  enrolled: {
    label: "Face Enrolled",
    color: "success",
    icon: CheckCircleOutlined,
  },
  "not-enrolled": {
    label: "Not Enrolled",
    color: "warning",
    icon: ErrorOutlined,
  },
  info: {
    label: "Info",
    color: "info",
    icon: InfoOutlined,
  },
};

const getPaletteColor = (theme, color) => {
  if (color === "default") {
    return theme.palette.grey[600];
  }

  return theme.palette[color]?.main || theme.palette.primary.main;
};

const StatusChip = ({
  status,
  label,
  color,
  icon,
  size = "small",
  variant = "soft",
  sx = {},
}) => {
  const normalizedStatus = String(status || "")
    .trim()
    .toLowerCase()
    .replaceAll("_", "-")
    .replaceAll(" ", "-");

  const config = statusConfig[normalizedStatus] || statusConfig.info;

  const finalColor = color || config.color;
  const finalLabel = label || config.label || status || "Unknown";

  const IconComponent = icon || config.icon;
  const isSoftVariant = variant === "soft";

  const renderedIcon = (() => {
    if (!IconComponent) {
      return undefined;
    }

    if (typeof IconComponent === "function") {
      return <IconComponent />;
    }

    return IconComponent;
  })();

  return (
    <Chip
      size={size}
      label={finalLabel}
      icon={renderedIcon}
      color={isSoftVariant ? "default" : finalColor}
      variant={variant === "outlined" ? "outlined" : "filled"}
      sx={(theme) => {
        const paletteColor = getPaletteColor(theme, finalColor);

        return {
          height: size === "small" ? 28 : 34,
          borderRadius: 1.5,
          px: 0.25,
          fontWeight: 600,
          fontSize: size === "small" ? "0.75rem" : "0.8125rem",

          ...(isSoftVariant && {
            color: paletteColor,
            backgroundColor: alpha(paletteColor, 0.11),
            border: `1px solid ${alpha(paletteColor, 0.18)}`,
            "&:hover": {
              backgroundColor: alpha(paletteColor, 0.16),
            },
          }),

          ...(variant === "outlined" && {
            color: paletteColor,
            borderColor: alpha(paletteColor, 0.45),
            backgroundColor: "transparent",
          }),

          "& .MuiChip-icon": {
            color: "inherit",
            fontSize: size === "small" ? 16 : 18,
            marginLeft: 0.75,
          },

          "& .MuiChip-label": {
            px: 1,
          },

          ...sx,
        };
      }}
    />
  );
};

StatusChip.propTypes = {
  status: PropTypes.string.isRequired,
  label: PropTypes.string,
  color: PropTypes.oneOf([
    "default",
    "primary",
    "secondary",
    "success",
    "warning",
    "error",
    "info",
  ]),
  icon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.node]),
  size: PropTypes.oneOf(["small", "medium"]),
  variant: PropTypes.oneOf(["soft", "filled", "outlined"]),
  sx: PropTypes.object,
};

export default StatusChip;
