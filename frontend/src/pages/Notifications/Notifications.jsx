import NotificationsHeader from "../../components/dashboard/NotificationsHeader";
import NotificationFilters from "../../components/dashboard/NotificationFilters";
import NotificationsList from "../../components/dashboard/NotificationsList";
import NotificationSummary from "../../components/dashboard/NotificationSummary";
import PageTransition from "../../components/ui/PageTransition";

function Notifications() {
  return (
    <PageTransition>
    <div className="space-y-8">

      <NotificationsHeader />

      <NotificationFilters />

      <div className="grid grid-cols-12 gap-8">

        <div className="col-span-8">
          <NotificationsList />
        </div>

        <div className="col-span-4">
          <NotificationSummary />
        </div>

      </div>

    </div>
    </PageTransition>
  );
}

export default Notifications;