import { useState } from "react";
import { Shield, Menu, X, Sparkles, Mic, PhoneCall, ShieldAlert, Clock, Sliders } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ onOpenPreOrder }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-void/80 backdrop-blur-md border-b border-white/10 px-6 md:px-16 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent2 flex items-center justify-center shadow-[0_0_15px_rgba(224,86,253,0.5)] group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            SURAKSHA <span className="text-accent font-light">RING</span>
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-medium text-gray-300">
          <a href="#panic-button-section" className="text-red-400 font-bold hover:text-white transition-colors flex items-center gap-1.5 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/30">
            <ShieldAlert className="w-3.5 h-3.5 animate-pulse" /> Panic SOS
          </a>
          <a href="#voice-sos-console" className="text-accent font-bold hover:text-white transition-colors flex items-center gap-1.5 bg-accent/10 px-3 py-1.5 rounded-full border border-accent/30">
            <Mic className="w-3.5 h-3.5" /> Voice SOS
          </a>
          <a href="#checkin-module" className="text-amber-400 font-bold hover:text-white transition-colors flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" /> Safety Check-In
          </a>
          <a href="#fake-call" className="text-emerald-400 font-bold hover:text-white transition-colors flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30">
            <PhoneCall className="w-3.5 h-3.5" /> Fake Call
          </a>
          <a href="#settings" className="text-gray-300 hover:text-accent font-bold transition-colors flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <Sliders className="w-3.5 h-3.5" /> Settings
          </a>
        </div>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(224,86,253,0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenPreOrder}
            className="flex items-center gap-2 bg-gradient-to-r from-accent2 to-accent text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" /> Reserve Now
          </motion.button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-gray-300 p-2 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden pt-4 pb-6 px-4 bg-surface border-b border-white/10 flex flex-col gap-3 text-center text-sm font-medium text-gray-200"
          >
            <a href="#panic-button-section" className="text-red-400 font-bold" onClick={() => setMobileMenuOpen(false)}>Panic SOS Button</a>
            <a href="#voice-sos-console" className="text-accent font-bold" onClick={() => setMobileMenuOpen(false)}>Live Voice SOS</a>
            <a href="#checkin-module" className="text-amber-400 font-bold" onClick={() => setMobileMenuOpen(false)}>Recurring Safety Check-In</a>
            <a href="#fake-call" className="text-emerald-400 font-bold" onClick={() => setMobileMenuOpen(false)}>Fake Call Console</a>
            <a href="#settings" className="text-gray-300 font-bold" onClick={() => setMobileMenuOpen(false)}>Emergency Settings</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#flow" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPreOrder();
              }}
              className="w-full bg-gradient-to-r from-accent2 to-accent text-white py-3 rounded-full font-bold"
            >
              Reserve Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
