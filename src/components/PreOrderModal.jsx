import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ShieldCheck, Sparkles, CreditCard, Gift } from "lucide-react";

export default function PreOrderModal({ isOpen, onClose }) {
  const [size, setSize] = useState("7");
  const [finish, setFinish] = useState("Rose Gold");
  const [subsidyApplied, setSubsidyApplied] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });

  const finishes = [
    { name: "Rose Gold", color: "bg-rose-400" },
    { name: "Obsidian Black", color: "bg-neutral-800" },
    { name: "Starlight Silver", color: "bg-slate-300" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-xl bg-surface border border-accent/30 rounded-3xl p-6 md:p-8 shadow-2xl text-white max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-extrabold text-white mb-2">Reservation Confirmed!</h3>
              <p className="text-gray-300 text-sm max-w-md mx-auto mb-6">
                Thank you, {formData.name || "Guardian"}! Your priority pre-order slot for the Suraksha Ring ({finish}, Size {size}) has been locked in.
              </p>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-left mb-6 font-mono text-gray-300">
                <div>Order Ref: #SUR-{Math.floor(100000 + Math.random() * 900000)}</div>
                <div>Govt Subsidy: Applied (₹750 Off)</div>
                <div>Estimated Delivery: Early Dispatch Batch</div>
              </div>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="bg-gradient-to-r from-accent2 to-accent text-white px-8 py-3 rounded-full font-bold text-sm"
              >
                Close & Return to Site
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest mb-2">
                <Sparkles className="w-4 h-4" /> Priority Early Reservation
              </div>
              <h3 className="text-2xl md:text-3xl font-black mb-2">Reserve Your Suraksha Ring</h3>
              <p className="text-gray-400 text-xs md:text-sm mb-6">
                Lock in ₹750 Government Safety Subsidy discount & free magnetic charger.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Finish Selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2">Select Finish</label>
                  <div className="grid grid-cols-3 gap-3">
                    {finishes.map((f) => (
                      <button
                        key={f.name}
                        type="button"
                        onClick={() => setFinish(f.name)}
                        className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
                          finish === f.name
                            ? "border-accent bg-accent/10 text-white"
                            : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full ${f.color}`} />
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ring Size Selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-2">Select US Ring Size</label>
                  <div className="flex gap-2">
                    {["5", "6", "7", "8", "9", "10"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={`flex-1 py-2.5 rounded-xl border text-xs font-bold ${
                          size === s
                            ? "border-accent bg-accent text-white"
                            : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Full Name</label>
                    <input
                      required
                      type="text"
                      placeholder="Ananya Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-void border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">Phone Number</label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-void border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Email Address</label>
                  <input
                    required
                    type="email"
                    placeholder="ananya@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-void border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:border-accent focus:outline-none"
                  />
                </div>

                {/* Price Breakdown */}
                <div className="bg-void/80 border border-white/10 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex justify-between text-gray-400">
                    <span>Retail Price:</span>
                    <span className="line-through">₹2,999</span>
                  </div>
                  {subsidyApplied && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span className="flex items-center gap-1"><Gift className="w-3.5 h-3.5" /> Govt. Safety Scheme Subsidy:</span>
                      <span>- ₹750</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white font-extrabold text-sm border-t border-white/10 pt-2">
                    <span>Reserve Today (Pay Later):</span>
                    <span className="text-accent">₹2,249</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-gradient-to-r from-accent2 to-accent text-white font-bold text-sm shadow-[0_0_25px_rgba(224,86,253,0.5)] flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" /> Confirm Free Reservation Slot
                </button>

                <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> No upfront payment needed. Pay on delivery.
                </p>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
