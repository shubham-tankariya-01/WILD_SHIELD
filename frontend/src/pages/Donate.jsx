import { useState, useEffect } from "react";
import { createDonation, getMyDonations } from "../api/donationApi";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import { HiCurrencyDollar, HiHeart, HiCheck, HiShieldCheck } from "react-icons/hi";

const presetAmounts = [100, 500, 1000, 2500, 5000, 10000];

export default function Donate() {
  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [purpose, setPurpose] = useState("general");
  const [loading, setLoading] = useState(false);
  const [donations, setDonations] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    getMyDonations().then((res) => setDonations(res.data)).catch(() => {}).finally(() => setLoadingHistory(false));
  }, []);

  const handleDonate = async (e) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    if (!finalAmount || finalAmount <= 0) { toast.error("Enter a valid amount"); return; }
    setLoading(true);
    try {
      await createDonation({ amount: finalAmount, purpose });
      setShowSuccess(true);
      setCustomAmount("");
      const res = await getMyDonations();
      setDonations(res.data);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Donation failed");
    } finally {
      setLoading(false);
    }
  };

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-6 sm:py-8 animate-fade-in">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Support Wildlife Conservation</h1>
        <p className="text-text-secondary mt-1 sm:mt-2 text-sm sm:text-base">Every contribution helps protect and rescue wildlife</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
        {/* Donation Form */}
        <div className="lg:col-span-3">
          <div className="glass-card rounded-2xl p-4 sm:p-8">
            {showSuccess ? (
              <div className="text-center py-8 sm:py-12 animate-scale-in">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiCheck className="text-3xl sm:text-4xl text-green-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-2">Thank You!</h2>
                <p className="text-text-secondary text-sm sm:text-base">Your donation has been received. Every rupee counts!</p>
              </div>
            ) : (
              <form onSubmit={handleDonate} className="space-y-5 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-text-primary mb-2 sm:mb-3">Select Amount (₹)</label>
                  <div className="grid grid-cols-2 xs:grid-cols-3 gap-2">
                    {presetAmounts.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => { setAmount(a); setCustomAmount(""); }}
                        className={`py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-lg transition ${
                          amount === a && !customAmount
                            ? "gradient-forest text-white shadow-md"
                            : "bg-warm-100 text-text-primary hover:bg-warm-200"
                        }`}
                      >
                        ₹{a.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-text-primary mb-1 sm:mb-1.5">Or enter custom amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted font-bold">₹</span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="input-field pl-7 sm:pl-8 text-base sm:text-lg font-semibold"
                      placeholder="0"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-text-primary mb-1 sm:mb-1.5">Donation Purpose</label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { value: "rescue", label: "🚑 Rescue Operations", desc: "Fund animal rescue missions" },
                      { value: "conservation", label: "🌿 Conservation", desc: "Protect habitats" },
                      { value: "general", label: "💚 General Fund", desc: "Where needed most" },
                    ].map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setPurpose(p.value)}
                        className={`flex-1 min-w-[100px] sm:min-w-[120px] p-2.5 sm:p-3 rounded-xl text-left transition ${
                          purpose === p.value
                            ? "bg-forest-50 border-2 border-forest text-forest"
                            : "bg-warm-bg border-2 border-warm-200 hover:border-warm-200"
                        }`}
                      >
                        <p className="font-semibold text-xs sm:text-sm truncate">{p.label}</p>
                        <p className="text-[10px] sm:text-xs text-text-muted mt-0.5 truncate">{p.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-amber w-full justify-center py-3 sm:py-3.5 rounded-xl text-base sm:text-lg font-bold disabled:opacity-50">
                  <HiHeart className="flex-shrink-0" /> {loading ? "Processing..." : `Donate ₹${(customAmount || amount).toLocaleString()}`}
                </button>

                <p className="text-center text-[10px] sm:text-xs text-text-muted flex items-center justify-center gap-1">
                  <HiShieldCheck className="text-forest flex-shrink-0" /> Secure mock payment — no real charges
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Donation History */}
        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl p-4 sm:p-6 mb-4">
            <h3 className="font-bold text-text-primary mb-1 text-sm sm:text-base">Your Impact</h3>
            <p className="text-2xl sm:text-3xl font-black text-forest">₹{totalDonated.toLocaleString()}</p>
            <p className="text-text-muted text-xs sm:text-sm">{donations.length} donation{donations.length !== 1 ? "s" : ""} made</p>
          </div>

          <div className="glass-card rounded-2xl p-4 sm:p-6">
            <h3 className="font-bold text-text-primary mb-4">Donation History</h3>
            {loadingHistory ? (
              <LoadingSpinner size="sm" />
            ) : donations.length === 0 ? (
              <p className="text-text-muted text-sm text-center py-4">No donations yet</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {donations.map((d) => (
                  <div key={d._id} className="flex items-center justify-between p-3 bg-warm-bg rounded-xl">
                    <div>
                      <p className="font-bold text-forest">₹{d.amount.toLocaleString()}</p>
                      <p className="text-xs text-text-muted capitalize">{d.purpose} • {new Date(d.donated_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      d.payment_status === "success" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {d.payment_status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
