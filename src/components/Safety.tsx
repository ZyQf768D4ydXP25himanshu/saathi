import React from 'react';
import { motion } from 'motion/react';
import { Shield, AlertCircle, MapPin, Heart, Lock, UserCheck } from 'lucide-react';

const Safety: React.FC = () => {
  const safetyFeatures = [
    {
      icon: UserCheck,
      title: 'Identity Verification',
      desc: 'Aadhaar + live selfie AI matching. One account per real person. Criminals permanently blocked.',
    },
    {
      icon: AlertCircle,
      title: 'One-Tap SOS',
      desc: 'Instantly alerts police (112), emergency contacts with live GPS, and our 24/7 safety team.',
    },
    {
      icon: MapPin,
      title: 'Live Location Sharing',
      desc: 'Share real-time location with trusted contacts during the event. Geo-fence alerts if you move unexpectedly.',
    },
    {
      icon: Heart,
      title: 'Women Safety Suite',
      desc: 'Shake-to-Alert, buddy system, women-only events, gender ratio filters, secret exit code words.',
    },
    {
      icon: Star,
      title: 'Trust Score System',
      desc: '0–100 score per user. Good behavior unlocks better events. Bad behavior means bans.',
    },
    {
      icon: Lock,
      title: 'Accountability Tiers',
      desc: 'Rude behavior → warning. Harassment → 7-day ban. Assault → permanent ban + auto FIR filed.',
    },
  ];

  return (
    <section id="safety" className="py-24 bg-gray-900 text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-full text-sm font-semibold mb-6 border border-indigo-500/30"
          >
            <Shield className="w-4 h-4" />
            <span>Safety First</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold mb-6"
          >
            6 layers of protection — not an afterthought
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Every feature is designed around one belief: if women trust it, everyone trusts it.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {safetyFeatures.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/50 transition-all group"
            >
              <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-30">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
      </div>
    </section>
  );
};

const Star = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

export default Safety;
