import { createTheme } from "@mui/material/styles";

import colors from "./colors";
import typography from "./typography";

const theme = createTheme({
  palette: colors,

  typography,

  shape: {
    borderRadius: 14,
  },

  spacing: 8,

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.background.default,
          margin: 0,
          padding: 0,
        },

        "*": {
          boxSizing: "border-box",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow:
            "0 4px 20px rgba(0,0,0,0.06)",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow:
            "0px 8px 24px rgba(0,0,0,.08)",
          transition: ".25s",

          "&:hover": {
            transform: "translateY(-2px)",
          },
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "10px 22px",
          fontWeight: 600,
        },

        containedPrimary: {
          background:
            "linear-gradient(90deg,#1565C0,#1E88E5)",
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        size: "medium",
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "none",
          background: "#ffffff",
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 2px 10px rgba(0,0,0,.08)",
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          background: "#F4F6F8",
        },
      },
    },
  },
});

export default theme;