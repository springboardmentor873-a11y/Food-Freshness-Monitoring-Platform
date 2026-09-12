/**
 * exportToCsv — builds a CSV string from column/row definitions and
 * triggers a browser download. No external CSV library needed — this
 * stays a client-only concern even after FastAPI ships, since the
 * report data itself will come from reportService by then.
 */
export function exportToCsv(filename, columns, rows) {
  const escapeCell = (value) => {
    const str = String(value ?? "");
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const header = columns.map((c) => escapeCell(c.label)).join(",");
  const body = rows.map((row) => columns.map((c) => escapeCell(row[c.key])).join(",")).join("\n");
  const csvContent = `${header}\n${body}`;

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
