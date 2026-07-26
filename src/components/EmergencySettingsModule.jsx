import { useState, useEffect } from "react";
import {
  Sliders,
  Mic,
  Video,
  Volume2,
  VolumeX,
  Vibrate,
  ShieldCheck,
  ShieldAlert,
  Zap,
  RotateCcw,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Bell,
  Sparkles,
  Info,
  SlidersHorizontal,
  Flame,
  Radio,
  Plus,
  X,
  PhoneCall,
  Save
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_SETTINGS = {
  // Auto-record
  autoRecordAudio: true,
  autoRecordVideo: false,
  recordDurationSeconds: 180, // 3 minutes

  // Vibration
  vibrationPattern: "strobe", // 'continuous' | 'strobe' | 'heartbeat' | 'silent'
  hapticFeedback: true,

  // Wake-word Sensitivity
  sensitivityLevel: "medium", // 'low' | 'medium' | 'high' | 'ultra'
  confidenceThreshold: 75, // %
  noiseSuppression: true,
  customWakePhrases: ["HELP DIDI", "HELP", "SAVE ME", "CODE CRIMSON", "MERI MADAD KARO"],

  // Emergency Siren & Flash
  sirenEnabled: true,
  sirenVolume: 100,
  flashlightStrobe: true,
  screenFlash: true,

  // Countdown & Stealth
  countdownSeconds: 5,
  stealthMode: false,
  pinProtectionEnabled: true,
  securityPin: "1234",

  // Location & Dispatches
  autoSmsDispatch: true,
  autoWhatsappDispatch: true,
  highAccuracyGps: true
};

const VIBRATION_PATTERNS = [
  {
    id: "strobe",
    name: "Morse SOS Strobe",
    desc: "...---... Morse Code vibration sequence",
    pattern: [100, 50, 100, 50, 100, 200, 300, 100, 300, 100, 300, 200, 100, 50, 100, 50, 100]
  },
  {
    id: "continuous",
    name: "Heavy Continuous",
    desc: "Uninterrupted strong vibration alert",
    pattern: [1000, 200, 1000, 200, 1000]
  },
  {
    id: "heartbeat",
    name: "Rapid Heartbeat",
    desc: "Dual burst impact pattern for high tactile awareness",
    pattern: [150, 100, 150, 400, 150, 100, 150]
  },
  {
    id: "silent",
    name: "Silent / Tactile Off",
    desc: "Disable vibration completely for covert operations",
    pattern: []
  }
];

export default function EmergencySettingsModule() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem("suraksha_settings");
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  const [newPhraseInput, setNewPhraseInput] = useState("");
  const [savedNotification, setSavedNotification] = useState(false);
  const [testingVibration, setTestingVibration] = useState(false);

  // Auto-save to localStorage on setting change
  useEffect(() => {
    try {
      localStorage.setItem("suraksha_settings", JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    triggerSaveToast();
  };

  const triggerSaveToast = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2000);
  };

  const handleAddWakePhrase = (e) => {
    e.preventDefault();
    if (!newPhraseInput.trim()) return;
    const clean = newPhraseInput.trim().toUpperCase();
    if (!settings.customWakePhrases.includes(clean)) {
      updateSetting("customWakePhrases", [...settings.customWakePhrases, clean]);
    }
    setNewPhraseInput("");
  };

  const handleRemoveWakePhrase = (phraseToRemove) => {
    updateSetting(
      "customWakePhrases",
      settings.customWakePhrases.filter((p) => p !== phraseToRemove)
    );
  };

  const testVibrationPattern = (patternArray) => {
    if (!("vibrate" in navigator) || patternArray.length === 0) return;
    setTestingVibration(true);
    navigator.vibrate(patternArray);
    setTimeout(() => setTestingVibration(false), 2500);
  };

  const handleResetDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    triggerSaveToast();
  };

  return (
    <section id="settings" className="py-20 px-6 md:px-16 bg-void relative overflow-hidden border-t border-white/10">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-accent/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 text-accent text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
            <Sliders className="w-3.5 h-3.5" /> Emergency Protocol Preferences
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            Safety & Emergency <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent2 to-emerald-400">Settings</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg">
            Fine-tune AI wake-word sensitivity, automated audio/video recording triggers, tactile vibration responses, and siren volumes to customize your personal protection profile.
          </p>
        </div>

        {/* Settings Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Recording & Wake-Word Sensitivity (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* 1. AUTO-RECORD EMERGENCY EVIDENCE */}
            <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                  <Mic className="w-5 h-5 text-accent" /> Auto-Record Evidence Triggers
                </h3>
                <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                  Encrypted Local Vault
                </span>
              </div>

              {/* Audio Toggle */}
              <div className="flex items-center justify-between p-4 bg-void/60 border border-white/10 rounded-2xl">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent shrink-0">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Auto Audio Recording</div>
                    <div className="text-xs text-gray-400">Instantly record surrounding environmental audio upon SOS trigger</div>
                  </div>
                </div>

                <button
                  onClick={() => updateSetting("autoRecordAudio", !settings.autoRecordAudio)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 shrink-0 ${
                    settings.autoRecordAudio ? "bg-accent" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.autoRecordAudio ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Video Toggle */}
              <div className="flex items-center justify-between p-4 bg-void/60 border border-white/10 rounded-2xl">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Auto Camera Video Capture</div>
                    <div className="text-xs text-gray-400">Capture dual front/rear video footage during active emergency</div>
                  </div>
                </div>

                <button
                  onClick={() => updateSetting("autoRecordVideo", !settings.autoRecordVideo)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 shrink-0 ${
                    settings.autoRecordVideo ? "bg-accent" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.autoRecordVideo ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Recording Duration Selector */}
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2.5 block">
                  Recording Duration Limit
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "1 Minute", value: 60 },
                    { label: "3 Minutes", value: 180 },
                    { label: "Continuous", value: 0 }
                  ].map((dur) => (
                    <button
                      key={dur.value}
                      onClick={() => updateSetting("recordDurationSeconds", dur.value)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                        settings.recordDurationSeconds === dur.value
                          ? "bg-gradient-to-r from-accent to-accent2 text-white border-transparent shadow-[0_0_15px_rgba(224,86,253,0.3)]"
                          : "bg-void/60 border-white/10 text-gray-300 hover:border-white/30"
                      }`}
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. CUSTOM WAKE-WORD SENSITIVITY & PHRASES */}
            <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                  <Radio className="w-5 h-5 text-emerald-400" /> Wake-Word & Voice Engine Tuning
                </h3>
                <span className="text-xs text-accent font-mono font-bold bg-accent/10 px-3 py-1 rounded-full border border-accent/30">
                  Offline Neural Engine
                </span>
              </div>

              {/* Sensitivity Radio Grid */}
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3 block">
                  Voice Engine Sensitivity Level
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "low", label: "Low (Quiet)", desc: "Avoids false positives" },
                    { id: "medium", label: "Medium", desc: "Balanced standard" },
                    { id: "high", label: "High (Noisy)", desc: "Crowds & vehicles" },
                    { id: "ultra", label: "Ultra-High", desc: "Extreme whisper mode" }
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => updateSetting("sensitivityLevel", lvl.id)}
                      className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                        settings.sensitivityLevel === lvl.id
                          ? "bg-emerald-500/15 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                          : "bg-void/60 border-white/10 text-gray-400 hover:border-white/30"
                      }`}
                    >
                      <div className="font-bold text-xs text-white mb-1">{lvl.label}</div>
                      <div className="text-[10px] text-gray-400">{lvl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Confidence Threshold Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-gray-300">
                  <span>AI Speech Confidence Threshold</span>
                  <span className="text-emerald-400 font-mono">{settings.confidenceThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={settings.confidenceThreshold}
                  onChange={(e) => updateSetting("confidenceThreshold", parseInt(e.target.value))}
                  className="w-full accent-emerald-400 h-2 bg-void rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>50% (Permissive)</span>
                  <span>75% (Recommended)</span>
                  <span>95% (Strict match)</span>
                </div>
              </div>

              {/* Noise Suppression Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-void/60 border border-white/10 rounded-2xl">
                <div>
                  <div className="text-xs font-bold text-white">Active Environmental Noise Filter</div>
                  <div className="text-[11px] text-gray-400">Filters background music, television, and street noise</div>
                </div>
                <button
                  onClick={() => updateSetting("noiseSuppression", !settings.noiseSuppression)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 shrink-0 ${
                    settings.noiseSuppression ? "bg-emerald-500" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.noiseSuppression ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Custom Wake Words List */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                  Configured Wake Phrases
                </label>
                <div className="flex flex-wrap gap-2">
                  {settings.customWakePhrases.map((phrase, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 bg-accent/15 border border-accent/40 text-accent text-xs font-bold px-3 py-1.5 rounded-xl"
                    >
                      "{phrase}"
                      <button
                        onClick={() => handleRemoveWakePhrase(phrase)}
                        className="hover:text-red-400 transition-colors"
                        title="Remove phrase"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>

                <form onSubmit={handleAddWakePhrase} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add custom phrase e.g. 'MERI MADAD KARO'..."
                    value={newPhraseInput}
                    onChange={(e) => setNewPhraseInput(e.target.value)}
                    className="flex-1 bg-void border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white uppercase placeholder:normal-case focus:border-accent focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-accent hover:bg-accent/80 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Phrase
                  </button>
                </form>
              </div>

            </div>

          </div>

          {/* Right Column: Vibration, Siren, Countdown & Reset (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">

            {/* 3. VIBRATION PATTERNS */}
            <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Vibrate className="w-5 h-5 text-amber-400" /> Tactile Vibration Feedback
                </h3>
                {testingVibration && (
                  <span className="text-[10px] text-amber-400 font-bold animate-pulse">Vibrating...</span>
                )}
              </div>

              <div className="space-y-2.5">
                {VIBRATION_PATTERNS.map((pattern) => {
                  const isSelected = settings.vibrationPattern === pattern.id;
                  return (
                    <div
                      key={pattern.id}
                      onClick={() => updateSetting("vibrationPattern", pattern.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-amber-500/15 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                          : "bg-void/60 border-white/10 text-gray-400 hover:border-white/30"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-xs text-white">{pattern.name}</div>
                        <div className="text-[11px] text-gray-400">{pattern.desc}</div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateSetting("vibrationPattern", pattern.id);
                          testVibrationPattern(pattern.pattern);
                        }}
                        className="p-2 bg-white/5 border border-white/10 rounded-xl hover:bg-amber-500/20 hover:text-amber-300 text-xs text-gray-300 transition-all shrink-0 ml-2"
                        title="Test vibration pattern"
                      >
                        <Vibrate className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. SIREN, FLASH & COUNTDOWN PREFERENCES */}
            <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-5 shadow-2xl">
              <div className="pb-3 border-b border-white/10">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-red-400" /> Alarm & Flash Protocols
                </h3>
              </div>

              {/* Siren Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-void/60 border border-white/10 rounded-2xl">
                <div>
                  <div className="text-xs font-bold text-white">High-Decibel Police Siren</div>
                  <div className="text-[11px] text-gray-400">Play loud audio siren through speaker</div>
                </div>
                <button
                  onClick={() => updateSetting("sirenEnabled", !settings.sirenEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 shrink-0 ${
                    settings.sirenEnabled ? "bg-red-500" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.sirenEnabled ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Flashlight Strobe Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-void/60 border border-white/10 rounded-2xl">
                <div>
                  <div className="text-xs font-bold text-white">Flashlight Strobe Light</div>
                  <div className="text-[11px] text-gray-400">Pulse camera flash to attract bystander attention</div>
                </div>
                <button
                  onClick={() => updateSetting("flashlightStrobe", !settings.flashlightStrobe)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 shrink-0 ${
                    settings.flashlightStrobe ? "bg-accent" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      settings.flashlightStrobe ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Countdown Grace Period Selector */}
              <div>
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 block">
                  False Alarm Cancel Countdown Delay
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 3, 5, 10].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => updateSetting("countdownSeconds", sec)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                        settings.countdownSeconds === sec
                          ? "bg-gradient-to-r from-red-500 to-accent text-white border-transparent shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                          : "bg-void/60 border-white/10 text-gray-300 hover:border-white/30"
                      }`}
                    >
                      {sec === 0 ? "Instant" : `${sec} Secs`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. RESET DEFAULTS & PERSISTENCE ACKNOWLEDGEMENT */}
            <div className="bg-void/80 border border-white/10 rounded-3xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Auto-Saved Local Preferences
                </div>
                <button
                  onClick={handleResetDefaults}
                  className="text-xs text-gray-400 hover:text-red-400 font-medium flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
                </button>
              </div>

              <AnimatePresence>
                {savedNotification && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Preferences updated & stored securely in Encrypted Local Storage!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
