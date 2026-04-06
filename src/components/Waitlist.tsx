import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, MapPin, Mail } from 'lucide-react';
import { db, collection, setDoc, doc, Timestamp, handleFirestoreError, OperationType } from '../firebase';

const Waitlist: React.FC = () => {
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Delhi NCR');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !city) return;

    setStatus('loading');
    try {
      const waitlistRef = doc(db, 'waitlist', email.toLowerCase());
      await setDoc(waitlistRef, {
        email: email.toLowerCase(),
        city,
        createdAt: Timestamp.now(),
      });
      setStatus('success');
      setEmail('');
    } catch (error) {
      console.error('Waitlist error:', error);
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
      // handleFirestoreError(error, OperationType.WRITE, 'waitlist');
    }
  };

  return (
    <section id="waitlist" className="py-24 bg-indigo-600 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="p-10 md:p-12 flex-1">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Be first in your city.</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Join the waitlist — launching in Delhi NCR first. We'll reach out when we launch in your city.
            </p>

            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-50 border border-green-100 p-6 rounded-2xl flex items-center gap-4"
              >
                <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-green-900">You're on the list!</h3>
                  <p className="text-green-700 text-sm">We'll reach out soon with your invite.</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none appearance-none"
                  >
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Pune">Pune</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? 'Joining...' : 'Join the waitlist'}
                  <Send className="w-5 h-5" />
                </button>
                {status === 'error' && (
                  <p className="text-red-600 text-sm font-medium text-center">{errorMessage}</p>
                )}
              </form>
            )}
          </div>
          <div className="hidden md:block w-72 bg-indigo-50 p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" />
                <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <div className="relative z-10 h-full flex flex-col justify-center text-indigo-600">
              <div className="text-4xl font-black mb-2">500+</div>
              <div className="text-sm font-bold uppercase tracking-widest opacity-70">Already Joined</div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export default Waitlist;
