import { Shield, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-white/10 pt-16 pb-12 px-6 md:px-16 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Col 1 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-white font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-lg font-black text-white">SURAKSHA RING</span>
          </div>
          <p className="text-xs leading-relaxed text-gray-400">
            Empowering modern women through cutting-edge, discreet AI wearable security technology. Supported under National Women Safety Initiatives.
          </p>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Quick Navigation</h4>
          <ul className="space-y-2.5 text-xs">
            <li><a href="#features" className="hover:text-accent transition-colors">Features & Hardware</a></li>
            <li><a href="#flow" className="hover:text-accent transition-colors">Voice Activation Flow</a></li>
            <li><a href="#specs" className="hover:text-accent transition-colors">Tech Specifications</a></li>
            <li><a href="#subsidies" className="hover:text-accent transition-colors">Government Safety Subsidies</a></li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Emergency Support</h4>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-center gap-2 text-rose-400 font-semibold">
              <Phone className="w-3.5 h-3.5" /> Women Helpline: 1091
            </li>
            <li className="flex items-center gap-2 text-amber-400 font-semibold">
              <Phone className="w-3.5 h-3.5" /> Emergency SOS: 112
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" /> support@suraksharing.ai
            </li>
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Certifications</h4>
          <p className="text-xs text-gray-400 mb-3">
            ISO 27001 Encrypted Telemetry • IP68 Titanium Build • CE Certified Safety Hardware.
          </p>
          <div className="text-[11px] text-gray-500">
            Made with pride for global women safety.
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
        <div>© {new Date().getFullYear()} Suraksha Ring AI Inc. All rights reserved.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-gray-300">Privacy Policy</a>
          <a href="#" className="hover:text-gray-300">Terms of Service</a>
          <a href="#" className="hover:text-gray-300">Subsidy Terms</a>
        </div>
      </div>
    </footer>
  );
}
