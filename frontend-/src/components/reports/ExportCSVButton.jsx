import { FileSpreadsheet } from "lucide-react";
import Button from "../ui/Button";
import { exportToCsv } from "../../utils/exportCsv";
import { appToast } from "../ui/Toast";

/**
 * ExportCSVButton — downloads the current report as a .csv file.
 */
export default function ExportCSVButton({ title, columns, rows, disabled }) {
  const handleExport = () => {
    if (!rows?.length) return;
    const filename = title.toLowerCase().replace(/\s+/g, "-");
    exportToCsv(filename, columns, rows);
    appToast.success("CSV downloaded");
  };

  return (
    <Button variant="secondary" leftIcon={<FileSpreadsheet size={16} />} onClick={handleExport} disabled={disabled}>
      Export CSV
    </Button>
  );
}
