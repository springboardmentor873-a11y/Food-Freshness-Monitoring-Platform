import { Inbox } from "lucide-react";

function EmptyState({
  title,
  description,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">

      <Inbox
        size={60}
        className="mb-4 text-slate-300"
      />

      <h3 className="text-2xl font-bold text-slate-700">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-slate-500">
        {description}
      </p>

    </div>
  );
}

export default EmptyState;