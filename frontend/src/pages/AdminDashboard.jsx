import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getStats } from "../api/adminApi";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { HiDocumentReport, HiUserGroup, HiCurrencyDollar, HiShieldCheck, HiCollection, HiClipboardList } from "react-icons/hi";

const STATUS_COLORS = { pending: "#9E9E9E", verified: "#42A5F5", assigned: "#FFA726", in_progress: "#FF7043", resolved: "#66BB6A", rejected: "#EF5350" };
const MONTH_NAMES = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then((res) => setStats(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;
  if (!stats) return <p className="text-center py-12 text-text-secondary">Failed to load stats</p>;

  const pieData = stats.reports_by_status?.map((s) => ({
    name: s._id?.replace("_", " ") || "unknown",
    value: s.count,
    color: STATUS_COLORS[s._id] || "#999",
  })) || [];

  const barData = stats.reports_by_month?.map((m) => ({
    month: `${MONTH_NAMES[m._id.month]} ${m._id.year}`,
    reports: m.count,
  })) || [];

  const statCards = [
    { label: "Total Reports", value: stats.total_reports, icon: HiDocumentReport, color: "from-blue-400 to-blue-600" },
    { label: "Pending", value: stats.pending_reports, icon: HiClipboardList, color: "from-amber to-amber-dark" },
    { label: "Resolved", value: `${stats.resolution_rate}`, icon: HiShieldCheck, color: "from-green-400 to-green-600" },
    { label: "Active Teams", value: stats.active_rescue_teams, icon: HiUserGroup, color: "from-forest-light to-forest" },
    { label: "Total Donations", value: `₹${stats.total_donations?.toLocaleString()}`, icon: HiCurrencyDollar, color: "from-purple-400 to-purple-600" },
    { label: "Species Documented", value: stats.total_animals, icon: HiCollection, color: "from-orange-400 to-orange-600" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Admin Dashboard</h1>
          <p className="text-text-secondary mt-1 text-sm sm:text-base">Wild Shield platform overview</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/admin/reports" className="btn-primary py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm">Manage Reports</Link>
          <Link to="/admin/animals" className="btn-secondary py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-sm">Manage Animals</Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl p-3 sm:p-5 shadow-sm card-hover flex flex-col justify-between">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center text-white mb-2 sm:mb-3`}>
              <card.icon className="text-base sm:text-lg" />
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-bold text-text-primary truncate">{card.value}</p>
              <p className="text-[10px] sm:text-xs text-text-muted mt-0.5 leading-tight">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Pie Chart — Reports by Status */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
          <h3 className="font-bold text-text-primary mb-3 sm:mb-4 text-sm sm:text-base">Reports by Status</h3>
          {pieData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {pieData.map((entry, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
                    <span className="capitalize text-text-secondary">{entry.name} ({entry.value})</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <p className="text-text-muted text-sm text-center py-8">No data yet</p>}
        </div>

        {/* Bar Chart — Reports by Month */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-text-primary mb-4">Reports Over Time</h3>
          {barData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5DFD3" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="reports" fill="#4A7C59" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : <p className="text-text-muted text-sm text-center py-8">No data yet</p>}
        </div>
      </div>
    </div>
  );
}
