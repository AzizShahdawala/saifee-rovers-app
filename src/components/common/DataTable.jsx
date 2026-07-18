/* eslint-disable no-unused-vars */
import React from "react";
import PropTypes from "prop-types";

import {
  Box,
  Checkbox,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";

import EmptyState from "./EmptyState";

const descendingComparator = (a, b, orderBy) => {
  const firstValue = a?.[orderBy];
  const secondValue = b?.[orderBy];

  if (secondValue < firstValue) {
    return -1;
  }

  if (secondValue > firstValue) {
    return 1;
  }

  return 0;
};

const getComparator = (order, orderBy) =>
  order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);

const stableSort = (array, comparator) =>
  array
    .map((item, index) => [item, index])
    .sort((a, b) => {
      const sortResult = comparator(a[0], b[0]);

      if (sortResult !== 0) {
        return sortResult;
      }

      return a[1] - b[1];
    })
    .map(([item]) => item);

const getNestedValue = (object, accessor) => {
  if (!accessor) {
    return "";
  }

  return accessor.split(".").reduce((value, key) => value?.[key], object);
};

/**
 * columns example:
 *
 * [
 *   {
 *     id: "name",
 *     label: "Name",
 *     sortable: true,
 *     minWidth: 180,
 *   },
 *   {
 *     id: "status",
 *     label: "Status",
 *     render: (row) => <StatusChip status={row.status} />,
 *   },
 * ]
 */
