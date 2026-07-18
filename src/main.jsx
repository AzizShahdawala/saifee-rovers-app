import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import App from "./App";
import theme from "./theme/theme";
import "./index.css";

// A browser may retain the GitHub Pages pathname from an older local build.
// HashRouter owns client-side routing, so local development must always start
// from the origin root while preserving any hash route that was requested.
if (import.meta.env.DEV && window.location.pathname !== "/") {
  window.history.replaceState(null, "", `/${window.location.hash}`);
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </HashRouter>
  </React.StrictMode>
);
