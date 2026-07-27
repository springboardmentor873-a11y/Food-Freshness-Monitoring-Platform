const feeds = [
  ["🥛", "Cage-Free Dairy", "Chicago Hub", "92%", "99.8%", "Optimal"],
  ["🍓", "Organic Strawberries", "Dallas Logistics", "68%", "96.4%", "Near Expiry"],
  ["🥩", "Prime Rib-Eye", "NJ Terminal C", "12%", "99.1%", "Spoiled"],
];

function QualityFeed() {
  return (
    <div className="rounded-3xl bg-white shadow-sm overflow-hidden">

      <div className="flex items-center justify-between p-8">

        <h2 className="text-4xl font-bold">
          Live Quality Feed
        </h2>

        <button className="font-semibold text-blue-600">
          View All Logs →
        </button>

      </div>

      <table className="w-full">

        <thead className="border-t border-b bg-gray-50">

          <tr className="text-left text-sm uppercase tracking-wide text-gray-500">

            <th className="px-8 py-5">Food Category</th>
            <th>Facility</th>
            <th>Score</th>
            <th>Confidence</th>
            <th>Status</th>

          </tr>

        </thead>

        <tbody>

          {feeds.map((feed) => (
            <tr key={feed[1]} className="border-b">

              <td className="px-8 py-6 font-semibold">
                {feed[0]} {feed[1]}
              </td>

              <td>{feed[2]}</td>

              <td>{feed[3]}</td>

              <td>{feed[4]}</td>

              <td>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    feed[5] === "Optimal"
                      ? "bg-green-100 text-green-600"
                      : feed[5] === "Near Expiry"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {feed[5]}
                </span>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default QualityFeed;