import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, MapPin, Users } from 'lucide-react';
import { useAuth } from '../AuthContext';

const Hero: React.FC = () => {
  const { signIn, user } = useAuth();

  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-indigo-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100/50 text-indigo-700 rounded-full text-sm font-semibold mb-8 border border-indigo-200/50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>India's First Verified Social Platform</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-[1.1]"
          >
            Stop being lonely in a <span className="text-indigo-600">city of millions.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto"
          >
            Saathi is where young professionals discover trusted, real-world events. 
            Meet real people, build real friendships, and stay safe.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {!user ? (
              <button
                onClick={signIn}
                className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 group"
              >
                Join the waitlist
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <a
                href="#events"
                className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 group"
              >
                Explore Events
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            )}
            <a
              href="#how"
              className="w-full sm:w-auto bg-white text-gray-900 px-8 py-4 rounded-2xl text-lg font-bold border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              See how it works
            </a>
          </motion.div>
        </div>

        {/* Stats/Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {[
            { icon: ShieldCheck, title: '100% Verified', desc: 'Aadhaar + Live Selfie checks' },
            { icon: MapPin, title: 'Hyper-local', desc: 'Discover events within 10km' },
            { icon: Users, title: 'Safe Vibe', desc: 'Gender ratio & age filters' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{stat.title}</h3>
              <p className="text-gray-500 text-sm">{stat.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>
    </section>
  );
};

export default Hero;
