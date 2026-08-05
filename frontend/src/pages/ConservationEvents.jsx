import { useState, useEffect } from "react";
import { getActivities, joinActivity, leaveActivity } from "../api/activityApi";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import { HiCalendar, HiLocationMarker, HiUserGroup, HiCheck, HiPlus } from "react-icons/hi";

export default function ConservationEvents() {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const res = await getActivities();
      setActivities(res.data);
    } catch { toast.error("Failed to load activities"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchActivities(); }, []);

  const handleJoin = async (id) => {
    if (!user) { toast.error("Please login to join"); return; }
    try { await joinActivity(id); toast.success("Joined!"); fetchActivities(); }
    catch (err) { toast.error(err.response?.data?.message || "Failed to join"); }
  };

  const handleLeave = async (id) => {
    try { await leaveActivity(id); toast.success("Left the activity"); fetchActivities(); }
    catch (err) { toast.error(err.response?.data?.message || "Failed to leave"); }
  };

  const now = new Date();
  const upcoming = activities.filter((a) => new Date(a.date) >= now);
  const past = activities.filter((a) => new Date(a.date) < now);

  if (loading) return <LoadingSpinner text="Loading events..." />;

  const EventCard = ({ activity, isPast }) => {
    const isJoined = user && activity.participants.some((p) => (p._id || p) === user._id);
    const isFull = activity.participants.length >= activity.volunteer_slots;
    const slotsLeft = activity.volunteer_slots - activity.participants.length;

    return (
      <div className={`bg-white rounded-2xl shadow-sm overflow-hidden card-hover ${isPast ? "opacity-75" : ""}`}>
        <div className="gradient-forest p-4 text-white">
          <p className="text-amber font-bold text-lg">
            {new Date(activity.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
          <h3 className="font-bold text-xl mt-1">{activity.title}</h3>
        </div>
        <div className="p-5">
          <p className="text-text-secondary text-sm mb-4 leading-relaxed">{activity.description}</p>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex items-center gap-2 text-text-muted">
              <HiLocationMarker className="text-forest" /> {activity.location}
            </div>
            <div className="flex items-center gap-2 text-text-muted">
              <HiUserGroup className="text-forest" />
              {activity.participants.length} / {activity.volunteer_slots} volunteers
              {!isPast && slotsLeft > 0 && <span className="text-forest font-medium">({slotsLeft} slots left)</span>}
            </div>
            {activity.organizer && (
              <div className="flex items-center gap-2 text-text-muted">
                <HiCalendar className="text-forest" /> {activity.organizer}
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-warm-100 rounded-full h-2 mb-4">
            <div
              className="gradient-forest h-2 rounded-full transition-all"
              style={{ width: `${(activity.participants.length / activity.volunteer_slots) * 100}%` }}
            />
          </div>

          {!isPast && user && (
            isJoined ? (
              <button onClick={() => handleLeave(activity._id)} className="btn-secondary w-full justify-center py-2.5 rounded-xl text-sm">
                <HiCheck /> Joined — Leave?
              </button>
            ) : (
              <button
                onClick={() => handleJoin(activity._id)}
                disabled={isFull}
                className={`w-full justify-center py-2.5 rounded-xl text-sm ${isFull ? "bg-warm-200 text-text-muted cursor-not-allowed" : "btn-primary"}`}
              >
                {isFull ? "Full" : <><HiPlus /> Join Event</>}
              </button>
            )
          )}
          {!user && !isPast && (
            <a href="/login" className="btn-primary w-full justify-center py-2.5 rounded-xl text-sm inline-flex">Login to Join</a>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-6 sm:py-8 animate-fade-in">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Conservation Events</h1>
        <p className="text-text-secondary mt-1 sm:mt-2 text-sm sm:text-base">Join conservation activities and make an impact</p>
      </div>

      {upcoming.length > 0 && (
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-4 sm:mb-6 border-b border-warm-200 pb-2">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {upcoming.map((a) => <EventCard key={a._id} activity={a} isPast={false} />)}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-4 sm:mb-6 border-b border-warm-200 pb-2 text-text-muted">Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {past.map((a) => <EventCard key={a._id} activity={a} isPast={true} />)}
          </div>
        </section>
      )}

      {activities.length === 0 && (
        <div className="text-center py-12 glass-card rounded-2xl">
          <HiCalendar className="text-4xl sm:text-5xl text-text-muted mx-auto mb-3 sm:mb-4" />
          <p className="text-text-secondary text-sm sm:text-base">No conservation events scheduled at the moment.</p>
        </div>
      )}
    </div>
  );
}
