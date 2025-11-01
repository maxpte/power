export function exportTableToCSV(tableEl, filename = "export.csv") {
  if (!tableEl) return;
  const rows = tableEl.querySelectorAll("tr");
  const csv = Array.from(rows)
    .map((row) => {
      const cells = row.querySelectorAll("th, td");
      return Array.from(cells)
        .map((cell) => {
          const raw = (cell.innerText || "")
            .replace(/\r?\n|\r/g, " ")
            .trim()
            .replace(/"/g, '""');
          return "${raw}";
        })
        .join(",");
    })
    .join("\n");

  const blob = new Blob(["\uFEFF" + csv], {
    type: "text/csv;charset=utf-8;",
  });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}