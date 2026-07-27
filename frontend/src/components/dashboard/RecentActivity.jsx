const activities = [
  {
    time: "10:15 AM",
    text: "Admin logged in",
  },

  {
    time: "10:42 AM",
    text: "New user created",
  },

  {
    time: "11:20 AM",
    text: "Weekly report generated",
  },

  {
    time: "12:05 PM",
    text: "Inventory updated",
  },
];

function RecentActivity() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-2xl font-bold">
        Recent Activity
      </h2>

      <div className="space-y-5">

        {activities.map((activity, index) => (

          <div
            key={index}
            className="rounded-xl bg-gray-50 p-4"
          >

            <p className="text-sm text-gray-500">
              {activity.time}
            </p>

            <p className="mt-1 font-semibold">
              {activity.text}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}

export default RecentActivity;