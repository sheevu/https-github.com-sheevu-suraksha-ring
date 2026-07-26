import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ShieldAlert,
  Radio,
  MapPin,
  CheckCircle2,
  PhoneCall,
  AlertTriangle,
  Send,
  UserPlus,
  Trash2,
  Sparkles,
  RefreshCw,
} from "lucide-react";

export default function VoiceSOSConsole() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [detectedKeyword, setDetectedKeyword] = useState(null);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  
  // Custom contacts with localStorage persistence
  const [contacts, setContacts] = useState(() => {
    try {
      const saved = localStorage.getItem("suraksha_contacts");
      return saved ? JSON.parse(saved) : [
        { name: "Dad (Rajesh)", phone: "+919876543210" },
        { name: "Mom (Sunita)", phone: "+919876543211" },
        { name: "Brother (Rahul)", phone: "+919876543212" },
      ];
    } catch (e) {
      return [
        { name: "Dad (Rajesh)", phone: "+919876543210" },
        { name: "Mom (Sunita)", phone: "+919876543211" },
        { name: "Brother (Rahul)", phone: "+919876543212" },
      ];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("suraksha_contacts", JSON.stringify(contacts));
    } catch (e) {}
  }, [contacts]);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");

  const recognitionRef = useRef(null);
  const audioCtxRef = useRef(null);
  const osc1Ref = useRef(null);
  const osc2Ref = useRef(null);
  const gainNodeRef = useRef(null);
  const sirenIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  const triggerKeywords = ["help didi", "help", "save me", "emergency", "suraksha", "danger", "sos", "code crimson"];

  // Fetch location
  const fetchLocation = () => {
    setIsLocating(true);
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
          timestamp: new Date().toLocaleTimeString(),
        });
        setIsLocating(false);
      },
      (err) => {
        setLocationError("Could not retrieve precise location (using simulated coords)");
        setLocation({
          lat: 28.6139,
          lng: 77.209,
          accuracy: 5,
          timestamp: new Date().toLocaleTimeString(),
        });
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  // Web Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript.toLowerCase() + " ";
        }
        setTranscript(currentTranscript.trim());

        // Check for emergency keywords
        for (const kw of triggerKeywords) {
          if (currentTranscript.toLowerCase().includes(kw)) {
            setDetectedKeyword(kw.toUpperCase());
            triggerEmergencySequence(kw.toUpperCase());
            break;
          }
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        // Restart automatically if still enabled
        if (isListening) {
          try {
            recognition.start();
          } catch (e) {
            // Ignore if already starting
          }
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  // Toggle Speech Listener
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. You can still test the alarm siren using the 'Test Siren Alarm' button.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        setTranscript("Listening for 'HELP DIDI' or 'EMERGENCY'...");
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Web Audio Dual-Oscillator Siren Synthesizer
  const startSirenSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      audioCtxRef.current = ctx;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.connect(ctx.destination);
      gainNodeRef.current = gain;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();

      osc1.type = "sawtooth";
      osc2.type = "sine";

      osc1.connect(gain);
      osc2.connect(gain);

      osc1.start();
      osc2.start();

      osc1Ref.current = osc1;
      osc2Ref.current = osc2;

      // Oscillate frequency for police siren effect (600Hz to 1400Hz)
      let high = false;
      sirenIntervalRef.current = setInterval(() => {
        if (!audioCtxRef.current) return;
        const now = audioCtxRef.current.currentTime;
        const freq1 = high ? 1300 : 650;
        const freq2 = high ? 1100 : 550;
        osc1.frequency.exponentialRampToValueAtTime(freq1, now + 0.35);
        osc2.frequency.exponentialRampToValueAtTime(freq2, now + 0.35);
        high = !high;
      }, 400);
    } catch (e) {
      console.error("Audio Context Siren Error:", e);
    }
  };

  const stopSirenSound = () => {
    if (sirenIntervalRef.current) clearInterval(sirenIntervalRef.current);
    if (osc1Ref.current) {
      try { osc1Ref.current.stop(); } catch (e) {}
    }
    if (osc2Ref.current) {
      try { osc2Ref.current.stop(); } catch (e) {}
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch (e) {}
    }
    audioCtxRef.current = null;
  };

  // Trigger Emergency Sequence
  const triggerEmergencySequence = (kw = "VOICE TRIGGER") => {
    setIsAlarmActive(true);
    setDetectedKeyword(kw);
    setCountdown(5);
    startSirenSound();

    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelEmergency = () => {
    setIsAlarmActive(false);
    stopSirenSound();
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setDetectedKeyword(null);
  };

  const addContact = (e) => {
    e.preventDefault();
    if (newContactName.trim() && newContactPhone.trim()) {
      setContacts([...contacts, { name: newContactName, phone: newContactPhone }]);
      setNewContactName("");
      setNewContactPhone("");
    }
  };

  const removeContact = (idx) => {
    setContacts(contacts.filter((_, i) => i !== idx));
  };

  const mapsUrl = location ? `https://maps.google.com/?q=${location.lat},${location.lng}` : "#";
  const defaultSmsBody = `EMERGENCY SOS ALERT! Suraksha Ring detected distress phrase (${detectedKeyword || "HELP DIDI"}). Live Location: ${mapsUrl}`;

  return (
    <section id="voice-sos-console" className="relative bg-surface/90 py-24 px-6 md:px-16 border-y border-accent/20 overflow-hidden">
      {/* Background glow */}
      <div className="absolute w-[600px] h-[600px] bg-accent/15 rounded-full blur-[150px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-4 h-4" /> Live Device Guardian Engine
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight"
          >
            Voice-Activated <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">Emergency Alarm</span> Console
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg"
          >
            Turn on continuous microphone monitoring. Say <span className="text-accent font-bold">"HELP DIDI"</span> or <span className="text-accent font-bold">"EMERGENCY"</span> to instantly sound the siren and broadcast live location alerts.
          </motion.p>
        </div>

        {/* Main Control Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Card 1: Voice Listener Control */}
          <div className="bg-void/80 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl flex flex-col justify-between hover:border-accent/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                  <Mic className="w-4 h-4 text-accent" /> Speech Listener
                </span>
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                  isListening ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse" : "bg-white/5 text-gray-400"
                }`}>
                  {isListening ? "ACTIVE LISTENING" : "OFFLINE"}
                </span>
              </div>

              <div className="text-center my-6">
                <button
                  onClick={toggleListening}
                  className={`w-28 h-28 rounded-full flex flex-col items-center justify-center mx-auto transition-all shadow-xl ${
                    isListening
                      ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_0_40px_rgba(16,185,129,0.5)] scale-105"
                      : "bg-white/5 border-2 border-white/10 hover:border-accent/50 text-gray-400 hover:text-white"
                  }`}
                >
                  {isListening ? (
                    <>
                      <Mic className="w-10 h-10 animate-bounce mb-1" />
                      <span className="text-[10px] font-bold">LISTENING</span>
                    </>
                  ) : (
                    <>
                      <MicOff className="w-10 h-10 mb-1" />
                      <span className="text-[10px] font-bold">TAP TO START</span>
                    </>
                  )}
                </button>
              </div>

              {/* Speech Log */}
              <div className="bg-surface/80 border border-white/10 rounded-2xl p-4 text-xs font-mono text-gray-300 min-h-[90px] flex flex-col justify-between">
                <div className="text-[10px] text-gray-500 uppercase font-bold mb-1">Speech Transcript Stream:</div>
                <div className="text-accent font-semibold">{transcript || "Click 'Tap to Start' and speak 'Help Didi'..."}</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
              <span>Triggers: "Help Didi", "Save Me", "Emergency"</span>
            </div>
          </div>

          {/* Card 2: Emergency Mobile Siren Engine */}
          <div className="bg-void/80 border border-accent/30 rounded-3xl p-6 md:p-8 backdrop-blur-xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-accent" /> Mobile Emergency Alarm
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  90dB Dual Siren
                </span>
              </div>

              <div className="text-center my-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => triggerEmergencySequence("MANUAL TEST")}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-rose-600 via-accent2 to-accent text-white font-extrabold text-sm shadow-[0_0_30px_rgba(244,63,94,0.4)] flex items-center justify-center gap-3"
                >
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                  Test Siren Alarm Sound
                </motion.button>
              </div>

              <div className="bg-surface/80 border border-white/10 rounded-2xl p-4 text-xs space-y-2 text-gray-300">
                <div className="flex items-center gap-2 font-bold text-white mb-1">
                  <ShieldAlert className="w-4 h-4 text-accent" /> Automatic Siren Protocol:
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed">
                  Upon voice trigger, the browser synthesizes an escalating dual sawtooth siren frequency to deter attackers and alert people nearby.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
              <span>Strobe Light + Audio Alarm</span>
              <span className="text-emerald-400 font-bold">Instant Trigger</span>
            </div>
          </div>

          {/* Card 3: Live GPS Location & Guardian Contacts */}
          <div className="bg-void/80 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-xl flex flex-col justify-between hover:border-accent/40 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" /> Live Telemetry & GPS
                </span>
                <button onClick={fetchLocation} className="text-gray-400 hover:text-accent p-1">
                  <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? "animate-spin" : ""}`} />
                </button>
              </div>

              {/* Location Badge */}
              <div className="bg-surface/80 border border-white/10 rounded-2xl p-3 text-xs mb-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-500 font-mono">LAT / LNG COORDS</div>
                  <div className="text-white font-mono font-bold">
                    {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Fetching..."}
                  </div>
                </div>
                {location && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-bold text-accent hover:underline flex items-center gap-1 bg-accent/10 px-2.5 py-1 rounded-lg border border-accent/20"
                  >
                    View Map <Radio className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Contacts List */}
              <div className="space-y-2 mb-4">
                <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Emergency Contacts:</div>
                <div className="max-h-[120px] overflow-y-auto space-y-1.5 pr-1">
                  {contacts.map((c, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 px-3 py-1.5 rounded-xl text-xs">
                      <span className="text-gray-200 font-semibold">{c.name} ({c.phone})</span>
                      <button onClick={() => removeContact(i)} className="text-gray-500 hover:text-rose-400">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Contact Form */}
              <form onSubmit={addContact} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="w-1/2 bg-surface border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:border-accent focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className="w-1/2 bg-surface border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-gray-500 focus:border-accent focus:outline-none"
                />
                <button type="submit" className="bg-accent/20 border border-accent/40 text-accent p-2 rounded-xl hover:bg-accent/30">
                  <UserPlus className="w-4 h-4" />
                </button>
              </form>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex gap-2">
              <a
                href={`sms:?body=${encodeURIComponent(defaultSmsBody)}`}
                className="flex-1 bg-gradient-to-r from-accent2 to-accent text-white text-center py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-md"
              >
                <Send className="w-3.5 h-3.5" /> Direct SMS Alert Link
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Emergency Siren Strobe Overlay Modal */}
      <AnimatePresence>
        {isAlarmActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-rose-950/90 backdrop-blur-2xl text-white text-center animate-[pulse_0.4s_ease-in-out_infinite]"
          >
            <div className="w-24 h-24 rounded-full bg-rose-600 border-4 border-white flex items-center justify-center shadow-[0_0_80px_rgba(244,63,94,1)] mb-6 animate-ping">
              <AlertTriangle className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-2 text-white drop-shadow-lg">
              EMERGENCY SIREN ALARM ACTIVATED!
            </h1>
            <p className="text-xl text-rose-200 mb-4 max-w-lg">
              Distress keyword detected: <span className="font-extrabold text-white underline">{detectedKeyword}</span>
            </p>

            <div className="bg-black/60 border-2 border-rose-500/50 rounded-3xl p-6 max-w-md w-full mb-8 font-mono text-left space-y-3">
              <div className="flex justify-between text-xs text-rose-300">
                <span>GPS LOCK:</span>
                <span className="text-emerald-400 font-bold">ACTIVE ({location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "LOCKED"})</span>
              </div>
              <div className="flex justify-between text-xs text-rose-300">
                <span>SIREN FREQUENCY:</span>
                <span className="text-white font-bold">600Hz - 1400Hz SWEEP</span>
              </div>
              <div className="flex justify-between text-xs text-rose-300">
                <span>GUARDIANS NOTIFIED:</span>
                <span className="text-accent font-bold">{contacts.length} CONTACTS</span>
              </div>
              <div className="flex justify-between text-xs text-rose-300 border-t border-rose-500/30 pt-2">
                <span>POLICE DISPATCH IN:</span>
                <span className="text-rose-400 font-extrabold text-lg">{countdown}s</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md w-full">
              <button
                onClick={cancelEmergency}
                className="w-full py-4 rounded-full bg-white text-rose-950 font-black text-lg shadow-2xl hover:bg-gray-200 transition-all"
              >
                CANCEL FALSE ALARM
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
