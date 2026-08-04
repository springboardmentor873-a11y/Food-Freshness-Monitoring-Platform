function QualityFeed({ activity }) {
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
            <th>Confidence</th>
            <th>Status</th>
            <th>Timestamp</th>

          </tr>

        </thead>

        <tbody>

          {activity.map((feed) => (
            <tr key={`${feed.prediction}-${feed.created_at}`} className="border-b">

              <td className="px-8 py-6 font-semibold">
                {feed.prediction.replaceAll("_", " ")}
              </td>
              <td>{(feed.confidence * 100).toFixed(2)}%</td>

              <td>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    feed.freshness_status === "fresh"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {feed.freshness_status}
                </span>

              </td>

              <td>{new Date(feed.created_at).toLocaleString()}</td></tr>
          ))}
          {!activity.length && <tr><td className="px-8 py-6 text-gray-500" colSpan="4">No prediction activity yet.</td></tr>}

        </tbody>

      </table>

    </div>
  );
}

export default QualityFeed;
