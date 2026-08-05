import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { HiMail, HiLockClosed, HiShieldCheck } from "react-icons/hi";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const userData = await login(form.email, form.password);
      toast.success(`Welcome back, ${userData.name}!`);
      navigate(userData.role === "admin" ? "/admin" : "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (e) => {
    const role = e.target.value;
    if (!role) return;
    
    let email = "";
    let password = "";
    
    if (role === "admin") {
      email = "admin@wildshield.com";
      password = "admin123";
    } else if (role === "citizen") {
      email = "citizen1@wildshield.com"; // using the citizen1 email from extended seed
      password = "citizen123";
    } else if (role === "volunteer") {
      email = "volunteer1@wildshield.com"; // using volunteer1 email from extended seed
      password = "volunteer123";
    }

    setLoading(true);
    try {
      const userData = await login(email, password);
      toast.success(`Welcome back, ${userData.name}!`);
      navigate(userData.role === "admin" ? "/admin" : "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
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
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary">Welcome Back</h1>
          <p className="text-text-secondary mt-1 text-sm sm:text-base">Sign in to Wild Shield</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-5 sm:p-8 space-y-4 sm:space-y-5">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-text-primary mb-1.5">
              Email
            </label>
            <div className="relative">
              <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-field pl-9 sm:pl-10 text-sm sm:text-base"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-text-primary mb-1.5">
              Password
            </label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input-field pl-9 sm:pl-10 text-sm sm:text-base"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center py-2.5 sm:py-3 rounded-xl text-sm sm:text-base disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-xs sm:text-sm text-text-secondary">
            Don't have an account?{" "}
            <Link to="/register" className="text-forest font-semibold hover:underline">
              Register
            </Link>
          </p>
        </form>

        {/* Demo Login Dropdown */}
        <div className="mt-4 glass-card rounded-xl p-4 sm:p-5 border border-forest/20 text-center">
          <p className="text-xs sm:text-sm font-semibold text-text-primary mb-2 sm:mb-3">Quick Access (Demo)</p>
          <select 
            onChange={handleDemoLogin} 
            disabled={loading}
            className="input-field w-full cursor-pointer bg-forest-50 border-forest/30 text-forest-dark font-medium text-xs sm:text-sm"
            defaultValue=""
          >
            <option value="" disabled>Select a demo user to auto-login...</option>
            <option value="admin">Login as Admin</option>
            <option value="citizen">Login as Citizen</option>
            <option value="volunteer">Login as Volunteer</option>
          </select>
        </div>
      </div>
    </div>
  );
}
