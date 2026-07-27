import AdminHeader from "../../components/dashboard/AdminHeader";
import AdminStats from "../../components/dashboard/AdminStats";
import UsersTable from "../../components/dashboard/UsersTable";
import SystemStatus from "../../components/dashboard/SystemStatus";
import RecentActivity from "../../components/dashboard/RecentActivity";
import PageTransition from "../../components/ui/PageTransition";

function Admin() {
  return (
    <PageTransition>
    <div className="space-y-8">

      <AdminHeader />

      <AdminStats />

      <div className="grid grid-cols-12 gap-8">

        <div className="col-span-8">
          <UsersTable />
        </div>

        <div className="col-span-4 space-y-8">
          <SystemStatus />
          <RecentActivity />
        </div>

      </div>

    </div>
    </PageTransition>
  );
}

export default Admin;