import { motion } from "framer-motion";
import { Mic, MessageCircle, MapPinned, ShieldHalf, Cpu, BatteryCharging, WifiOff, HeartPulse } from "lucide-react";

const features = [
  { 
    icon: Mic, 
    title: "Voice Activation", 
    desc: "Custom wake-word detection with ultra-fast on-device neural AI recognition.",
    tag: "Sub-0.3s Latency"
  },
  { 
    icon: MessageCircle, 
    title: "Instant Alerts", 
    desc: "Automated distress SMS & WhatsApp broadcasts to pre-selected trusted contacts.",
    tag: "Auto-Dispatch"
  },
  { 
    icon: MapPinned, 
    title: "Location Sharing", 
    desc: "Real-time precision GPS tracking shared with guardians and emergency services.",
    tag: "Live Telemetry"
  },
  { 
    icon: ShieldHalf, 
    title: "Police Connect", 
    desc: "Encrypted direct alert transmission to nearest police station dispatch desks.",
    tag: "Government Backed"
  },
  { 
    icon: WifiOff, 
    title: "Offline Mesh Protocol", 
    desc: "Operates even without cellular connectivity via low-frequency mesh relays.",
    tag: "100% Reliable"
  },
  { 
    icon: BatteryCharging, 
    title: "7-Day Battery Life", 
    desc: "Mag-safe fast magnetic charging providing a full week of continuous protection.",
    tag: "Fast Charging"
  },
  { 
    icon: HeartPulse, 
    title: "Panic Heartbeat Sensor", 
    desc: "Built-in PPG biometrics monitor sudden heart-rate spikes during traumatic stress.",
    tag: "Biometric AI"
  },
  { 
    icon: Cpu, 
    title: "Waterproof IP68", 
    desc: "Crafted with aerospace-grade titanium casing, waterproof up to 50 meters deep.",
    tag: "Titanium Build"
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-void py-28 px-6 md:px-16 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-4"
          >
            Engineered for <span className="text-accent">Uncompromising Safety</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            Cutting-edge military-grade technology seamlessly integrated into an elegant daily wearable ring.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -8, borderColor: "rgba(224,86,253,0.6)" }}
              className="bg-surface/60 backdrop-blur border border-white/10 rounded-2xl p-6 cursor-pointer flex flex-col justify-between group hover:shadow-[0_10px_30px_rgba(224,86,253,0.15)] transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -6 }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent2 to-accent flex items-center justify-center shadow-[0_0_20px_rgba(224,86,253,0.4)]"
                  >
                    <f.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-accent">
                    {f.tag}
                  </span>
                </div>
                
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-accent transition-colors">
                  {f.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
