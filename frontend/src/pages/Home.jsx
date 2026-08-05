import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getAnimals } from "../api/animalApi";
import { getActivities } from "../api/activityApi";
import {
  HiShieldCheck,
  HiDocumentReport,
  HiCollection,
  HiCalendar,
  HiCurrencyDollar,
  HiArrowRight,
  HiLocationMarker,
  HiUserGroup,
} from "react-icons/hi";

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ animals: 0, activities: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [animalsRes, activitiesRes] = await Promise.all([
          getAnimals(),
          getActivities(),
        ]);
        setStats({
          animals: animalsRes.data.length,
          activities: activitiesRes.data.length,
        });
      } catch {
        // Stats are non-critical
      }
    };
    loadStats();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images.jpeg')" }}
      >
        {/* Dark elegant overlay to match the theme */}
        <div className="absolute inset-0 bg-forest-dark/80 backdrop-blur-[2px]"></div>
        
        {/* Subtle glowing orbs */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-amber/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-forest-light/40 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-28 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 sm:px-4 py-1.5 mb-6 backdrop-blur-sm border border-white/10 max-w-full overflow-hidden">
              <HiShieldCheck className="text-amber flex-shrink-0" />
              <span className="text-white/80 text-xs sm:text-sm font-medium truncate">
                Wildlife Conservation & Rescue Portal
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-white mb-4 sm:mb-6 leading-tight">
              Protect Wildlife.
              <br />
              <span className="text-amber">Save Lives.</span>
            </h1>
            <p className="text-white/70 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed px-2">
              Report injured animals, track rescue operations, and join
              conservation efforts. Together, we can make a difference for
              every living creature.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full px-4 sm:px-0">
              <Link
                to={user ? "/report" : "/register"}
                className="btn-amber w-full sm:w-auto justify-center text-sm sm:text-base py-3 px-6 sm:px-8 rounded-xl shadow-lg"
              >
                <HiDocumentReport className="text-lg sm:text-xl flex-shrink-0" />
                Report a Sighting
              </Link>
              <Link
                to="/wildlife-info"
                className="flex items-center justify-center w-full sm:w-auto gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 sm:px-8 rounded-xl transition border border-white/20 text-sm sm:text-base"
              >
                <HiCollection className="flex-shrink-0" />
                Explore Wildlife
              </Link>
            </div>
          </div>
        </div>
        {/* Wave divider */}
        <div className="absolute bottom-0 w-full leading-[0]">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path
              d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,45 L1440,80 L0,80 Z"
              fill="#F7F5F0"
            />
          </svg>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-10 mb-12 sm:mb-16">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { value: stats.animals + "+", label: "Species Documented", icon: "🐾" },
            { value: "24/7", label: "Rescue Support", icon: "🚑" },
            { value: stats.activities, label: "Conservation Events", icon: "🌿" },
            { value: "100%", label: "Transparent Tracking", icon: "📊" },
          ].map((stat, i) => (
            <div
              key={i}
              className="glass-card rounded-xl p-5 text-center card-hover"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="text-2xl mb-1 block">{stat.icon}</span>
              <p className="text-2xl font-bold text-forest">{stat.value}</p>
              <p className="text-text-muted text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-text-primary mb-3">
            How It Works
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            From sighting to rescue — a transparent, trackable process
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              title: "Report Sighting",
              desc: "Spot an injured animal? Submit a report with photo and location in under 60 seconds.",
              icon: HiDocumentReport,
              color: "from-blue-400 to-blue-600",
            },
            {
              step: "02",
              title: "Admin Verifies",
              desc: "Our team verifies the report and assigns the nearest available rescue team.",
              icon: HiShieldCheck,
              color: "from-amber to-amber-dark",
            },
            {
              step: "03",
              title: "Rescue Deployed",
              desc: "The assigned team responds, and you can track the rescue status in real-time.",
              icon: HiLocationMarker,
              color: "from-forest-light to-forest",
            },
            {
              step: "04",
              title: "Case Resolved",
              desc: "Once rescued, the case is marked resolved. You can provide feedback on the process.",
              icon: HiUserGroup,
              color: "from-green-400 to-green-600",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm card-hover relative overflow-hidden group"
            >
              <div
                className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 text-white shadow-md group-hover:scale-110 transition-transform`}
              >
                <item.icon className="text-xl" />
              </div>
              <span className="text-5xl font-black text-forest-50 absolute top-3 right-4">
                {item.step}
              </span>
              <h3 className="font-bold text-lg mb-2 text-text-primary">
                {item.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="gradient-forest rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber/10 rounded-full blur-3xl" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">
            Ready to Make a Difference?
          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto relative z-10">
            Join thousands of wildlife protectors. Every report, every
            donation, every volunteer hour counts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
            <Link
              to="/events"
              className="btn-amber text-base py-3 px-8 rounded-xl"
            >
              <HiCalendar className="text-xl" />
              Join an Event
            </Link>
            <Link
              to="/donate"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-xl transition border border-white/20"
            >
              <HiCurrencyDollar />
              Donate Now
              <HiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
