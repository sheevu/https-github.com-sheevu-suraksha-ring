import { motion } from "framer-motion";
import { X, Play, ShieldAlert, Radio, Mic, HeartPulse } from "lucide-react";

export default function VideoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-3xl bg-surface border border-accent/40 rounded-3xl p-6 md:p-8 shadow-2xl text-white"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-full bg-white/5 hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-2xl font-extrabold mb-2 flex items-center gap-2">
          <Play className="w-6 h-6 text-accent fill-accent" /> Suraksha Ring in Action
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          Demonstration of voice recognition, instant distress detection, and police dispatch flow.
        </p>

        {/* Video Simulation Player Box */}
        <div className="relative aspect-video rounded-2xl bg-void border border-white/10 overflow-hidden flex flex-col justify-between p-6">
          {/* Top telemetry bar */}
          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
            <span className="flex items-center gap-2 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              LIVE TELEMETRY DEMO
            </span>
            <span>FREQ: 915MHz MESH</span>
          </div>

          {/* Center Graphic */}
          <div className="text-center my-auto">
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-accent via-accent2 to-purple-900 mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(224,86,253,0.6)] mb-4">
              <Mic className="w-10 h-10 text-white animate-bounce" />
            </div>
            <div className="text-accent font-extrabold text-lg">"CODE CRIMSON" DETECTED</div>
            <p className="text-xs text-gray-400 mt-1">Audio match 99.8% • Stress signature verified</p>
          </div>

          {/* Bottom Alert status */}
          <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono">
            <div className="bg-white/5 p-2 rounded-lg border border-white/10">
              <Radio className="w-4 h-4 text-accent mx-auto mb-1" />
              <span>GPS Broadcast: LIVE</span>
            </div>
            <div className="bg-white/5 p-2 rounded-lg border border-white/10">
              <ShieldAlert className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <span>Guardians: 5 Notified</span>
            </div>
            <div className="bg-white/5 p-2 rounded-lg border border-white/10">
              <HeartPulse className="w-4 h-4 text-rose-400 mx-auto mb-1" />
              <span>Police SOS: Sent (8s)</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold"
          >
            Close Demo
          </button>
        </div>
      </motion.div>
    </div>
  );
}
