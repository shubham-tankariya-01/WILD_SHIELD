import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { HiUser, HiMail, HiLockClosed, HiPhone, HiShieldCheck } from "react-icons/hi";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "", phone: "", role: "citizen",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        role: form.role,
      });
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-2 sm:px-4 py-8 sm:py-12 animate-fade-in">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-14 sm:h-14 gradient-forest rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <HiShieldCheck className="text-amber text-xl sm:text-2xl" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Create Account</h1>
          <p className="text-text-secondary mt-1 text-sm sm:text-base">Join Wild Shield today</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-5 sm:p-8 space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-text-primary mb-1.5">Full Name *</label>
            <div className="relative">
              <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field pl-9 sm:pl-10 text-sm sm:text-base" placeholder="Your full name" />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-text-primary mb-1.5">Email *</label>
            <div className="relative">
              <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field pl-9 sm:pl-10 text-sm sm:text-base" placeholder="you@example.com" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-text-primary mb-1.5">Password *</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field pl-9 sm:pl-10 text-sm sm:text-base" placeholder="Min 6 chars" />
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-text-primary mb-1.5">Confirm *</label>
              <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="input-field text-sm sm:text-base" placeholder="Re-enter" />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-text-primary mb-1.5">Phone</label>
            <div className="relative">
              <HiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field pl-9 sm:pl-10 text-sm sm:text-base" placeholder="Optional" />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-text-primary mb-1.5">I am a</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="input-field text-sm sm:text-base">
              <option value="citizen">Citizen</option>
              <option value="volunteer">Volunteer</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5 sm:py-3 rounded-xl text-sm sm:text-base disabled:opacity-50">
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-xs sm:text-sm text-text-secondary">
            Already have an account?{" "}
            <Link to="/login" className="text-forest font-semibold hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
