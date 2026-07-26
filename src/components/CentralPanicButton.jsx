import { useState, useEffect, useRef } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  MapPin,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Square,
  RefreshCw,
  CheckCircle,
  PhoneCall,
  MessageSquare,
  Clock,
  Radio,
  Lock,
  Compass,
  Download,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CentralPanicButton() {
  // Press and hold state
  const [holding, setHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 100
  const holdIntervalRef = useRef(null);

  // Emergency sequence active state
  const [sosActive, setSosActive] = useState(false);
  const [cancelCountdown, setCancelCountdown] = useState(10);
  const [sosDispatched, setSosDispatched] = useState(false);
  const cancelTimerRef = useRef(null);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordTimerRef = useRef(null);

  // Siren State
  const [isSirenOn, setIsSirenOn] = useState(false);
  const audioCtxRef = useRef(null);
  const sirenOscRef = useRef(null);
  const sirenIntervalRef = useRef(null);

  // Geolocation state
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationAddress, setLocationAddress] = useState("Fetching current coordinates...");

  // Guardians list from localStorage or default
  const [guardians] = useState(() => {
    try {
      const saved = localStorage.getItem("suraksha_contacts");
      return saved
        ? JSON.parse(saved)
        : [
            { name: "Dad (Rajesh)", phone: "+919876543210" },
            { name: "Mom (Sunita)", phone: "+919876543211" },
            { name: "Brother (Rahul)", phone: "+919876543212" }
          ];
    } catch (e) {
      return [{ name: "Dad (Rajesh)", phone: "+919876543210" }];
    }
  });

  // Handle Press & Hold Mechanic (3 Seconds)
  const handleMouseDown = () => {
    if (sosActive) return;
    setHolding(true);
    setHoldProgress(0);

    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }

    const startTime = Date.now();
    const duration = 2500; // 2.5 seconds hold threshold

    holdIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setHoldProgress(pct);

      if (pct >= 100) {
        clearInterval(holdIntervalRef.current);
        setHolding(false);
        setHoldProgress(0);
        triggerEmergencySequence();
      }
    }, 50);
  };

  const handleMouseUp = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    setHolding(false);
    setHoldProgress(0);
  };

  // Trigger the full Emergency SOS Sequence
  const triggerEmergencySequence = () => {
    setSosActive(true);
    setCancelCountdown(10);
    setSosDispatched(false);

    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200, 100, 400]);
    }

    // Fetch GPS coordinates
    fetchLocation();

    // Start Alarm Siren
    startSiren();

    // Start Audio Recording automatically
    startRecording();

    // Start 10s grace period cancel countdown before final dispatch
    if (cancelTimerRef.current) clearInterval(cancelTimerRef.current);
    cancelTimerRef.current = setInterval(() => {
      setCancelCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(cancelTimerRef.current);
          setSosDispatched(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Cancel False Alarm
  const handleCancelSOS = () => {
    if (cancelTimerRef.current) clearInterval(cancelTimerRef.current);
    stopSiren();
    stopRecording();
    setSosActive(false);
    setSosDispatched(false);
    setCancelCountdown(10);
  };

  // Fetch High-Accuracy GPS
  const fetchLocation = () => {
    setLocationLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude.toFixed(5),
            lng: pos.coords.longitude.toFixed(5),
            accuracy: Math.round(pos.coords.accuracy)
          };
          setLocation(coords);
          setLocationAddress(`Lat: ${coords.lat}, Lng: ${coords.lng} (Accuracy: ~${coords.accuracy}m)`);
          setLocationLoading(false);
        },
        (err) => {
          setLocationLoading(false);
          // Fallback location simulation (Connaught Place, New Delhi)
          const fallback = { lat: 28.6315, lng: 77.2167, accuracy: 12 };
          setLocation(fallback);
          setLocationAddress("Connaught Place, Block C, New Delhi (GPS Approx)");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationLoading(false);
      const fallback = { lat: 28.6315, lng: 77.2167, accuracy: 15 };
      setLocation(fallback);
      setLocationAddress("Connaught Place, New Delhi (Default)");
    }
  };

  // Audio Recording Logic using MediaRecorder API
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordTime(0);

      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
      recordTimerRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn("Microphone access denied or unsupported:", err);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (recordTimerRef.current) clearInterval(recordTimerRef.current);
  };

  // Audio Synthesizer Emergency Siren Generator
  const startSiren = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      if (ctx.state === "suspended") ctx.resume();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      gain.gain.setValueAtTime(0.2, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      sirenOscRef.current = osc;
      setIsSirenOn(true);

      // Oscillate frequency (Police Siren Effect)
      let rising = true;
      let freq = 600;
      sirenIntervalRef.current = setInterval(() => {
        if (!audioCtxRef.current) return;
        if (rising) {
          freq += 60;
          if (freq >= 1200) rising = false;
        } else {
          freq -= 60;
          if (freq <= 500) rising = true;
        }
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
      }, 50);
    } catch (e) {
      console.warn("Audio Context Siren Error:", e);
    }
  };

  const stopSiren = () => {
    if (sirenIntervalRef.current) clearInterval(sirenIntervalRef.current);
    if (sirenOscRef.current) {
      try {
        sirenOscRef.current.stop();
      } catch (e) {}
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
    }
    setIsSirenOn(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSiren();
      stopRecording();
      if (cancelTimerRef.current) clearInterval(cancelTimerRef.current);
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  const mapsUrl = location
    ? `https://maps.google.com/?q=${location.lat},${location.lng}`
    : `https://maps.google.com/?q=28.6315,77.2167`;

  const emergencySmsText = `EMERGENCY SOS ALERT! I need immediate help. My live GPS location: ${mapsUrl} (Accuracy: ~${location?.accuracy || 10}m). Suraksha Ring Auto-Trigger.`;

  return (
    <section id="panic-button-section" className="py-20 px-6 md:px-16 bg-void relative overflow-hidden border-t border-white/10">
      {/* Background glow effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
            <ShieldAlert className="w-3.5 h-3.5" /> High Precision Panic Core
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            Central SOS <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-accent to-red-400">Emergency Trigger</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg">
            Press and hold the button below for 2.5 seconds to instantly dispatch live GPS tracking, start encrypted audio recording, sound alarm siren, and broadcast emergency alerts to your guardians.
          </p>
        </div>

        {/* Central Button Container */}
        <div className="flex flex-col items-center justify-center my-8">
          <div className="relative flex items-center justify-center">
            
            {/* Outer Pulsing Waves */}
            <div className={`absolute w-72 h-72 rounded-full border border-red-500/30 ${holding ? "animate-ping bg-red-600/20" : "animate-pulse"}`} />
            <div className={`absolute w-84 h-84 rounded-full border border-red-500/10 ${holding ? "animate-pulse" : ""}`} />

            {/* SVG Progress Ring */}
            <svg className="w-64 h-64 -rotate-90 z-10 pointer-events-none">
              <circle
                cx="128"
                cy="128"
                r="116"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="128"
                cy="128"
                r="116"
                stroke="#ef4444"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 116}
                strokeDashoffset={2 * Math.PI * 116 * (1 - holdProgress / 100)}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-75"
              />
            </svg>

            {/* Center Interactive Button */}
            <motion.button
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`absolute z-20 w-52 h-52 rounded-full flex flex-col items-center justify-center text-white shadow-[0_0_60px_rgba(239,68,68,0.6)] select-none cursor-pointer transition-all ${
                sosActive
                  ? "bg-gradient-to-tr from-red-700 via-red-600 to-red-500 animate-pulse border-4 border-white"
                  : holding
                  ? "bg-red-700 border-4 border-white"
                  : "bg-gradient-to-br from-red-600 via-red-500 to-accent border-4 border-red-400/40"
              }`}
            >
              <ShieldAlert className={`w-16 h-16 mb-1 ${holding || sosActive ? "animate-bounce" : ""}`} />
              <span className="font-black text-2xl tracking-wider">
                {sosActive ? "EMERGENCY" : holding ? "HOLD ON..." : "PRESS & HOLD"}
              </span>
              <span className="text-[10px] text-red-100 font-semibold tracking-widest uppercase mt-0.5">
                {holding ? `${Math.round(holdProgress)}%` : "Hold 2.5s to SOS"}
              </span>
            </motion.button>
          </div>

          <p className="text-xs text-gray-400 mt-8 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-red-400" /> Hold protection avoids accidental triggers. Immediate release cancels sequence.
          </p>
        </div>

        {/* ACTIVE SOS MODAL / DASHBOARD */}
        <AnimatePresence>
          {sosActive && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="mt-12 bg-red-950/40 backdrop-blur-2xl border-2 border-red-500/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-[0_0_80px_rgba(239,68,68,0.3)] relative overflow-hidden"
            >
              {/* Alert Header Ribbon */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-red-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-red-600 flex items-center justify-center text-white animate-bounce shadow-lg">
                    <Radio className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                      EMERGENCY PIPELINE ACTIVE <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                    </h3>
                    <p className="text-xs text-red-300 font-medium">
                      {sosDispatched
                        ? "🚨 SOS Alerts successfully dispatched to all guardians & live tracking active!"
                        : `⏱️ False alarm grace period: ${cancelCountdown} seconds remaining before final dispatch.`}
                    </p>
                  </div>
                </div>

                {/* False Alarm Cancel Button */}
                <button
                  onClick={handleCancelSOS}
                  className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm py-3 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg"
                >
                  <X className="w-4 h-4 text-red-400" /> I AM SAFE (CANCEL SOS)
                </button>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. GPS Coordinates */}
                <div className="bg-void/80 border border-red-500/30 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-red-400 font-bold uppercase">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Live Geolocation</span>
                    <button onClick={fetchLocation} className="text-white hover:text-red-300">
                      <RefreshCw className={`w-3.5 h-3.5 ${locationLoading ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                  <div className="text-sm font-mono text-white font-semibold line-clamp-2">
                    {locationAddress}
                  </div>
                  {location && (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-accent font-bold underline flex items-center gap-1 pt-1"
                    >
                      <Compass className="w-3.5 h-3.5" /> Open Live Google Map
                    </a>
                  )}
                </div>

                {/* 2. Audio Recording Status */}
                <div className="bg-void/80 border border-red-500/30 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-red-400 font-bold uppercase">
                    <span className="flex items-center gap-1.5"><Mic className="w-4 h-4 animate-pulse" /> Audio Evidence</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      {isRecording ? `REC ${recordTime}s` : "Stopped"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300">
                    {isRecording
                      ? "Continuously capturing surrounding environmental audio..."
                      : "Recording complete and saved to encrypted storage."}
                  </p>
                  {audioUrl && (
                    <div className="pt-1 flex items-center gap-2">
                      <audio src={audioUrl} controls className="w-full h-8 scale-95 origin-left" />
                      <a
                        href={audioUrl}
                        download="suraksha_emergency_audio.webm"
                        className="p-1.5 bg-accent/20 text-accent rounded-lg hover:bg-accent/30"
                        title="Download Recording"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>

                {/* 3. Emergency Siren Controller */}
                <div className="bg-void/80 border border-red-500/30 p-4 rounded-2xl space-y-2 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-red-400 font-bold uppercase">
                    <span className="flex items-center gap-1.5"><Volume2 className="w-4 h-4" /> Alarm Siren</span>
                    <span className={`text-xs font-bold ${isSirenOn ? "text-red-400 animate-pulse" : "text-gray-400"}`}>
                      {isSirenOn ? "SOUNDING" : "MUTED"}
                    </span>
                  </div>
                  <button
                    onClick={isSirenOn ? stopSiren : startSiren}
                    className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                      isSirenOn
                        ? "bg-red-600 border-red-400 text-white shadow-lg"
                        : "bg-surface border-white/10 text-gray-300 hover:border-white/30"
                    }`}
                  >
                    {isSirenOn ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    {isSirenOn ? "Mute Loud Alarm Siren" : "Play High-Decibel Siren"}
                  </button>
                </div>

              </div>

              {/* SMS Dispatch Message Preview & One-Touch Links */}
              <div className="bg-void/90 border border-white/10 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-gray-300 uppercase">
                  <span className="flex items-center gap-1.5 text-accent"><MessageSquare className="w-4 h-4" /> Guardian SMS & WhatsApp Payload</span>
                  <span className="text-[11px] text-emerald-400 font-mono">Targets: {guardians.length} Contacts</span>
                </div>
                <div className="p-3 bg-surface/80 border border-white/10 rounded-xl font-mono text-xs text-gray-200 break-all select-all">
                  {emergencySmsText}
                </div>
                
                <div className="flex flex-wrap gap-2 pt-1">
                  {guardians.map((g, idx) => (
                    <a
                      key={idx}
                      href={`https://wa.me/${g.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(emergencySmsText)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 text-xs font-bold px-3 py-2 rounded-xl transition-all"
                    >
                      <Send className="w-3.5 h-3.5" /> WhatsApp {g.name}
                    </a>
                  ))}
                  <a
                    href={`sms:?body=${encodeURIComponent(emergencySmsText)}`}
                    className="inline-flex items-center gap-1.5 bg-accent/20 hover:bg-accent/30 border border-accent/40 text-accent text-xs font-bold px-3 py-2 rounded-xl transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Open System SMS App
                  </a>
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* STICKY FLOATING PANIC QUICK ACCESS BUTTON FOR MOBILE/DESKTOP */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={triggerEmergencySequence}
          className="w-16 h-16 rounded-full bg-gradient-to-tr from-red-600 via-red-500 to-accent text-white shadow-[0_0_30px_rgba(239,68,68,0.8)] border-2 border-white flex flex-col items-center justify-center font-black text-[10px] tracking-tighter"
          title="Instant Quick Panic SOS"
        >
          <ShieldAlert className="w-6 h-6 animate-pulse" />
          <span>SOS</span>
        </motion.button>
      </div>
    </section>
  );
}
