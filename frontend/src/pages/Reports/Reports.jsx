import ReportsHeader from "../../components/dashboard/ReportsHeader";
import ReportsFilters from "../../components/dashboard/ReportsFilters";
import ReportCards from "../../components/dashboard/ReportCards";
import ReportsHistory from "../../components/dashboard/ReportsHistory";
import ReportsSidebar from "../../components/dashboard/ReportsSidebar";
import PageTransition from "../../components/ui/PageTransition";

function Reports() {
  return (
    <PageTransition>
    <div className="space-y-8">

      <ReportsHeader />

      <ReportsFilters />

      <div className="grid grid-cols-12 gap-8">

        <div className="col-span-8 space-y-8">
          <ReportCards />
          <ReportsHistory />
        </div>

        <div className="col-span-4">
          <ReportsSidebar />
        </div>

      </div>

    </div>
    </PageTransition>
  );
}

export default Reports;