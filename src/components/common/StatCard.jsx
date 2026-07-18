import PropTypes from "prop-types";

import {
  Avatar,
  Box,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Typography,
  alpha,
} from "@mui/material";

import {
  ArrowDownward,
  ArrowUpward,
} from "@mui/icons-material";

const colorMap = {
  primary: {
    main: "primary.main",
    light: "primary.light",
  },
  secondary: {
    main: "secondary.main",
    light: "secondary.light",
  },
  success: {
    main: "success.main",
    light: "success.light",
  },
  warning: {
    main: "warning.main",
    light: "warning.light",
  },
  error: {
    main: "error.main",
    light: "error.light",
  },
  info: {
    main: "info.main",
    light: "info.light",
  },
};

/**
 * Reusable dashboard statistics card.
 *
 * Examples:
 * - Total Members
 * - Active Events
 * - Today's Attendance
 * - Attendance Percentage
 */
const StatCard = ({
  title,
  value,
  icon,
  color = "primary",
  trend,
  trendLabel,
  helperText,
  loading = false,
  onClick,
  sx = {},
}) => {
  const selectedColor = colorMap[color] || colorMap.primary;
  const numericTrend = Number(trend);
  const hasTrend =
    trend !== undefined &&
    trend !== null &&
    trend !== "" &&
    !Number.isNaN(numericTrend);

  const isPositiveTrend = numericTrend >= 0;

  return (
    <Card
      onClick={onClick}
      sx={{
        height: "100%",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 6px 24px rgba(15, 23, 42, 0.05)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick
          ? {
              transform: "translateY(-3px)",
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.1)",
            }
          : {},
        ...sx,
      }}
    >
      <CardContent
        sx={{
          p: 2.5,
          "&:last-child": {
            pb: 2.5,
          },
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            {loading ? (
              <>
                <Skeleton width="55%" height={24} />
                <Skeleton
                  width="45%"
                  height={46}
                  sx={{ mt: 0.5 }}
                />
                <Skeleton
                  width="70%"
                  height={22}
                  sx={{ mt: 1 }}
                />
              </>
            ) : (
              <>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                  noWrap
                >
                  {title}
                </Typography>

                <Typography
                  variant="h4"
                  color="text.primary"
                  fontWeight={700}
                  sx={{
                    mt: 0.75,
                    lineHeight: 1.2,
                    wordBreak: "break-word",
                  }}
                >
                  {value ?? 0}
                </Typography>
              </>
            )}
          </Box>

          {loading ? (
            <Skeleton
              variant="rounded"
              width={52}
              height={52}
              sx={{ borderRadius: 2.5 }}
            />
          ) : (
            <Avatar
              variant="rounded"
              sx={(theme) => ({
                width: 52,
                height: 52,
                borderRadius: 2.5,
                color: selectedColor.main,
                backgroundColor: alpha(
                  theme.palette[color]?.main ||
                    theme.palette.primary.main,
                  0.12
                ),
                flexShrink: 0,
              })}
            >
              {icon}
            </Avatar>
          )}
        </Stack>

        {!loading && (hasTrend || trendLabel || helperText) && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.75}
            sx={{
              mt: 2,
              minHeight: 22,
              flexWrap: "wrap",
            }}
          >
            {hasTrend && (
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.25}
                sx={{
                  color: isPositiveTrend
                    ? "success.main"
                    : "error.main",
                }}
              >
                {isPositiveTrend ? (
                  <ArrowUpward sx={{ fontSize: 16 }} />
                ) : (
                  <ArrowDownward sx={{ fontSize: 16 }} />
                )}

                <Typography
                  variant="caption"
                  fontWeight={700}
                  color="inherit"
                >
                  {Math.abs(numericTrend)}%
                </Typography>
              </Stack>
            )}

            {trendLabel && (
              <Typography
                variant="caption"
                color="text.secondary"
              >
                {trendLabel}
              </Typography>
            )}

            {helperText && (
              <Typography
                variant="caption"
                color="text.secondary"
              >
                {helperText}
              </Typography>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  icon: PropTypes.node.isRequired,
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "warning",
    "error",
    "info",
  ]),
  trend: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  trendLabel: PropTypes.string,
  helperText: PropTypes.string,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  sx: PropTypes.object,
};

export default StatCard;