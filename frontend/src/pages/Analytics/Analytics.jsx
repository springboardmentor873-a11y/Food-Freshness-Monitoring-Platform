import AnalyticsHeader from "../../components/dashboard/AnalyticsHeader";
import AnalyticsStats from "../../components/dashboard/AnalyticsStats";
import FreshnessChart from "../../components/dashboard/FreshnessChart";
import WasteReduction from "../../components/dashboard/WasteReduction";
import QualityFeed from "../../components/dashboard/QualityFeed";
import PageTransition from "../../components/ui/PageTransition";

function Analytics() {
  return (
    <PageTransition>
    <div className="space-y-8">

      <AnalyticsHeader />

      <AnalyticsStats />

      <div className="grid grid-cols-12 gap-8">

        <div className="col-span-8">
          <FreshnessChart />
        </div>

        <div className="col-span-4">
          <WasteReduction />
        </div>

      </div>

      <QualityFeed />

    </div>
    </PageTransition>
  );
}

export default Analytics;