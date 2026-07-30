import { FileDown } from "lucide-react";
import Button from "../ui/Button";
import { exportToPdf } from "../../utils/exportPdf";
import { appToast } from "../ui/Toast";

/**
 * ExportPDFButton — opens a print-styled report window (Save as PDF).
 */
export default function ExportPDFButton({ title, columns, rows, disabled }) {
  const handleExport = () => {
    if (!rows?.length) return;
    exportToPdf(title, columns, rows);
    appToast.success("Opening print preview — choose \"Save as PDF\" to download");
  };

  return (
    <Button variant="secondary" leftIcon={<FileDown size={16} />} onClick={handleExport} disabled={disabled}>
      Export PDF
    </Button>
  );
}
