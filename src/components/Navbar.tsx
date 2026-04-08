import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Shield, User, LogOut, Menu, X, LayoutDashboard, Search, Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const Navbar: React.FC = () => {
  const { user, signIn, signOut, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Discover', href: '#events' },
    { name: 'How it works', href: '#how' },
    { name: 'Safety', href: '#safety' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tighter">Saathi</span>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden lg:block relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search events, cities..." 
                className="pl-11 pr-4 py-2.5 bg-gray-50 border border-transparent rounded-2xl text-sm w-64 focus:w-80 focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-50 outline-none transition-all"
                onFocus={() => {
                  const eventsSection = document.getElementById('events');
                  if (eventsSection) eventsSection.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-1 mr-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {user ? (
              <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
                <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                </button>
                
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-all"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="text-sm font-bold">Admin</span>
                  </Link>
                )}

                <Link 
                  to="/profile"
                  className="flex items-center gap-3 p-1.5 pr-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-gray-100 transition-all group"
                >
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                    alt="" 
                    className="w-8 h-8 rounded-xl object-cover shadow-sm" 
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-gray-900 leading-none mb-0.5">{user.displayName?.split(' ')[0]}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">Profile</span>
                  </div>
                </Link>

                <button
                  onClick={signOut}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={signIn}
                className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
              >
                Join Waitlist
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
            >
              <Search className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden px-4 pb-4 bg-white border-b border-gray-100"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search events, cities..." 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl text-lg font-bold text-gray-900 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                >
                  {link.name}
                  <Shield className="w-5 h-5 opacity-20" />
                </a>
              ))}
              <div className="pt-4 border-t border-gray-100">
                {user ? (
                  <div className="flex flex-col gap-4">
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-4 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100"
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link 
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl"
                    >
                      <div className="flex items-center gap-3">
                        <img src={user.photoURL || ''} alt="" className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <div className="font-black text-gray-900">{user.displayName}</div>
                          <div className="text-xs text-gray-500">View Profile</div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          signOut();
                        }}
                        className="p-3 bg-red-50 text-red-600 rounded-xl"
                      >
                        <LogOut className="w-6 h-6" />
                      </button>
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={signIn}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-indigo-100"
                  >
                    Join Waitlist
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
