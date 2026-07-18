import PropTypes from "prop-types";

import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import { MoreVert } from "@mui/icons-material";

/**
 * General-purpose dashboard content card.
 *
 * Can wrap:
 * - Charts
 * - Tables
 * - Lists
 * - Recent activities
 * - Upcoming events
 */
const DashboardCard = ({
  title,
  subtitle,
  icon,
  action,
  children,
  loading = false,
  showDivider = true,
  noPadding = false,
  minHeight,
  onMoreClick,
  sx = {},
  contentSx = {},
}) => {
  const defaultAction =
    onMoreClick && !action ? (
      <Tooltip title="More options">
        <IconButton
          size="small"
          onClick={onMoreClick}
          aria-label="More options"
        >
          <MoreVert fontSize="small" />
        </IconButton>
      </Tooltip>
    ) : null;

  return (
    <Card
      sx={{
        height: "100%",
        minHeight,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 6px 24px rgba(15, 23, 42, 0.05)",
        overflow: "hidden",
        ...sx,
      }}
    >
      <CardHeader
        avatar={
          icon ? (
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "primary.main",
                backgroundColor: "action.hover",
              }}
            >
              {icon}
            </Box>
          ) : null
        }
        title={
          loading ? (
            <Skeleton width={150} height={26} />
          ) : (
            <Typography
              variant="h6"
              component="h2"
              fontWeight={700}
              color="text.primary"
              sx={{
                fontSize: "1rem",
              }}
            >
              {title}
            </Typography>
          )
        }
        subheader={
          loading ? (
            <Skeleton width={220} height={20} />
          ) : subtitle ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.25 }}
            >
              {subtitle}
            </Typography>
          ) : null
        }
        action={loading ? null : action || defaultAction}
        sx={{
          px: { xs: 1.75, sm: 2.5 },
          py: { xs: 1.5, sm: 2 },
          alignItems: { xs: "flex-start", sm: "center" },
          flexWrap: "wrap",
          "& .MuiCardHeader-action": {
            alignSelf: { xs: "flex-start", sm: "center" },
            m: 0,
            maxWidth: "100%",
          },
          "& .MuiCardHeader-avatar": {
            mr: 1.5,
          },
        }}
      />

      {showDivider && <Divider />}

      <CardContent
        sx={{
          p: noPadding ? 0 : { xs: 1.75, sm: 2.5 },
          "&:last-child": {
            pb: noPadding ? 0 : { xs: 1.75, sm: 2.5 },
          },
          ...contentSx,
        }}
      >
        {loading ? (
          <Stack spacing={1.5}>
            <Skeleton variant="rounded" height={80} />
            <Skeleton variant="rounded" height={42} />
            <Skeleton variant="rounded" height={42} />
            <Skeleton variant="rounded" height={42} />
          </Stack>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.node,
  action: PropTypes.node,
  children: PropTypes.node,
  loading: PropTypes.bool,
  showDivider: PropTypes.bool,
  noPadding: PropTypes.bool,
  minHeight: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onMoreClick: PropTypes.func,
  sx: PropTypes.object,
  contentSx: PropTypes.object,
};

export default DashboardCard;
