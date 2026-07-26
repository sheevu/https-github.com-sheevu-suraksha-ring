import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Radio, Send, ShieldAlert, CheckCircle2, Volume2, Sparkles, PhoneCall } from "lucide-react";

const flowSteps = [
  {
    step: "01",
    title: "Discreet Whisper Trigger",
    subtitle: "Custom Wake Phrase",
    description: "Say your customized secret wake-phrase (e.g. 'Help me now' or 'Code Crimson'). On-device AI listens continuously without recording normal conversations.",
    icon: Mic,
    color: "from-purple-500 to-indigo-600",
    badge: "< 0.3s Recognition",
    actionText: "Simulate Voice Command",
  },
  {
    step: "02",
    title: "AI Audio Neural Validation",
    subtitle: "Duress & Distress Analysis",
    description: "Edge AI chip analyzes tone frequency, stress spikes, and acoustic patterns to eliminate false alarms and confirm genuine urgency in milliseconds.",
    icon: Sparkles,
    color: "from-pink-500 to-rose-600",
    badge: "99.8% Precision",
    actionText: "Verify Neural Match",
  },
  {
    step: "03",
    title: "Silent SOS Dispatch",
    subtitle: "Satellite & Dual Mesh",
    description: "Bypasses screen lock. Transmits encrypted GPS coordinates, live audio feed, and battery level via cellular & satellite mesh fallback network.",
    icon: Radio,
    color: "from-accent to-accent2",
    badge: "Dual-Path Signal",
    actionText: "Broadcast Emergency Signal",
  },
  {
    step: "04",
    title: "Emergency Response Hub",
    subtitle: "Guardian Network & Police Dispatch",
    description: "Instant SMS, WhatsApp & automated IVR calls sent to 5 emergency contacts while patching direct SOS telemetry to the nearest police command center.",
    icon: ShieldAlert,
    color: "from-emerald-500 to-teal-600",
    badge: "Active Protection",
    actionText: "Confirm Dispatch Complete",
  },
];

export default function VoiceActivationFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0);

  const startLiveSimulation = () => {
    setIsSimulating(true);
    setActiveStep(0);
    setSimProgress(25);

    setTimeout(() => {
      setActiveStep(1);
      setSimProgress(50);
    }, 1200);

    setTimeout(() => {
      setActiveStep(2);
      setSimProgress(75);
    }, 2400);

    setTimeout(() => {
      setActiveStep(3);
      setSimProgress(100);
      setIsSimulating(false);
    }, 3600);
  };

  return (
    <section className="relative bg-surface py-28 px-6 md:px-16 overflow-hidden border-y border-white/5">
      {/* Glow backgrounds */}
      <div className="absolute w-[500px] h-[500px] bg-accent/10 rounded-full blur-[140px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Volume2 className="w-4 h-4 animate-pulse" /> Live Security Protocol
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight"
          >
            How Voice Activation Works in <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">Real Time</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg"
          >
            Zero friction, hands-free protection. From whisper to police response in under 8 seconds.
          </motion.p>
        </div>

        {/* Step Cards Grid */}
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-12">
          {flowSteps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            const isCompleted = activeStep > idx;

            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => setActiveStep(idx)}
                className={`relative cursor-pointer rounded-2xl p-6 transition-all duration-300 border ${
                  isActive
                    ? "bg-surface border-accent shadow-[0_0_30px_rgba(224,86,253,0.3)] scale-[1.02]"
                    : isCompleted
                    ? "bg-surface/80 border-emerald-500/40"
                    : "bg-surface/40 border-white/10 hover:border-white/20"
                }`}
              >
                {/* Header info */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-gray-400 px-2.5 py-1 rounded-md bg-white/5 border border-white/10">
                    STEP {step.step}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? "bg-accent text-white" : "bg-white/5 text-gray-400"
                  }`}>
                    {step.badge}
                  </span>
                </div>

                {/* Icon box */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 bg-gradient-to-br ${step.color} shadow-lg text-white`}>
                  {isCompleted ? <CheckCircle2 className="w-7 h-7" /> : <Icon className="w-7 h-7" />}
                </div>

                <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                  {step.title}
                </h3>
                <h4 className="text-xs font-semibold text-accent mb-3">{step.subtitle}</h4>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{step.description}</p>

                {/* Active indicator bar */}
                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isCompleted ? "w-full bg-emerald-500" : isActive ? "w-full bg-accent" : "w-0"
                    }`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Live Interactive Simulator Console */}
        <div className="bg-void/80 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  isSimulating ? "bg-accent/20 border-2 border-accent animate-ping" : "bg-white/5 border border-white/10"
                }`}>
                  <Mic className={`w-6 h-6 ${isSimulating ? "text-accent" : "text-gray-400"}`} />
                </div>
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">Interactive SOS Voice Simulation</h4>
                <p className="text-gray-400 text-sm">
                  {isSimulating
                    ? `Executing Protocol: ${flowSteps[activeStep].title}...`
                    : "Test how Suraksha Ring detects & responds to emergency audio signals."}
                </p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              disabled={isSimulating}
              onClick={startLiveSimulation}
              className={`px-6 py-3.5 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg transition-all ${
                isSimulating
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-accent2 to-accent text-white shadow-[0_0_25px_rgba(224,86,253,0.4)]"
              }`}
            >
              {isSimulating ? (
                <>
                  <Radio className="w-4 h-4 animate-spin" /> Simulating ({simProgress}%)
                </>
              ) : (
                <>
                  <PhoneCall className="w-4 h-4" /> Trigger Voice SOS Test
                </>
              )}
            </motion.button>
          </div>

          {/* Progress sequence indicator */}
          {isSimulating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-gray-300"
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Live Audio Analysis: Active
              </span>
              <span className="font-mono text-accent font-semibold">
                Status: {flowSteps[activeStep].title}
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