const DataTable = ({
  columns,
  rows = [],
  loading = false,
  getRowId = (row) => row._id || row.id,
  emptyTitle = "No records found",
  emptyDescription = "There is currently no data available.",
  emptyIcon,
  emptyAction,
  pagination = true,
  page = 0,
  rowsPerPage = 10,
  rowsPerPageOptions = [5, 10, 25, 50],
  totalRows,
  onPageChange,
  onRowsPerPageChange,
  sortable = true,
  defaultOrderBy = "",
  defaultOrder = "asc",
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  stickyHeader = false,
  maxHeight,
  dense = false,
  onRowClick,
  rowSx,
  sx = {},
}) => {
  const [internalPage, setInternalPage] = React.useState(page);
  const [internalRowsPerPage, setInternalRowsPerPage] =
    React.useState(rowsPerPage);
  const [order, setOrder] = React.useState(defaultOrder);
  const [orderBy, setOrderBy] = React.useState(defaultOrderBy);

  const controlledPagination =
    typeof onPageChange === "function" ||
    typeof onRowsPerPageChange === "function";

  const currentPage = controlledPagination ? page : internalPage;
  const currentRowsPerPage = controlledPagination
    ? rowsPerPage
    : internalRowsPerPage;

  const handleSort = (columnId) => {
    const isAscending = orderBy === columnId && order === "asc";

    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(columnId);
  };

  const handlePageChange = (event, newPage) => {
    if (onPageChange) {
      onPageChange(event, newPage);
      return;
    }

    setInternalPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = Number(event.target.value);

    if (onRowsPerPageChange) {
      onRowsPerPageChange(event);
      return;
    }

    setInternalRowsPerPage(newRowsPerPage);
    setInternalPage(0);
  };

  const isSelected = (rowId) => selectedRows.includes(rowId);

  const handleSelectAll = (event) => {
    if (!onSelectionChange) {
      return;
    }

    if (event.target.checked) {
      const allRowIds = rows.map((row) => getRowId(row));
      onSelectionChange(allRowIds);
      return;
    }

    onSelectionChange([]);
  };

  const handleSelectRow = (event, rowId) => {
    event.stopPropagation();

    if (!onSelectionChange) {
      return;
    }

    if (isSelected(rowId)) {
      onSelectionChange(
        selectedRows.filter((selectedId) => selectedId !== rowId),
      );
      return;
    }

    onSelectionChange([...selectedRows, rowId]);
  };

  const sortedRows =
    sortable && orderBy
      ? stableSort(rows, getComparator(order, orderBy))
      : rows;

  const visibleRows =
    pagination && !controlledPagination
      ? sortedRows.slice(
          currentPage * currentRowsPerPage,
          currentPage * currentRowsPerPage + currentRowsPerPage,
        )
      : sortedRows;

  const displayRowCount = totalRows !== undefined ? totalRows : rows.length;

  const loadingRows = Array.from(
    { length: currentRowsPerPage },
    (_, index) => index,
  );

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
        ...sx,
      }}
    >
      <TableContainer
        sx={{
          maxHeight: maxHeight || "none",
        }}
      >
        <Table
          stickyHeader={stickyHeader}
          size={dense ? "small" : "medium"}
          aria-label="data table"
        >
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell
                  padding="checkbox"
                  sx={{
                    backgroundColor: "background.default",
                  }}
                >
                  <Checkbox
                    color="primary"
                    indeterminate={
                      selectedRows.length > 0 &&
                      selectedRows.length < rows.length
                    }
                    checked={
                      rows.length > 0 && selectedRows.length === rows.length
                    }
                    onChange={handleSelectAll}
                    inputProps={{
                      "aria-label": "Select all rows",
                    }}
                  />
                </TableCell>
              )}

              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || "left"}
                  sortDirection={orderBy === column.id ? order : false}
                  sx={{
                    minWidth: column.minWidth,
                    width: column.width,
                    whiteSpace: column.nowrap ? "nowrap" : "normal",
                    fontWeight: 700,
                    color: "text.secondary",
                    backgroundColor: "background.default",
                    borderBottomColor: "divider",
                    ...column.headerSx,
                  }}
                >
                  {sortable && column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : "asc"}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading &&
              loadingRows.map((rowIndex) => (
                <TableRow key={`loading-${rowIndex}`}>
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Skeleton variant="rounded" width={20} height={20} />
                    </TableCell>
                  )}

                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      <Skeleton
                        variant="text"
                        height={28}
                        width={column.skeletonWidth || "80%"}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!loading &&
              visibleRows.map((row, rowIndex) => {
                const rowId = getRowId(row);
                const selected = isSelected(rowId);

                return (
                  <TableRow
                    hover
                    key={rowId}
                    selected={selected}
                    onClick={() => onRowClick?.(row, rowIndex)}
                    sx={{
                      cursor: onRowClick ? "pointer" : "default",
                      "&:last-child td": {
                        borderBottom: pagination ? undefined : 0,
                      },
                      ...(typeof rowSx === "function"
                        ? rowSx(row, rowIndex)
                        : rowSx),
                    }}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={selected}
                          onClick={(event) => handleSelectRow(event, rowId)}
                          inputProps={{
                            "aria-label": `Select row ${rowIndex + 1}`,
                          }}
                        />
                      </TableCell>
                    )}

                    {columns.map((column) => {
                      const value = getNestedValue(row, column.id);

                      return (
                        <TableCell
                          key={column.id}
                          align={column.align || "left"}
                          sx={{
                            color: "text.primary",
                            whiteSpace: column.nowrap ? "nowrap" : "normal",
                            ...column.cellSx,
                          }}
                        >
                          {column.render
                            ? column.render(row, value, rowIndex)
                            : (value ?? "-")}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}

            {!loading && rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  sx={{
                    borderBottom: 0,
                    py: 0,
                  }}
                >
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    icon={emptyIcon}
                    action={emptyAction}
                    minHeight={320}
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && !loading && rows.length > 0 && (
        <TablePagination
          component="div"
          count={displayRowCount}
          page={currentPage}
          rowsPerPage={currentRowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          labelRowsPerPage="Rows per page"
          sx={{
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        />
      )}
    </Paper>
  );
};

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
      align: PropTypes.oneOf(["left", "center", "right", "justify"]),
      sortable: PropTypes.bool,
      minWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      nowrap: PropTypes.bool,
      render: PropTypes.func,
      headerSx: PropTypes.object,
      cellSx: PropTypes.object,
      skeletonWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ).isRequired,
  rows: PropTypes.array,
  loading: PropTypes.bool,
  getRowId: PropTypes.func,
  emptyTitle: PropTypes.string,
  emptyDescription: PropTypes.string,
  emptyIcon: PropTypes.node,
  emptyAction: PropTypes.node,
  pagination: PropTypes.bool,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  totalRows: PropTypes.number,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  sortable: PropTypes.bool,
  defaultOrderBy: PropTypes.string,
  defaultOrder: PropTypes.oneOf(["asc", "desc"]),
  selectable: PropTypes.bool,
  selectedRows: PropTypes.array,
  onSelectionChange: PropTypes.func,
  stickyHeader: PropTypes.bool,
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  dense: PropTypes.bool,
  onRowClick: PropTypes.func,
  rowSx: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  sx: PropTypes.object,
};

export default DataTable;
