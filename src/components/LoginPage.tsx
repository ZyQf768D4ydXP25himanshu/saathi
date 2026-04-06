import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowRight, Loader2, CheckCircle2, Mail, Lock, User as UserIcon } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { user, loading, signIn, isAdmin } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  // If already logged in, redirect to appropriate page
  if (user && !loading) {
    const from = (location.state as any)?.from?.pathname || (isAdmin ? '/admin' : '/');
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side: Branding & Info */}
      <div className="lg:w-1/2 bg-indigo-600 p-8 lg:p-20 flex flex-col justify-between relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-400/20 rounded-full blur-3xl" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl">
            <Shield className="w-7 h-7 text-indigo-600" />
          </div>
          <span className="text-3xl font-black text-white tracking-tighter">Saathi</span>
        </motion.div>

        <div className="relative z-10 mt-20 lg:mt-0">
          <motion.h1 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl lg:text-7xl font-black text-white leading-[1.1] mb-8"
          >
            Real people.<br />
            Real trust.<br />
            <span className="text-indigo-200">Real social.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-indigo-100 text-xl max-w-md leading-relaxed"
          >
            Join India's first verified social gathering platform. Connect with trusted individuals in Delhi NCR.
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 mt-12 lg:mt-0 flex items-center gap-6"
        >
          <div className="flex -space-x-4">
            {[1, 2, 3, 4].map((i) => (
              <img 
                key={i}
                src={`https://i.pravatar.cc/150?u=${i + 10}`} 
                className="w-12 h-12 rounded-full border-4 border-indigo-600 shadow-lg"
                alt=""
              />
            ))}
          </div>
          <div className="text-white">
            <div className="font-bold">5,000+ Members</div>
            <div className="text-sm opacity-70">Verified & Active</div>
          </div>
        </motion.div>
      </div>

      {/* Right Side: Login Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-20 bg-gray-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white p-10 lg:p-12 rounded-[3rem] shadow-2xl shadow-indigo-100/50 border border-gray-100">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-gray-900 mb-3">Welcome to Saathi</h2>
              <p className="text-gray-500">Sign in to discover verified events nearby.</p>
            </div>

            <div className="space-y-6">
              <button
                onClick={signIn}
                disabled={loading}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full group relative flex items-center justify-center gap-4 bg-white border-2 border-gray-100 py-4 px-6 rounded-2xl font-bold text-gray-700 hover:border-indigo-600 hover:bg-indigo-50/30 transition-all duration-300"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                ) : (
                  <>
                    <img src="https://www.vectorlogo.zone/logos/google/google-icon.svg" className="w-6 h-6" alt="Google" />
                    <span>Continue with Google</span>
                    <motion.div
                      animate={{ x: isHovered ? 5 : 0 }}
                      className="ml-auto"
                    >
                      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-600" />
                    </motion.div>
                  </>
                )}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold text-gray-400 bg-white px-4">
                  Trust & Safety First
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">Aadhaar Verification</div>
                    <div className="text-xs text-gray-500">Mandatory for all hosts and attendees.</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                    <Shield className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">Safe Spaces</div>
                    <div className="text-xs text-gray-500">Zero tolerance for harassment or spam.</div>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-10 text-center text-xs text-gray-400 leading-relaxed">
              By continuing, you agree to Saathi's <br />
              <a href="#" className="underline hover:text-indigo-600">Terms of Service</a> and <a href="#" className="underline hover:text-indigo-600">Privacy Policy</a>.
            </p>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Are you a host? <a href="#" className="font-bold text-indigo-600 hover:underline">Apply for verification</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
