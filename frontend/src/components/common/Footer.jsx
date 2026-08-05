import { Link } from "react-router-dom";
import { HiShieldCheck, HiMail, HiPhone, HiHeart } from "react-icons/hi";

export default function Footer() {
  return (
    <footer className="gradient-forest text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
              <div className="w-8 h-8 gradient-amber rounded-lg flex items-center justify-center flex-shrink-0">
                <HiShieldCheck className="text-forest-dark" />
              </div>
              <span className="font-bold text-lg">
                Wild<span className="text-amber">Shield</span>
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs mx-auto sm:mx-0">
              Protecting wildlife, one report at a time. Join our mission to
              create a safer world for all living creatures.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-amber mb-3">Quick Links</h3>
            <div className="space-y-2 flex flex-col items-center sm:items-start">
              {[
                { to: "/wildlife-info", label: "Wildlife Database" },
                { to: "/events", label: "Conservation Events" },
                { to: "/report", label: "Report a Sighting" },
                { to: "/donate", label: "Support Us" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-white/70 hover:text-amber text-sm transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="text-center sm:text-left col-span-1 sm:col-span-2 md:col-span-1 mt-2 sm:mt-0">
            <h3 className="font-semibold text-amber mb-3">Contact</h3>
            <div className="space-y-2 flex flex-col items-center sm:items-start">
              <a
                href="mailto:help@wildshield.com"
                className="flex items-center justify-center sm:justify-start gap-2 text-white/70 hover:text-white text-sm transition break-words"
              >
                <HiMail className="flex-shrink-0" /> help@wildshield.com
              </a>
              <a
                href="tel:+911800WILD"
                className="flex items-center justify-center sm:justify-start gap-2 text-white/70 hover:text-white text-sm transition"
              >
                <HiPhone className="flex-shrink-0" /> 1800-WILD-HELP
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-white/50 text-xs">
            © {new Date().getFullYear()} WildShield. All rights reserved.
          </p>
          <p className="text-white/50 text-xs flex items-center gap-1">
            Made with <HiHeart className="text-red-400" /> for wildlife conservation
          </p>
        </div>
      </div>
    </footer>
  );
}
