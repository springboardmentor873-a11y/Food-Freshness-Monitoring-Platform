import DashboardHeader from "../../components/dashboard/DashboardHeader";

import InventoryStats from "../../components/dashboard/InventoryStats";
import InventoryFilters from "../../components/dashboard/InventoryFilters";
import InventoryTable from "../../components/dashboard/InventoryTable";
import Pagination from "../../components/dashboard/Pagination";
import PageTransition from "../../components/ui/PageTransition";

function Inventory() {
  return (
    <PageTransition>
    <div className="space-y-8">

      <DashboardHeader
        title="Global Inventory"
        subtitle="Real-time monitoring of perishability items across facilities."
      />

      <InventoryStats />

      <InventoryFilters />

      <InventoryTable />

      <Pagination />

    </div>
    </PageTransition>
  );
}

export default Inventory;