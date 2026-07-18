import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Breadcrumbs,
  Button,
  Stack,
  Typography,
  Link as MuiLink,
} from "@mui/material";

import {
  ArrowBack,
  NavigateNext,
} from "@mui/icons-material";

/**
 * Reusable page heading component.
 *
 * Supports:
 * - Page title and subtitle
 * - Back button
 * - Breadcrumbs
 * - Primary action button
 * - Custom action components
 */
const PageHeader = ({
  title,
  subtitle,
  showBackButton = false,
  backPath,
  breadcrumbs = [],
  actionLabel,
  actionIcon,
  onAction,
  actions,
  sx = {},
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
      return;
    }

    navigate(-1);
  };

  const handleBreadcrumbClick = (event, breadcrumb) => {
    event.preventDefault();

    if (breadcrumb.onClick) {
      breadcrumb.onClick();
      return;
    }

    if (breadcrumb.path) {
      navigate(breadcrumb.path);
    }
  };

  return (
    <Box
      sx={{
        mb: 3,
        ...sx,
      }}
    >
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNext fontSize="small" />}
          aria-label="breadcrumb"
          sx={{
            mb: 1.5,
            "& .MuiBreadcrumbs-separator": {
              color: "text.disabled",
            },
          }}
        >
          {breadcrumbs.map((breadcrumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            if (isLast || (!breadcrumb.path && !breadcrumb.onClick)) {
              return (
                <Typography
                  key={`${breadcrumb.label}-${index}`}
                  variant="body2"
                  color={isLast ? "text.primary" : "text.secondary"}
                  fontWeight={isLast ? 600 : 400}
                >
                  {breadcrumb.label}
                </Typography>
              );
            }

            return (
              <MuiLink
                key={`${breadcrumb.label}-${index}`}
                href={breadcrumb.path || "#"}
                underline="hover"
                color="text.secondary"
                variant="body2"
                onClick={(event) =>
                  handleBreadcrumbClick(event, breadcrumb)
                }
                sx={{
                  cursor: "pointer",
                }}
              >
                {breadcrumb.label}
              </MuiLink>
            );
          })}
        </Breadcrumbs>
      )}

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        justifyContent="space-between"
        spacing={2}
      >
        <Stack
          direction="row"
          alignItems="flex-start"
          spacing={showBackButton ? 1.5 : 0}
          sx={{
            minWidth: 0,
          }}
        >
          {showBackButton && (
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleBack}
              aria-label="Go back"
              sx={{
                minWidth: 40,
                width: 40,
                height: 40,
                p: 0,
                borderColor: "divider",
                color: "text.secondary",
                flexShrink: 0,
                mt: 0.25,
                "&:hover": {
                  borderColor: "primary.main",
                  color: "primary.main",
                  backgroundColor: "action.hover",
                },
              }}
            >
              <ArrowBack fontSize="small" />
            </Button>
          )}

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
              color="text.primary"
              sx={{
                fontSize: {
                  xs: "1.5rem",
                  sm: "1.75rem",
                  md: "2rem",
                },
                lineHeight: 1.25,
                wordBreak: "break-word",
              }}
            >
              {title}
            </Typography>

            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.75,
                  maxWidth: 760,
                  lineHeight: 1.6,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>

        {(actionLabel || actions) && (
          <Stack
            direction="row"
            spacing={1.25}
            alignItems="center"
            flexWrap="wrap"
            useFlexGap
            sx={{
              flexShrink: 0,
              width: {
                xs: "100%",
                sm: "auto",
              },
              justifyContent: {
                xs: "flex-start",
                sm: "flex-end",
              },
            }}
          >
            {actions}

            {actionLabel && (
              <Button
                variant="contained"
                startIcon={actionIcon || null}
                onClick={onAction}
                sx={{
                  minHeight: 42,
                  px: 2.25,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "none",
                  "&:hover": {
                    boxShadow: "none",
                  },
                }}
              >
                {actionLabel}
              </Button>
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  showBackButton: PropTypes.bool,
  backPath: PropTypes.string,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string,
      onClick: PropTypes.func,
    })
  ),
  actionLabel: PropTypes.string,
  actionIcon: PropTypes.node,
  onAction: PropTypes.func,
  actions: PropTypes.node,
  sx: PropTypes.object,
};

export default PageHeader;