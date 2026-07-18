import { useEffect } from "react";
import PropTypes from "prop-types";

import { IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";

import { Close, Search } from "@mui/icons-material";

const SearchBar = ({
  value = "",
  onChange,
  onSearch,
  placeholder = "Search...",
  debounceTime = 0,
  fullWidth = true,
  size = "small",
  disabled = false,
  autoFocus = false,
  clearable = true,
  sx = {},
}) => {
  useEffect(() => {
    if (!onSearch || debounceTime <= 0) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      onSearch(value.trim());
    }, debounceTime);

    return () => clearTimeout(timeoutId);
  }, [value, debounceTime, onSearch]);

  const handleChange = (event) => {
    const nextValue = event.target.value;

    onChange?.(nextValue);
  };

  const handleClear = () => {
    onChange?.("");
    onSearch?.("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      onSearch?.(value.trim());
    }
  };

  return (
    <TextField
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      fullWidth={fullWidth}
      size={size}
      disabled={disabled}
      autoFocus={autoFocus}
      inputProps={{
        "aria-label": placeholder,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search
              fontSize="small"
              sx={{
                color: "text.secondary",
              }}
            />
          </InputAdornment>
        ),
        endAdornment:
          clearable && value ? (
            <InputAdornment position="end">
              <Tooltip title="Clear search">
                <IconButton
                  edge="end"
                  size="small"
                  onClick={handleClear}
                  aria-label="Clear search"
                >
                  <Close fontSize="small" />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ) : null,
      }}
      sx={{
        maxWidth: fullWidth ? "100%" : 420,
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          backgroundColor: "background.paper",
        },
        ...sx,
      }}
    />
  );
};

SearchBar.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  placeholder: PropTypes.string,
  debounceTime: PropTypes.number,
  fullWidth: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium"]),
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  clearable: PropTypes.bool,
  sx: PropTypes.object,
};

export default SearchBar;
