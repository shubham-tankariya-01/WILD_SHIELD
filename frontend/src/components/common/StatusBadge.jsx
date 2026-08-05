const statusConfig = {
  pending: { label: "Pending", bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" },
  verified: { label: "Verified", bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-400" },
  assigned: { label: "Assigned", bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  in_progress: { label: "In Progress", bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-400" },
  resolved: { label: "Resolved", bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  rejected: { label: "Rejected", bg: "bg-red-50", text: "text-red-700", dot: "bg-red-400" },
};

const priorityConfig = {
  low: { label: "Low", bg: "bg-green-50", text: "text-green-700" },
  medium: { label: "Medium", bg: "bg-amber-50", text: "text-amber-700" },
  high: { label: "High", bg: "bg-orange-50", text: "text-orange-700" },
  critical: { label: "Critical", bg: "bg-red-50", text: "text-red-700" },
};

export function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const config = priorityConfig[priority] || priorityConfig.medium;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}
