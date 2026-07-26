import { motion } from "framer-motion";
import { Shield, Zap, Cpu, Radio, Droplets, Feather } from "lucide-react";

const specs = [
  { icon: Feather, label: "Weight", value: "4.2 Grams", desc: "Featherlight grade-5 titanium alloy" },
  { icon: Droplets, label: "Water Resistance", value: "IP68 / 50m", desc: "Shower, swim & rainproof durability" },
  { icon: Zap, label: "Battery Life", value: "7 Days Active", desc: "Magnetic mag-safe 20 min fast charge" },
  { icon: Cpu, label: "Processor", value: "Tensor-V1 Edge AI", desc: "Ultra-low power neural voice chip" },
  { icon: Radio, label: "Connectivity", value: "Cellular + SatMesh", desc: "Dual redundancy fallback system" },
  { icon: Shield, label: "Biometrics", value: "PPG Stress Pulse", desc: "Real-time panic metric tracking" },
];

export default function TechSpecs() {
  return (
    <section id="specs" className="bg-surface py-28 px-6 md:px-16 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-white mb-4"
          >
            Military Grade Hardware in a <span className="text-accent">Jewelry Form</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg"
          >
            Crafted for maximum comfort, durability, and discreet elegance.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
          {specs.map((spec, i) => (
            <motion.div
              key={spec.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-void/60 border border-white/10 rounded-2xl p-6 hover:border-accent/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4">
                <spec.icon className="w-5 h-5" />
              </div>
              <span className="text-xs uppercase font-bold tracking-wider text-gray-400">{spec.label}</span>
              <div className="text-2xl font-black text-white mt-1 mb-2">{spec.value}</div>
              <p className="text-xs text-gray-400">{spec.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
