import { Thermometer, Droplets, MapPin, Calendar, Package } from "lucide-react";
import Drawer from "../ui/Drawer";
import Button from "../ui/Button";
import GaugeMeter from "../ui/GaugeMeter";
import { STATUS_COLORS } from "../../mocks/dashboardStats";
import { appToast } from "../ui/Toast";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

/**
 * BatchDetailDrawer — full detail view for a single inventory batch,
 * opened from InventoryTable row/card selection.
 */
export default function BatchDetailDrawer({ item, isOpen, onClose }) {
  if (!item) return null;

  const handleRemove = () => {
    appToast.success(`${item.name} (${item.batchId}) marked for removal`);
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title="Batch Details">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <GaugeMeter value={item.freshnessScore} size={84} strokeWidth={8} valueSuffix="" />
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.name}</h3>
            <p className="text-sm text-slate-400">{item.category}</p>
            <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[item.freshnessCategory]}`}>
              {item.freshnessCategory}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <DetailBlock icon={Package} label="Batch ID" value={item.batchId} mono />
          <DetailBlock icon={MapPin} label="Location" value={item.location} />
          <DetailBlock icon={Calendar} label="Received" value={formatDate(item.receivedDate)} />
          <DetailBlock icon={Calendar} label="Expiry" value={formatDate(item.expiryDate)} />
          <DetailBlock icon={Thermometer} label="Temperature" value={item.storage.temperature} />
          <DetailBlock icon={Droplets} label="Humidity" value={item.storage.humidity} />
        </div>

        <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
          <p className="text-xs font-medium text-slate-400">Quantity in Stock</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {item.quantity} <span className="text-sm font-medium text-slate-400">{item.unit}</span>
          </p>
        </div>

        <div className="flex gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <Button variant="destructive" className="flex-1" onClick={handleRemove}>
            Remove Batch
          </Button>
        </div>
      </div>
    </Drawer>
  );
}

function DetailBlock({ icon: Icon, label, value, mono = false }) {
  return (
    <div className="rounded-xl border border-slate-100 p-3 dark:border-slate-800">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
        <Icon size={12} /> {label}
      </div>
      <p className={`mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100 ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}
