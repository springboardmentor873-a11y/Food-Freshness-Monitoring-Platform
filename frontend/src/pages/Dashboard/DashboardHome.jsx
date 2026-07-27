import {
  Box,
  CircleCheck,
  TriangleAlert,
  TrendingUp,
} from "lucide-react";

import PageHeader from "../../components/ui/PageHeader";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import PageTransition from "../../components/ui/PageTransition";
import FreshnessLineChart from "../../components/dashboard/charts/FreshnessLineChart";

function DashboardHome() {
  return (
    <PageTransition>
    <div className="space-y-8">

      <PageHeader
        title="Operations Overview"
        subtitle="Live quality monitoring and freshness distribution analytics."
        action={
          <div className="flex gap-3">
            <Button variant="success">
              Scan Food
            </Button>

            <Button>
              Upload Image
            </Button>

            <Button variant="secondary">
              Generate Report
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-4 gap-6">

        <StatCard
          title="Total Foods"
          value="3,240"
          color="blue"
          icon={<Box size={28} />}
        />

        <StatCard
          title="Fresh Foods"
          value="2,850"
          color="green"
          icon={<CircleCheck size={28} />}
        />

        <StatCard
          title="Spoiled Foods"
          value="120"
          color="red"
          icon={<TriangleAlert size={28} />}
        />

        <StatCard
          title="Near Expiry"
          value="270"
          color="orange"
          icon={<TrendingUp size={28} />}
        />

      </div>

      <div className="grid grid-cols-2 gap-6">

    <Card>

      <h2 className="mb-5 text-xl font-semibold">
        Freshness Trend
      </h2>

      <FreshnessLineChart />

    </Card>

        <Card>

          <h2 className="mb-5 text-xl font-semibold">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <Button variant="success">
              Detect Food
            </Button>

            <Button>
              Inventory
            </Button>

            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              Reports
            </Button>

            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              Analytics
            </Button>

          </div>

        </Card>

      </div>

    </div>
  </PageTransition>
  );
}

export default DashboardHome;