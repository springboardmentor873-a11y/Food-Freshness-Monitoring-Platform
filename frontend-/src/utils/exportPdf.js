/**
 * exportToPdf — opens a branded, print-styled report in a new tab and
 * triggers the browser print dialog, where "Save as PDF" produces the
 * file. Avoids pulling in a client-side PDF library for a mock-data
 * milestone; swap for a server-rendered PDF from FastAPI later if a
 * pixel-perfect export becomes a requirement.
 */
export function exportToPdf(title, columns, rows) {
  const printWindow = window.open("", "_blank", "width=900,height=700");
  if (!printWindow) return;

  const tableHeader = columns.map((c) => `<th>${c.label}</th>`).join("");
  const tableRows = rows
    .map((row) => `<tr>${columns.map((c) => `<td>${row[c.key] ?? ""}</td>`).join("")}</tr>`)
    .join("");

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title} — FreshAI</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: -apple-system, Segoe UI, Inter, sans-serif; padding: 40px; color: #0F172A; }
          .brand { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
          .brand-mark { width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg, #10B981, #14B8A6); }
          .brand-name { font-weight: 800; font-size: 15px; }
          h1 { font-size: 22px; margin: 24px 0 4px; }
          .meta { color: #64748B; font-size: 12px; margin-bottom: 24px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th { text-align: left; background: #F0FDFA; color: #0F766E; padding: 10px 12px; border-bottom: 2px solid #99F6E4; text-transform: uppercase; font-size: 10px; letter-spacing: 0.03em; }
          td { padding: 9px 12px; border-bottom: 1px solid #E2E8F0; }
          tr:nth-child(even) td { background: #F8FAFC; }
          footer { margin-top: 28px; font-size: 10px; color: #94A3B8; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="brand">
          <span class="brand-mark"></span>
          <span class="brand-name">FreshAI</span>
        </div>
        <h1>${title}</h1>
        <p class="meta">Generated ${new Date().toLocaleString()} · ${rows.length} records</p>
        <table>
          <thead><tr>${tableHeader}</tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
        <footer>AI Powered Food Freshness Monitoring Platform — Infosys Springboard Project</footer>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}
