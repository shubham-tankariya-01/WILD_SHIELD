import { useState, useEffect } from "react";
import { getMyReports, deleteReport } from "../api/reportApi";
import { createFeedback } from "../api/feedbackApi";
import { StatusBadge, PriorityBadge } from "../components/common/StatusBadge";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import { HiTrash, HiEye, HiX, HiStar, HiDocumentReport } from "react-icons/hi";

export default function MyReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({ message: "", rating: 5 });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const fetchReports = async () => {
    try {
      const res = await getMyReports();
      setReports(res.data);
    } catch {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this report?")) return;
    try {
      await deleteReport(id);
      toast.success("Report deleted");
      fetchReports();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const handleFeedback = async (reportId) => {
    if (!feedbackForm.message) { toast.error("Please write a message"); return; }
    setSubmittingFeedback(true);
    try {
      await createFeedback({ report_id: reportId, ...feedbackForm });
      toast.success("Feedback submitted!");
      setFeedbackForm({ message: "", rating: 5 });
      setSelectedReport(null);
    } catch {
      toast.error("Failed to submit feedback");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading your reports..." />;

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-6 sm:py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">My Reports</h1>
          <p className="text-text-secondary mt-1 text-sm sm:text-base">{reports.length} report{reports.length !== 1 ? "s" : ""} submitted</p>
        </div>
      </div>

      {reports.length === 0 ? (
        <div className="glass-card rounded-2xl p-6 sm:p-12 text-center">
          <HiDocumentReport className="text-4xl sm:text-5xl text-text-muted mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-bold text-text-primary mb-2">No reports yet</h3>
          <p className="text-sm sm:text-base text-text-secondary mb-4">Start by reporting a wildlife sighting</p>
          <a href="/report" className="btn-primary py-2.5 px-6 rounded-xl text-sm sm:text-base">Report a Sighting</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {reports.map((r) => (
            <div key={r._id} className="bg-white rounded-2xl shadow-sm overflow-hidden card-hover">
              {r.photo_url && (
                <div className="h-40 sm:h-44 overflow-hidden bg-warm-100">
                  <img src={r.photo_url} alt={r.animal_type} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between mb-2 gap-2">
                  <h3 className="font-bold text-base sm:text-lg text-text-primary truncate">{r.animal_type}</h3>
                  <div className="flex-shrink-0"><PriorityBadge priority={r.priority} /></div>
                </div>
                <p className="text-text-secondary text-xs sm:text-sm mb-3 line-clamp-2">{r.description}</p>
                <div className="flex items-center gap-2 mb-3">
                  <StatusBadge status={r.status} />
                  <span className="text-[10px] sm:text-xs text-text-muted">
                    {new Date(r.reported_at).toLocaleDateString()}
                  </span>
                </div>
                {r.location?.address && (
                  <p className="text-[10px] sm:text-xs text-text-muted mb-3 truncate">📍 {r.location.address}</p>
                )}
                {r.assigned_team_id && (
                  <p className="text-[10px] sm:text-xs text-forest bg-forest-50 px-2 py-1 rounded-lg mb-3 truncate">
                    🚑 {r.assigned_team_id.team_name}
                  </p>
                )}
                <div className="flex gap-2 mt-auto">
                  <button onClick={() => setSelectedReport(r)} className="flex-1 btn-secondary text-xs sm:text-sm py-1.5 sm:py-2 justify-center rounded-lg">
                    <HiEye className="flex-shrink-0" /> Details
                  </button>
                  {r.status === "pending" && (
                    <button onClick={() => handleDelete(r._id)} className="p-1.5 sm:p-2 rounded-lg text-red-400 hover:bg-red-50 transition">
                      <HiTrash className="text-base sm:text-lg" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold truncate pr-2">{selectedReport.animal_type}</h2>
                <button onClick={() => setSelectedReport(null)} className="p-1 hover:bg-warm-100 rounded-lg flex-shrink-0">
                  <HiX className="text-lg sm:text-xl" />
                </button>
              </div>
              {selectedReport.photo_url && (
                <img src={selectedReport.photo_url} alt="" className="w-full h-40 sm:h-52 object-cover rounded-xl mb-4" />
              )}
              <p className="text-text-secondary mb-4 text-sm sm:text-base">{selectedReport.description}</p>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between"><span className="text-text-muted">Status:</span> <StatusBadge status={selectedReport.status} /></div>
                <div className="flex justify-between"><span className="text-text-muted">Priority:</span> <PriorityBadge priority={selectedReport.priority} /></div>
                <div className="flex justify-between"><span className="text-text-muted">Reported:</span> <span>{new Date(selectedReport.reported_at).toLocaleString()}</span></div>
                {selectedReport.location?.address && <div className="flex justify-between"><span className="text-text-muted">Location:</span> <span className="text-right ml-2">{selectedReport.location.address}</span></div>}
                {selectedReport.assigned_team_id && <div className="flex justify-between"><span className="text-text-muted">Team:</span> <span className="text-forest font-medium text-right ml-2">{selectedReport.assigned_team_id.team_name}</span></div>}
                {selectedReport.resolved_at && <div className="flex justify-between"><span className="text-text-muted">Resolved:</span> <span className="text-right ml-2">{new Date(selectedReport.resolved_at).toLocaleString()}</span></div>}
              </div>

              {/* Status Timeline */}
              <div className="mt-5 sm:mt-6">
                <h3 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3">Status Timeline</h3>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {["pending", "verified", "assigned", "in_progress", "resolved"].map((s, i) => {
                    const statuses = ["pending", "verified", "assigned", "in_progress", "resolved"];
                    const currentIdx = statuses.indexOf(selectedReport.status);
                    const reached = i <= currentIdx && selectedReport.status !== "rejected";
                    return (
                      <div key={s} className="flex items-center flex-1">
                        <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${reached ? "bg-forest" : "bg-warm-200"}`} />
                        {i < 4 && <div className={`h-0.5 flex-1 ${i < currentIdx ? "bg-forest" : "bg-warm-200"}`} />}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-[8px] sm:text-[10px] text-text-muted mt-1 w-full text-center">
                  <span className="w-1/5 text-left">Pend</span><span className="w-1/5">Verif</span><span className="w-1/5">Assign</span><span className="w-1/5">Active</span><span className="w-1/5 text-right">Done</span>
                </div>
              </div>

              {/* Feedback form for resolved reports */}
              {selectedReport.status === "resolved" && (
                <div className="mt-5 sm:mt-6 border-t border-warm-100 pt-4">
                  <h3 className="font-semibold text-xs sm:text-sm mb-2 sm:mb-3">Leave Feedback</h3>
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}>
                        <HiStar className={`text-lg sm:text-xl ${star <= feedbackForm.rating ? "text-amber" : "text-warm-200"}`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={feedbackForm.message}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                    className="input-field mb-3 min-h-[60px] sm:min-h-[80px] text-sm sm:text-base"
                    placeholder="How was the rescue experience?"
                  />
                  <button
                    onClick={() => handleFeedback(selectedReport._id)}
                    disabled={submittingFeedback}
                    className="btn-primary py-2 px-4 sm:px-6 rounded-lg text-xs sm:text-sm w-full sm:w-auto"
                  >
                    {submittingFeedback ? "Submitting..." : "Submit Feedback"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
