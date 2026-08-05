import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  HiMenu,
  HiX,
  HiHome,
  HiDocumentReport,
  HiCollection,
  HiCalendar,
  HiCurrencyDollar,
  HiChartPie,
  HiLogout,
  HiLogin,
  HiShieldCheck,
} from "react-icons/hi";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: "/", label: "Home", icon: HiHome, public: true },
    { to: "/wildlife-info", label: "Wildlife", icon: HiCollection, public: true },
    { to: "/events", label: "Events", icon: HiCalendar, public: true },
    { to: "/report", label: "Report", icon: HiDocumentReport, auth: true },
    { to: "/my-reports", label: "My Reports", icon: HiDocumentReport, auth: true },
    { to: "/donate", label: "Donate", icon: HiCurrencyDollar, auth: true },
    { to: "/admin", label: "Dashboard", icon: HiChartPie, roles: ["admin"] },
  ];

  const visibleLinks = navLinks.filter((link) => {
    if (link.public) return true;
    if (link.auth && user) return true;
    if (link.roles && user && link.roles.includes(user.role)) return true;
    return false;
  });

  return (
    <nav className="glass-dark sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 group flex-shrink-0">
            <div className="w-7 h-7 sm:w-9 sm:h-9 gradient-amber rounded-md sm:rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <HiShieldCheck className="text-forest-dark text-lg sm:text-xl" />
            </div>
            <span className="text-white font-bold text-base sm:text-lg tracking-tight whitespace-nowrap">
              Wild<span className="text-amber">Shield</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {visibleLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? "bg-white/20 text-amber"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <link.icon className="text-base" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-white text-sm font-medium leading-tight">
                    {user.name}
                  </p>
                  <p className="text-white/60 text-xs capitalize">{user.role.replace("_", " ")}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition text-sm"
                >
                  <HiLogout />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-amber text-sm py-1.5 px-4">
                  <HiLogin />
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden glass-dark border-t border-white/10 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {visibleLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive(link.to)
                    ? "bg-white/20 text-amber"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <link.icon />
                {link.label}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-2 mt-2">
              {user ? (
                <>
                  <p className="text-white/60 text-xs px-3 mb-1">
                    Signed in as <span className="text-white">{user.name}</span>
                  </p>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-red-300 hover:bg-white/10 text-sm w-full"
                  >
                    <HiLogout />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-amber hover:bg-white/10 text-sm font-semibold"
                >
                  <HiLogin />
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
