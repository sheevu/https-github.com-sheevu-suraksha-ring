import { motion } from "framer-motion";
import { Mic, ShieldCheck, ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import CircuitBackground from "./CircuitBackground";

export default function Hero({ onOpenPreOrder, onOpenVideoModal }) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-void flex items-center px-6 md:px-16 pt-24 pb-16">
      <CircuitBackground />

      <div className="absolute w-[400px] h-[400px] bg-accent2/30 rounded-full blur-[100px] -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] bg-accent/20 rounded-full blur-[100px] bottom-0 right-10 pointer-events-none" />

      <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="flex items-center gap-2 text-accent text-sm font-semibold tracking-widest uppercase mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="w-6 h-px bg-gradient-to-r from-accent2 to-accent" />
            <Sparkles className="w-4 h-4 text-accent" /> Next-Gen AI Wearables for Security
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 bg-gradient-to-br from-white via-accent to-accent2 bg-clip-text text-transparent">
            Suraksha Ring:<br /> Voice-Activated Safety
          </h1>

          <p className="text-lg text-gray-300 max-w-md mb-8 leading-relaxed">
            A discreet, voice-activated smart ring that senses danger and acts in seconds — alerting loved ones, broadcasting live GPS, and notifying emergency authorities, completely hands-free.
          </p>

          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 35px rgba(224,86,253,0.6)" }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenPreOrder}
              className="group flex items-center gap-2 bg-gradient-to-r from-accent2 to-accent px-7 py-3.5 rounded-full font-bold text-white shadow-[0_0_25px_rgba(224,86,253,0.4)]"
            >
              Pre-order the Ring
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, borderColor: "#e056fd" }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenVideoModal}
              className="flex items-center gap-2 border border-white/20 hover:border-accent/50 px-7 py-3.5 rounded-full font-semibold text-gray-200 backdrop-blur-sm bg-white/5 transition-colors"
            >
              <PlayCircle className="w-5 h-5 text-accent" />
              See How It Works
            </motion.button>
          </div>

          <div className="flex flex-wrap gap-6 mt-8 text-sm text-gray-400">
            {["Voice activated", "Govt. subsidy ₹750", "SOS in under 8s"].map((t) => (
              <span key={t} className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 text-xs font-medium text-gray-300">
                <ShieldCheck className="w-4 h-4 text-accent" /> {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Animated ring visual with 3D feel */}
        <motion.div
          className="relative flex justify-center items-center h-[420px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {/* Animated pulse rings */}
          <motion.div
            className="absolute w-64 h-64 rounded-full border border-accent/30"
            animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-80 h-80 rounded-full border border-accent2/20"
            animate={{ scale: [1, 1.45, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.6 }}
          />
          <motion.div
            className="absolute w-96 h-96 rounded-full border border-indigo-500/10"
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.2 }}
          />

          {/* Central Ring Emblem */}
          <motion.div
            className="relative w-44 h-44 rounded-full bg-gradient-to-br from-accent via-accent2 to-purple-900 shadow-[0_0_90px_rgba(224,86,253,0.7)] flex flex-col items-center justify-center animate-floaty border-4 border-white/20"
          >
            <div className="absolute inset-2 rounded-full border border-white/30 border-dashed animate-[spin_20s_linear_infinite]" />
            <Mic className="w-12 h-12 text-white drop-shadow-md mb-1" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/90">SURAKSHA</span>
          </motion.div>

          {/* Floating badge details */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-8 bg-surface/90 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-xs flex items-center gap-2 text-white shadow-xl"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            Live AI Sensing Active
          </motion.div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-8 left-6 bg-surface/90 backdrop-blur-md border border-accent/30 px-4 py-2 rounded-xl text-xs flex items-center gap-2 text-white shadow-xl"
          >
            <ShieldCheck className="w-4 h-4 text-accent" />
            Aerospace Titanium Case
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-500 text-xs flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        Scroll to explore features
        <div className="w-5 h-8 rounded-full border border-gray-600 flex justify-center pt-1">
          <div className="w-1 h-1.5 bg-accent rounded-full animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}
