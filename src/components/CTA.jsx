import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Heart, Sparkles } from "lucide-react";

export default function CTA({ onOpenPreOrder }) {
  return (
    <section className="relative bg-void py-32 px-6 text-center overflow-hidden border-t border-white/10">
      <motion.div
        className="absolute w-[500px] h-[500px] bg-accent/20 rounded-full blur-[140px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-bold uppercase tracking-widest mb-6"
        >
          <Sparkles className="w-4 h-4" /> Limited Early Edition Batch
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight"
        >
          Wear your safety. <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">Speak it.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Join thousands of early adopters securing complete peace of mind for themselves and their loved ones. Eligible for government safety scheme subsidies.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.06, boxShadow: "0 0 50px rgba(224,86,253,0.7)" }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpenPreOrder}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-accent2 to-accent text-white font-bold text-lg px-10 py-4 rounded-full shadow-[0_0_30px_rgba(224,86,253,0.4)]"
          >
            Reserve your Suraksha Ring <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400 border-t border-white/10 pt-8 max-w-xl mx-auto">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> 2-Year Warranty Included
          </span>
          <span className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" /> 30-Day Money Back Guarantee
          </span>
        </div>
      </div>
    </section>
  );
}
