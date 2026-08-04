import { useEffect, useState } from "react";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import { deletePredictionHistory, getPredictionHistory } from "../../services/history";

function PredictionHistory() {
  const [history, setHistory] = useState({ items: [], total: 0, page: 1, page_size: 20 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getPredictionHistory({ page, search: search || undefined, freshness_status: status || undefined })
      .then((data) => active && setHistory(data))
      .catch((requestError) => active && setError(requestError.response?.data?.detail || "Unable to load prediction history."));
    return () => { active = false; };
  }, [page, search, status]);

  const remove = async (id) => {
    try { await deletePredictionHistory(id); setHistory((current) => ({ ...current, total: current.total - 1, items: current.items.filter((item) => item.id !== id) })); }
    catch (requestError) { setError(requestError.response?.data?.detail || "Unable to delete this prediction."); }
  };

  const totalPages = Math.max(1, Math.ceil(history.total / history.page_size));
  return <div className="space-y-8">
    <DashboardHeader title="Prediction History" subtitle="Review all AI freshness predictions for your account." />
    <div className="flex flex-wrap gap-3 rounded-2xl bg-white p-5 shadow-sm">
      <input className="rounded-xl border px-4 py-2" onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search prediction" value={search} />
      <select className="rounded-xl border px-4 py-2" onChange={(event) => { setStatus(event.target.value); setPage(1); }} value={status}><option value="">All statuses</option><option value="fresh">Fresh</option><option value="spoiled">Spoiled</option></select>
    </div>
    {error && <p className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="grid grid-cols-5 gap-4 border-b bg-gray-50 px-6 py-4 text-xs font-bold uppercase text-gray-500"><span>Prediction</span><span>Confidence</span><span>Status</span><span>Date</span><span className="text-right">Action</span></div>
      {history.items.length === 0 && <p className="p-6 text-gray-500">No prediction history found.</p>}
      {history.items.map((item) => <div className="grid grid-cols-5 items-center gap-4 border-b px-6 py-4" key={item.id}><span className="font-semibold capitalize">{item.prediction.replaceAll("_", " ")}</span><span>{(item.confidence * 100).toFixed(2)}%</span><span className={item.freshness_status === "fresh" ? "font-semibold text-green-600" : "font-semibold text-red-600"}>{item.freshness_status}</span><span>{new Date(item.created_at).toLocaleString()}</span><button className="justify-self-end rounded-lg border px-3 py-1 text-red-600 hover:bg-red-50" onClick={() => remove(item.id)} type="button">Delete</button></div>)}
    </div>
    <div className="flex items-center justify-between"><button disabled={page === 1} onClick={() => setPage(page - 1)} type="button">← Previous</button><span>Page {page} of {totalPages}</span><button disabled={page === totalPages} onClick={() => setPage(page + 1)} type="button">Next →</button></div>
  </div>;
}

export default PredictionHistory;
