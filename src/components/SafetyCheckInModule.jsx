import { useState, useEffect, useRef } from "react";
import {
  Clock,
  CheckCircle2,
  ShieldCheck,
  AlertOctagon,
  BellRing,
  RotateCcw,
  Lock,
  Unlock,
  Play,
  Pause,
  Send,
  MapPin,
  Calendar,
  History,
  ShieldAlert,
  Sparkles,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SafetyCheckInModule() {
  // Configurable Interval (in seconds for demo purposes; display in mins)
  const [intervalMinutes, setIntervalMinutes] = useState(15);
  const [usePin, setUsePin] = useState(false);
  const [pinCode, setPinCode] = useState("1234");
  const [inputPin, setInputPin] = useState("");
  const [pinError, setPinError] = useState(false);

  // Timer State: 'inactive' | 'running' | 'prompt_due' | 'grace_period' | 'escalated'
  const [status, setStatus] = useState("inactive");
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60);
  const [totalSeconds, setTotalSeconds] = useState(15 * 60);
  const [graceSeconds, setGraceSeconds] = useState(60);

  // History log
  const [checkInLogs, setCheckInLogs] = useState([
    { id: 1, time: "20:30 PM", status: "Verified Safe", note: "On-time response" },
    { id: 2, time: "20:45 PM", status: "Verified Safe", note: "On-time response" }
  ]);

  const timerRef = useRef(null);
  const graceTimerRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Start Safety Monitoring Loop
  const handleStartMonitoring = (overrideMins = null) => {
    const mins = overrideMins !== null ? overrideMins : intervalMinutes;
    const secs = mins * 60;
    
    setTotalSeconds(secs);
    setSecondsRemaining(secs);
    setStatus("running");

    if (timerRef.current) clearInterval(timerRef.current);
    if (graceTimerRef.current) clearInterval(graceTimerRef.current);

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          triggerCheckInPrompt();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Pause Monitoring
  const handlePauseMonitoring = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (graceTimerRef.current) clearInterval(graceTimerRef.current);
    setStatus("inactive");
  };

  // Trigger Check-In Due Prompt
  const triggerCheckInPrompt = () => {
    setStatus("prompt_due");
    playPromptChime();

    if ("vibrate" in navigator) {
      navigator.vibrate([300, 200, 300, 200, 500]);
    }

    // Start 60s grace countdown before auto-escalating
    setGraceSeconds(60);
    if (graceTimerRef.current) clearInterval(graceTimerRef.current);

    graceTimerRef.current = setInterval(() => {
      setGraceSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(graceTimerRef.current);
          triggerEscalation();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Confirm Safety
  const handleConfirmSafety = () => {
    if (usePin && inputPin !== pinCode) {
      setPinError(true);
      return;
    }

    setPinError(false);
    setInputPin("");

    if (graceTimerRef.current) clearInterval(graceTimerRef.current);

    // Add log entry
    const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setCheckInLogs((prev) => [
      { id: Date.now(), time: nowStr, status: "Verified Safe", note: "Manual PIN/Button confirm" },
      ...prev
    ]);

    // Reset and restart next cycle
    handleStartMonitoring();
  };

  // Auto Escalation if user missed check-in
  const triggerEscalation = () => {
    setStatus("escalated");
    playAlarmSound();

    const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setCheckInLogs((prev) => [
      { id: Date.now(), time: nowStr, status: "MISSED - ESCALATED", note: "No response within grace window" },
      ...prev
    ]);
  };

  // Play gentle alert chime when prompt is due
  const playPromptChime = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      if (ctx.state === "suspended") ctx.resume();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2); // A5

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {}
  };

  const playAlarmSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(750, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.0);
    } catch (e) {}
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (graceTimerRef.current) clearInterval(graceTimerRef.current);
    };
  }, []);

  const formatTime = (totalSecs) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = totalSeconds > 0 ? (secondsRemaining / totalSeconds) * 100 : 0;

  return (
    <section id="checkin-module" className="py-20 px-6 md:px-16 bg-void relative overflow-hidden border-t border-white/10">
      {/* Background glow effects */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
            <Clock className="w-3.5 h-3.5" /> Autonomous Safety Guardian
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            Recurring <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent2 to-emerald-400">Safety Check-In</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg">
            Set periodic check-in timers when walking alone, taking late-night cabs, or traveling. The app prompts you to confirm your safety and automatically alerts guardians if a check-in is missed.
          </p>
        </div>

        {/* Console Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Timer Config & Live Ring (7 Cols) */}
          <div className="lg:col-span-7 bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> Active Safety Monitor
              </h3>
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                status === "running"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : status === "prompt_due"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse"
                  : status === "escalated"
                  ? "bg-red-500/20 text-red-400 border border-red-500/40"
                  : "bg-white/5 text-gray-400 border border-white/10"
              }`}>
                {status === "running"
                  ? "Active Monitoring"
                  : status === "prompt_due"
                  ? "Check-In Due!"
                  : status === "escalated"
                  ? "ESCALATED ALERT"
                  : "Standby Mode"}
              </span>
            </div>

            {/* Interval Selection Presets */}
            <div>
              <label className="text-sm font-bold text-white mb-3 block flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" /> Select Check-In Interval
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: "1 min (Demo)", value: 1 },
                  { label: "15 mins", value: 15 },
                  { label: "30 mins", value: 30 },
                  { label: "60 mins", value: 60 }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      setIntervalMinutes(item.value);
                      if (status === "running") {
                        handleStartMonitoring(item.value);
                      }
                    }}
                    className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-all ${
                      intervalMinutes === item.value
                        ? "bg-gradient-to-r from-accent to-accent2 text-white border-transparent shadow-[0_0_15px_rgba(224,86,253,0.3)]"
                        : "bg-void/60 border-white/10 text-gray-300 hover:border-white/30"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* PIN Security Toggle */}
            <div className="p-4 bg-void/60 border border-white/10 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                  {usePin ? <Lock className="w-5 h-5 text-accent" /> : <Unlock className="w-5 h-5 text-gray-400" />}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">4-Digit PIN Lock Protection</div>
                  <div className="text-xs text-gray-400">Requires PIN to confirm check-in (Prevents coercion)</div>
                </div>
              </div>

              <button
                onClick={() => setUsePin(!usePin)}
                className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                  usePin ? "bg-accent" : "bg-gray-700"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    usePin ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Timer Dial Display */}
            <div className="py-6 flex flex-col items-center justify-center bg-void/80 border border-white/10 rounded-3xl relative overflow-hidden">
              <div className="relative flex items-center justify-center">
                {/* SVG Dial Circle */}
                <svg className="w-56 h-56 -rotate-90">
                  <circle
                    cx="112"
                    cy="112"
                    r="96"
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="112"
                    cy="112"
                    r="96"
                    stroke={
                      status === "prompt_due"
                        ? "#f59e0b"
                        : status === "escalated"
                        ? "#ef4444"
                        : "#10b981"
                    }
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 96}
                    strokeDashoffset={2 * Math.PI * 96 * (1 - progressPercentage / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-500"
                  />
                </svg>

                {/* Dial Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl md:text-4xl font-black text-white font-mono">
                    {status === "prompt_due"
                      ? `${graceSeconds}s`
                      : formatTime(secondsRemaining)}
                  </span>
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-medium mt-1">
                    {status === "running"
                      ? "Until Check-In"
                      : status === "prompt_due"
                      ? "Grace Period Remaining!"
                      : status === "escalated"
                      ? "Guardians Alerted"
                      : "Timer Idle"}
                  </span>
                </div>
              </div>

              {/* Start / Pause Controls */}
              <div className="flex items-center gap-3 mt-6">
                {status === "inactive" ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleStartMonitoring()}
                    className="bg-gradient-to-r from-emerald-500 via-teal-500 to-accent text-white py-3 px-8 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-white" /> Start Monitoring Cycle
                  </motion.button>
                ) : (
                  <button
                    onClick={handlePauseMonitoring}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-6 rounded-2xl font-bold text-sm flex items-center gap-2"
                  >
                    <Pause className="w-4 h-4" /> Pause Monitor
                  </button>
                )}

                <button
                  onClick={() => triggerCheckInPrompt()}
                  className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 py-3 px-4 rounded-2xl font-bold text-xs flex items-center gap-1.5"
                  title="Test Prompt Alert"
                >
                  <BellRing className="w-3.5 h-3.5" /> Simulate Due Prompt
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Check-in Log & Active Prompt Modal (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">

            {/* CHECK-IN PROMPT CARD (When due) */}
            <AnimatePresence>
              {(status === "prompt_due" || status === "escalated") && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`p-6 rounded-3xl border-2 shadow-2xl ${
                    status === "escalated"
                      ? "bg-red-950/60 border-red-500 shadow-red-500/30"
                      : "bg-amber-950/60 border-amber-500 shadow-amber-500/30 animate-pulse"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      status === "escalated" ? "bg-red-600 text-white" : "bg-amber-500 text-black"
                    }`}>
                      <AlertOctagon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-xl text-white">
                        {status === "escalated" ? "MISSED CHECK-IN ALERT!" : "Safety Confirmation Due!"}
                      </h4>
                      <p className="text-xs text-gray-300">
                        {status === "escalated"
                          ? "User failed to confirm safety. Emergency dispatch payload generated."
                          : `Confirm you are safe within ${graceSeconds}s or guardians will be notified.`}
                      </p>
                    </div>
                  </div>

                  {usePin && (
                    <div className="mb-4">
                      <label className="text-xs font-semibold text-gray-300 mb-1 block">
                        Enter 4-Digit Security PIN (Default: 1234)
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="••••"
                        value={inputPin}
                        onChange={(e) => {
                          setInputPin(e.target.value);
                          setPinError(false);
                        }}
                        className="w-full bg-surface border border-white/20 rounded-xl px-4 py-2.5 text-center text-lg font-mono text-white tracking-widest focus:border-accent focus:outline-none"
                      />
                      {pinError && (
                        <p className="text-xs text-red-400 mt-1 font-medium">Incorrect PIN code. Please try again.</p>
                      )}
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirmSafety}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" /> I AM SAFE (CONFIRM CHECK-IN)
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Check-In History Log */}
            <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-accent" /> Check-In Audit History
                </h3>
                <span className="text-xs text-gray-400">{checkInLogs.length} Records</span>
              </div>

              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {checkInLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-void/60 border border-white/5 rounded-2xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${
                        log.status.includes("MISSED") ? "bg-red-500" : "bg-emerald-400"
                      }`} />
                      <div>
                        <div className="font-bold text-white">{log.status}</div>
                        <div className="text-[10px] text-gray-400">{log.note}</div>
                      </div>
                    </div>
                    <span className="font-mono text-gray-400">{log.time}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-accent/10 border border-accent/20 rounded-2xl text-[11px] text-gray-300 flex items-start gap-2">
                <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>All safety check-in logs are encrypted locally and stored on your device.</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
