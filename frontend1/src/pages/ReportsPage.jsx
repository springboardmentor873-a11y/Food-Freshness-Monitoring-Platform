import { useState } from "react";
import { FileText } from "lucide-react";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import ReportBuilder from "../components/reports/ReportBuilder";
import ReportPreviewTable from "../components/reports/ReportPreviewTable";
import ExportPDFButton from "../components/reports/ExportPDFButton";
import ExportCSVButton from "../components/reports/ExportCSVButton";

export default function ReportsPage() {
  const [report, setReport] = useState(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Build a report from current inventory data and export it as PDF or CSV.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <Card.Header title="Report Builder" />
          <ReportBuilder onGenerate={setReport} />
        </Card>

        <div className="space-y-4 lg:col-span-2">
          {!report ? (
            <EmptyState
              icon={FileText}
              title="No report generated yet"
              description="Choose a report type and click Generate Report to see a preview here."
            />
          ) : (
            <Card>
              <Card.Header
                title={report.title}
                subtitle={`${report.rows.length} records`}
                action={
                  <div className="flex gap-2">
                    <ExportCSVButton title={report.title} columns={report.columns} rows={report.rows} />
                    <ExportPDFButton title={report.title} columns={report.columns} rows={report.rows} />
                  </div>
                }
              />
              {report.rows.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No records match this report"
                  description="Try a different category or date range."
                />
              ) : (
                <ReportPreviewTable columns={report.columns} rows={report.rows} />
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
