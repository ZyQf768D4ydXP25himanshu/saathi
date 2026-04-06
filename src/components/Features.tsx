import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Search, CreditCard, Star, ArrowRight } from 'lucide-react';

const Features: React.FC = () => {
  const steps = [
    {
      icon: ShieldCheck,
      title: 'Aadhaar Verification',
      desc: 'Aadhaar + live selfie AI matching. One account, one real person. No catfishing, no fake profiles.',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Search,
      title: 'Discover Gatherings',
      desc: 'Browse house parties, rooftop meetups, stranger dinners, game nights within 10km. Filter by vibe, budget, and age group.',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: CreditCard,
      title: 'Safe Booking',
      desc: 'Pay online, get a QR entry pass. Share live location with family. SOS button always one tap away.',
      color: 'bg-green-50 text-green-600',
    },
    {
      icon: Star,
      title: 'Trust Score System',
      desc: 'After every event, rate hosts and attendees. Good behavior builds your Trust Score — unlocking better events.',
      color: 'bg-orange-50 text-orange-600',
    },
  ];

  return (
    <section id="how" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold text-gray-900 mb-6"
          >
            From stranger to friend in 3 steps
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Simple, safe, and designed for real human connection — not swiping.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-8 rounded-3xl border border-gray-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50 transition-all group"
            >
              <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <step.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 translate-y-[-50%] z-10">
                  <ArrowRight className="w-6 h-6 text-gray-200" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
