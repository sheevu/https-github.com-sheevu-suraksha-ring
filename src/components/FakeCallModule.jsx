import { useState, useEffect, useRef } from "react";
import {
  PhoneCall,
  PhoneOff,
  Clock,
  User,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Sparkles,
  Play,
  ShieldAlert,
  Smartphone,
  ChevronRight,
  CheckCircle,
  MessageSquare,
  Zap,
  Info,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PRESET_CALLERS = [
  {
    id: "mom",
    name: "Mom (Sunita)",
    number: "+91 98765 43211",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    script: "Beta, where are you? Dad is calling you home right now. It's urgent, please come back immediately!",
    hint: "Say: 'Okay Mom, I am leaving right now! See you in 10 minutes.'"
  },
  {
    id: "boss",
    name: "Sharma Ji (Manager)",
    number: "+91 98123 45678",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    script: "Hi, urgent server deployment issue! We need you on a team call right away. Can you jump online?",
    hint: "Say: 'Yes sir, I am stepping outside to get on the laptop right away.'"
  },
  {
    id: "friend",
    name: "Priya (Best Friend)",
    number: "+91 99887 76655",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    script: "Hey! I'm standing outside near your location right now. Come out quickly, my cab is waiting!",
    hint: "Say: 'Oh awesome, you're outside? Let me head out right now!'"
  },
  {
    id: "police",
    name: "Inspector V. Sharma (Suraksha Taskforce)",
    number: "112 / +91 11 2301 0000",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    script: "This is Police Control Room checking in. We noticed an unusual signal. Confirming if you are safe?",
    hint: "Say: 'Officer, thank you. I am safe but heading to a well-lit public area now.'"
  }
];

export default function FakeCallModule() {
  const [selectedCaller, setSelectedCaller] = useState(PRESET_CALLERS[0]);
  const [customName, setCustomName] = useState("");
  const [customNumber, setCustomNumber] = useState("");
  const [customScript, setCustomScript] = useState("");
  const [delaySeconds, setDelaySeconds] = useState(5);
  
  // State machine: 'idle' | 'counting' | 'ringing' | 'connected' | 'ended'
  const [callState, setCallState] = useState("idle");
  const [countdownRemaining, setCountdownRemaining] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [speechActive, setSpeechActive] = useState(false);

  const audioCtxRef = useRef(null);
  const ringIntervalRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const callDurationTimerRef = useRef(null);
  const speechSynthRef = useRef(null);

  // Clean up timers & speech on unmount
  useEffect(() => {
    return () => {
      stopRingtone();
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      if (callDurationTimerRef.current) clearInterval(callDurationTimerRef.current);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  // Web Audio Synthetic Ringtone generator
  const startRingtone = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      audioCtxRef.current = ctx;

      const playToneBurst = () => {
        if (!audioCtxRef.current) return;
        const now = audioCtxRef.current.currentTime;

        // Two-tone standard phone ring (440Hz + 480Hz)
        const osc1 = audioCtxRef.current.createOscillator();
        const osc2 = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();

        osc1.frequency.setValueAtTime(440, now);
        osc2.frequency.setValueAtTime(480, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
        gain.gain.setValueAtTime(0.15, now + 1.8);
        gain.gain.linearRampToValueAtTime(0, now + 2.0);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtxRef.current.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 2.0);
        osc2.stop(now + 2.0);
      };

      playToneBurst();
      ringIntervalRef.current = setInterval(playToneBurst, 3000);

      // Trigger hardware vibration if supported
      if ("vibrate" in navigator) {
        navigator.vibrate([1000, 1000, 1000, 1000, 1000]);
      }
    } catch (err) {
      console.warn("Audio Context ringtone warning:", err);
    }
  };

  const stopRingtone = () => {
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
    if ("vibrate" in navigator) {
      navigator.vibrate(0);
    }
  };

  // Trigger synthetic speech for incoming caller voice
  const playCallerVoice = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    utterance.lang = "en-IN";

    utterance.onstart = () => setSpeechActive(true);
    utterance.onend = () => setSpeechActive(false);
    utterance.onerror = () => setSpeechActive(false);

    window.speechSynthesis.speak(utterance);
  };

  // Launch Scheduled Fake Call
  const handleScheduleCall = (overrideDelay = null) => {
    const delay = overrideDelay !== null ? overrideDelay : delaySeconds;
    
    if (delay === 0) {
      triggerRingingState();
      return;
    }

    setCallState("counting");
    setCountdownRemaining(delay);

    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    countdownTimerRef.current = setInterval(() => {
      setCountdownRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimerRef.current);
          triggerRingingState();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const triggerRingingState = () => {
    setCallState("ringing");
    startRingtone();
  };

  const handleAcceptCall = () => {
    stopRingtone();
    setCallState("connected");
    setCallDuration(0);

    // Start timer
    if (callDurationTimerRef.current) clearInterval(callDurationTimerRef.current);
    callDurationTimerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    // Voice utterance
    const activeScript =
      selectedCaller.id === "custom"
        ? customScript || "Hey! Where are you? Please come home urgently, family is waiting!"
        : selectedCaller.script;

    playCallerVoice(activeScript);
  };

  const handleDeclineCall = () => {
    stopRingtone();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    if (callDurationTimerRef.current) clearInterval(callDurationTimerRef.current);
    
    setCallState("ended");
    setTimeout(() => {
      setCallState("idle");
    }, 1500);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentCallerName =
    selectedCaller.id === "custom" ? customName || "Unknown Caller" : selectedCaller.name;
  const currentCallerNumber =
    selectedCaller.id === "custom" ? customNumber || "+91 99999 00000" : selectedCaller.number;
  const currentHint =
    selectedCaller.id === "custom"
      ? "Say: 'Yes, I hear you! I'll be there right away.'"
      : selectedCaller.hint;

  return (
    <section id="fake-call" className="py-20 px-6 md:px-16 bg-void relative overflow-hidden border-t border-white/10">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-accent2/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
            <Smartphone className="w-3.5 h-3.5" /> De-escalation & Escape Tool
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            AI Stealth <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-accent to-accent2">Fake Call Console</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg">
            Simulate a realistic incoming phone call complete with ringtone, voice chatter, and realistic screen UI to excuse yourself safely from uncomfortable or unsafe situations.
          </p>
        </div>

        {/* Console Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Preset & Timer Configuration (7 cols) */}
          <div className="lg:col-span-7 bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-accent" /> Select Caller Preset
              </h3>
              <span className="text-xs text-gray-400">Step 1 of 2</span>
            </div>

            {/* Presets List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRESET_CALLERS.map((caller) => {
                const isSelected = selectedCaller.id === caller.id;
                return (
                  <button
                    key={caller.id}
                    onClick={() => setSelectedCaller(caller)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? "bg-accent/15 border-accent shadow-[0_0_20px_rgba(224,86,253,0.2)]"
                        : "bg-void/60 border-white/10 hover:border-white/30 text-gray-300"
                    }`}
                  >
                    <img
                      src={caller.avatar}
                      alt={caller.name}
                      className="w-11 h-11 rounded-full object-cover border border-white/20 shrink-0"
                    />
                    <div className="overflow-hidden">
                      <div className="font-bold text-sm text-white truncate">{caller.name}</div>
                      <div className="text-xs text-gray-400 font-mono mb-1">{caller.number}</div>
                      <div className="text-[11px] text-accent font-medium line-clamp-1">"{caller.script}"</div>
                    </div>
                  </button>
                );
              })}

              {/* Custom Caller Option */}
              <button
                onClick={() => setSelectedCaller({ id: "custom", name: "Custom Identity", number: "", avatar: "", script: "", hint: "" })}
                className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3.5 sm:col-span-2 ${
                  selectedCaller.id === "custom"
                    ? "bg-accent/15 border-accent shadow-[0_0_20px_rgba(224,86,253,0.2)]"
                    : "bg-void/60 border-white/10 hover:border-white/30 text-gray-300"
                }`}
              >
                <div className="w-11 h-11 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shrink-0 font-bold">
                  +
                </div>
                <div>
                  <div className="font-bold text-sm text-white">Create Custom Persona</div>
                  <div className="text-xs text-gray-400">Configure name, custom phone number & voice prompt script</div>
                </div>
              </button>
            </div>

            {/* Custom Persona Fields */}
            {selectedCaller.id === "custom" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="p-4 bg-void/80 border border-accent/30 rounded-2xl space-y-3"
              >
                <div>
                  <label className="text-xs font-semibold text-gray-300 mb-1 block">Caller Display Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Inspector Deshmukh"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full bg-surface border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-300 mb-1 block">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98200 12345"
                    value={customNumber}
                    onChange={(e) => setCustomNumber(e.target.value)}
                    className="w-full bg-surface border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-300 mb-1 block">AI Voice Script (Spoken when accepted)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Hey, please hurry back to the hostel right now, Warden is taking attendance!"
                    value={customScript}
                    onChange={(e) => setCustomScript(e.target.value)}
                    className="w-full bg-surface border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-accent focus:outline-none"
                  />
                </div>
              </motion.div>
            )}

            {/* Delay Timer Select */}
            <div className="pt-2">
              <label className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-accent" /> Trigger Timer Delay
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {[
                  { label: "Instant", value: 0 },
                  { label: "5 sec", value: 5 },
                  { label: "15 sec", value: 15 },
                  { label: "30 sec", value: 30 },
                  { label: "1 min", value: 60 }
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => setDelaySeconds(item.value)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      delaySeconds === item.value
                        ? "bg-gradient-to-r from-accent to-accent2 text-white border-transparent shadow-[0_0_15px_rgba(224,86,253,0.4)]"
                        : "bg-void/50 border-white/10 text-gray-300 hover:border-white/30"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Action Trigger Buttons */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleScheduleCall()}
                disabled={callState === "counting" || callState === "ringing" || callState === "connected"}
                className="flex-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-accent text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Zap className="w-4 h-4 fill-white" />
                {callState === "counting"
                  ? `Triggering in ${countdownRemaining}s...`
                  : delaySeconds === 0
                  ? "Call Me Right Now"
                  : `Schedule Fake Call (${delaySeconds}s Delay)`}
              </motion.button>

              {callState === "counting" && (
                <button
                  onClick={() => {
                    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
                    setCallState("idle");
                  }}
                  className="bg-red-500/20 border border-red-500/40 text-red-300 py-3.5 px-5 rounded-2xl font-bold text-sm hover:bg-red-500/30"
                >
                  Cancel Timer
                </button>
              )}
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-gray-400">
              <div className="flex items-center gap-2 bg-void/40 p-2.5 rounded-xl border border-white/5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Web Speech AI Voice Chatter</span>
              </div>
              <div className="flex items-center gap-2 bg-void/40 p-2.5 rounded-xl border border-white/5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Synthetic Ringtone + Vibration</span>
              </div>
            </div>
          </div>

          {/* Right Column: Simulated Smartphone Screen (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-widest flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-accent" /> Simulated Device Display
            </div>

            {/* Smartphone Container Frame */}
            <div className="w-full max-w-[340px] h-[580px] bg-black border-4 border-gray-800 rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.8)] p-4 relative overflow-hidden flex flex-col justify-between select-none">
              
              {/* Notch / Dynamic Island */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-4 bg-gray-900 rounded-full flex items-center justify-center z-30">
                <div className="w-2.5 h-2.5 bg-black rounded-full border border-gray-700" />
              </div>

              {/* Status Bar */}
              <div className="flex justify-between items-center text-[10px] text-gray-400 pt-1 px-3 z-20">
                <span>09:41</span>
                <div className="flex items-center gap-1.5">
                  <span>5G</span>
                  <div className="w-4 h-2 border border-gray-400 rounded-xs p-0.5">
                    <div className="w-full h-full bg-emerald-400 rounded-2xs" />
                  </div>
                </div>
              </div>

              {/* MAIN PHONE DISPLAY STATES */}
              <div className="flex-1 flex flex-col justify-between py-6 z-10 text-center text-white">

                {/* STATE 1: IDLE / CONFIGURING */}
                {callState === "idle" && (
                  <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent mb-4 animate-pulse">
                      <PhoneCall className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-base text-white mb-1">Standby Mode</h4>
                    <p className="text-xs text-gray-400 max-w-[200px] mb-6">
                      Click <span className="text-accent font-semibold">"Schedule Fake Call"</span> on the console to simulate a call.
                    </p>
                    <div className="bg-surface/80 border border-white/10 p-3 rounded-2xl w-full text-left space-y-1">
                      <div className="text-[10px] text-gray-400 uppercase font-mono">Target Identity:</div>
                      <div className="text-xs font-bold text-white truncate">{currentCallerName}</div>
                      <div className="text-[11px] text-accent font-mono">{currentCallerNumber}</div>
                    </div>
                  </div>
                )}

                {/* STATE 2: COUNTDOWN WAITING */}
                {callState === "counting" && (
                  <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 rounded-full border-4 border-accent/30 border-t-accent animate-spin flex items-center justify-center" />
                      <div className="absolute inset-0 flex items-center justify-center font-black text-2xl text-accent">
                        {countdownRemaining}s
                      </div>
                    </div>
                    <h4 className="font-bold text-base text-white mb-1">Stealth Timer Active</h4>
                    <p className="text-xs text-gray-400">Put phone in pocket or table. Fake call incoming shortly...</p>
                  </div>
                )}

                {/* STATE 3: RINGING (INCOMING CALL) */}
                {callState === "ringing" && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex-1 flex flex-col justify-between py-2"
                    >
                      {/* Top Contact Info */}
                      <div className="pt-4 space-y-2">
                        <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider flex items-center justify-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Incoming Call...
                        </div>

                        {/* Avatar */}
                        <div className="relative inline-block my-2">
                          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-accent to-emerald-400 animate-pulse">
                            {selectedCaller.avatar ? (
                              <img
                                src={selectedCaller.avatar}
                                alt={currentCallerName}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-xl font-bold">
                                {currentCallerName.charAt(0)}
                              </div>
                            )}
                          </div>
                        </div>

                        <h3 className="text-xl font-black text-white">{currentCallerName}</h3>
                        <p className="text-xs text-gray-300 font-mono">{currentCallerNumber}</p>
                        <p className="text-[10px] text-gray-400">India Mobile Call • Suraksha Bypass</p>
                      </div>

                      {/* Accept / Decline Action Buttons */}
                      <div className="flex justify-around items-center px-4 pb-4">
                        {/* Decline */}
                        <div className="flex flex-col items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleDeclineCall}
                            className="w-16 h-16 rounded-full bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center justify-center text-white"
                          >
                            <PhoneOff className="w-7 h-7" />
                          </motion.button>
                          <span className="text-[11px] text-gray-400 font-medium">Decline</span>
                        </div>

                        {/* Accept */}
                        <div className="flex flex-col items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleAcceptCall}
                            className="w-16 h-16 rounded-full bg-emerald-500 shadow-[0_0_25px_rgba(16,185,129,0.7)] flex items-center justify-center text-white animate-bounce"
                          >
                            <PhoneCall className="w-7 h-7" />
                          </motion.button>
                          <span className="text-[11px] text-emerald-400 font-bold">Accept</span>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                )}

                {/* STATE 4: CONNECTED (CALL IN PROGRESS) */}
                {callState === "connected" && (
                  <div className="flex-1 flex flex-col justify-between py-2">
                    {/* Top Call Info */}
                    <div className="pt-2 space-y-1">
                      <div className="text-xs text-emerald-400 font-mono font-bold">
                        {formatTimer(callDuration)}
                      </div>
                      <h3 className="text-lg font-bold text-white">{currentCallerName}</h3>
                      <p className="text-[11px] text-gray-400">HD Audio Call • Speaker Active</p>

                      {/* Voice Visualizer Indicator */}
                      <div className="flex items-center justify-center gap-1 py-3">
                        <div className={`w-1 bg-accent rounded-full ${speechActive ? "h-6 animate-pulse" : "h-2"}`} />
                        <div className={`w-1 bg-emerald-400 rounded-full ${speechActive ? "h-8 animate-bounce" : "h-2"}`} />
                        <div className={`w-1 bg-accent2 rounded-full ${speechActive ? "h-5 animate-pulse" : "h-2"}`} />
                        <div className={`w-1 bg-emerald-400 rounded-full ${speechActive ? "h-7 animate-bounce" : "h-2"}`} />
                      </div>
                    </div>

                    {/* Hint Banner for user response */}
                    <div className="bg-void/90 border border-emerald-500/30 p-3 rounded-2xl mx-1 text-left space-y-1">
                      <div className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> Suggested Excuse Dialogue:
                      </div>
                      <div className="text-xs text-white font-medium italic">
                        {currentHint}
                      </div>
                    </div>

                    {/* In-Call Controls Matrix */}
                    <div className="grid grid-cols-3 gap-3 px-2">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-3 rounded-2xl border flex flex-col items-center gap-1 text-[10px] font-semibold ${
                          isMuted ? "bg-accent/20 border-accent text-accent" : "bg-white/5 border-white/10 text-gray-300"
                        }`}
                      >
                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        {isMuted ? "Muted" : "Mute"}
                      </button>

                      <button
                        onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                        className={`p-3 rounded-2xl border flex flex-col items-center gap-1 text-[10px] font-semibold ${
                          isSpeakerOn ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" : "bg-white/5 border-white/10 text-gray-300"
                        }`}
                      >
                        {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                        Speaker
                      </button>

                      <button
                        onClick={() => playCallerVoice(selectedCaller.script || customScript)}
                        className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-300 flex flex-col items-center gap-1 text-[10px] font-semibold hover:bg-accent/20"
                      >
                        <RotateCcw className="w-5 h-5 text-accent" />
                        Re-play
                      </button>
                    </div>

                    {/* End Call Button */}
                    <div className="pb-2">
                      <button
                        onClick={handleDeclineCall}
                        className="w-16 h-16 rounded-full bg-red-600 shadow-[0_0_25px_rgba(239,68,68,0.6)] mx-auto flex items-center justify-center text-white"
                      >
                        <PhoneOff className="w-7 h-7" />
                      </button>
                      <span className="text-[10px] text-gray-400 mt-1 block">End Call</span>
                    </div>
                  </div>
                )}

                {/* STATE 5: ENDED */}
                {callState === "ended" && (
                  <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mb-3">
                      <PhoneOff className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-base text-white">Call Ended</h4>
                    <p className="text-xs text-gray-400 font-mono">Duration: {formatTimer(callDuration)}</p>
                  </div>
                )}

              </div>

              {/* Bottom Navigation Indicator Bar */}
              <div className="w-28 h-1 bg-gray-600 rounded-full mx-auto mb-1 z-20" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
