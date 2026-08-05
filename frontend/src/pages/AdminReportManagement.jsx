import { useState, useEffect } from "react";
import { getAllReports, updateReportStatus, assignTeam } from "../api/reportApi";
import { getTeams } from "../api/teamApi";
import { StatusBadge, PriorityBadge } from "../components/common/StatusBadge";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import { HiFilter, HiCheck, HiTruck, HiX, HiEye } from "react-icons/hi";

export default function AdminReportManagement() {
  const [reports, setReports] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchData = async () => {
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      const [reportsRes, teamsRes] = await Promise.all([getAllReports(params), getTeams()]);
      setReports(reportsRes.data.reports || []);
      setTeams(teamsRes.data);
    } catch {
      toast.error("Failed to load data");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [statusFilter, priorityFilter]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateReportStatus(id, status);
      toast.success(`Status updated to ${status}`);
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const handleAssign = async (reportId, teamId) => {
    try {
      await assignTeam(reportId, teamId);
      toast.success("Team assigned!");
      fetchData();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  if (loading) return <LoadingSpinner text="Loading reports..." />;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Report Management</h1>
        <span className="text-text-muted text-xs sm:text-sm">{reports.length} reports</span>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center">
        <HiFilter className="text-text-muted hidden sm:block" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-full sm:w-auto text-sm sm:text-base">
          <option value="">All Statuses</option>
          {["pending", "verified", "assigned", "in_progress", "resolved", "rejected"].map((s) => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="input-field w-full sm:w-auto text-sm sm:text-base">
          <option value="">All Priorities</option>
          {["low", "medium", "high", "critical"].map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-warm-200">
        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-forest-50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-forest uppercase">Animal</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-forest uppercase">Reporter</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-forest uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-forest uppercase">Priority</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-forest uppercase">Location</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-forest uppercase">Team</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-forest uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-100">
              {reports.map((r) => (
                <tr key={r._id} className="hover:bg-warm-bg transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {r.photo_url && <img src={r.photo_url} alt="" className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />}
                      <span className="font-medium text-sm truncate max-w-[120px]">{r.animal_type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary truncate max-w-[120px]">{r.user_id?.name || "Unknown"}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3"><PriorityBadge priority={r.priority} /></td>
                  <td className="px-4 py-3 text-sm text-text-secondary max-w-[150px] truncate">{r.location?.address || `${r.location?.lat?.toFixed(2)}, ${r.location?.lng?.toFixed(2)}`}</td>
                  <td className="px-4 py-3">
                    {r.assigned_team_id ? (
                      <span className="text-xs text-forest font-medium truncate max-w-[120px] inline-block">{r.assigned_team_id.team_name}</span>
                    ) : (
                      <select
                        onChange={(e) => { if (e.target.value) handleAssign(r._id, e.target.value); }}
                        className="text-xs input-field py-1.5 px-2 w-32 sm:w-36"
                        defaultValue=""
                      >
                        <option value="">Assign team...</option>
                        {teams.map((t) => <option key={t._id} value={t._id}>{t.team_name}</option>)}
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      {r.status === "pending" && (
                        <button onClick={() => handleStatusChange(r._id, "verified")} title="Verify" className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                          <HiCheck className="text-sm sm:text-base" />
                        </button>
                      )}
                      {["verified", "assigned"].includes(r.status) && (
                        <button onClick={() => handleStatusChange(r._id, "in_progress")} title="In Progress" className="p-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition">
                          <HiTruck className="text-sm sm:text-base" />
                        </button>
                      )}
                      {["in_progress", "assigned"].includes(r.status) && (
                        <button onClick={() => handleStatusChange(r._id, "resolved")} title="Resolve" className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition">
                          <HiCheck className="text-sm sm:text-base" />
                        </button>
                      )}
                      {r.status === "pending" && (
                        <button onClick={() => handleStatusChange(r._id, "rejected")} title="Reject" className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition">
                          <HiX className="text-sm sm:text-base" />
                        </button>
                      )}
                      <button onClick={() => setSelectedReport(r)} title="View" className="p-1.5 rounded-lg bg-warm-100 text-text-secondary hover:bg-warm-200 transition">
                        <HiEye className="text-sm sm:text-base" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {reports.length === 0 && <p className="text-center text-text-muted py-8 text-sm sm:text-base">No reports found</p>}
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in" onClick={() => setSelectedReport(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-bold truncate pr-2">{selectedReport.animal_type}</h2>
              <button onClick={() => setSelectedReport(null)} className="p-1 hover:bg-warm-100 rounded-lg flex-shrink-0"><HiX className="text-lg sm:text-xl" /></button>
            </div>
            {selectedReport.photo_url && <img src={selectedReport.photo_url} alt="" className="w-full h-40 sm:h-52 object-cover rounded-xl mb-3 sm:mb-4" />}
            <p className="text-text-secondary mb-3 sm:mb-4 text-sm sm:text-base">{selectedReport.description}</p>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between"><span className="text-text-muted">Reporter:</span><span className="truncate ml-2">{selectedReport.user_id?.name} ({selectedReport.user_id?.email})</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Phone:</span><span className="truncate ml-2">{selectedReport.user_id?.phone || "N/A"}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Status:</span><StatusBadge status={selectedReport.status} /></div>
              <div className="flex justify-between"><span className="text-text-muted">Priority:</span><PriorityBadge priority={selectedReport.priority} /></div>
              <div className="flex justify-between"><span className="text-text-muted">Location:</span><span className="text-right truncate ml-2">{selectedReport.location?.address || `${selectedReport.location?.lat}, ${selectedReport.location?.lng}`}</span></div>
              <div className="flex justify-between"><span className="text-text-muted">Reported:</span><span className="text-right ml-2">{new Date(selectedReport.reported_at).toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
