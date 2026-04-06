import React from 'react';
import { Shield, Instagram, Twitter, Linkedin, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">Saathi</span>
            </div>
            <p className="text-gray-500 leading-relaxed">
              India's first verified social gathering platform. Discover trusted, real-world events in your city.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Company</h4>
            <ul className="space-y-4">
              <li><a href="#how" className="text-gray-500 hover:text-indigo-600 transition-colors">How it works</a></li>
              <li><a href="#safety" className="text-gray-500 hover:text-indigo-600 transition-colors">Safety</a></li>
              <li><a href="#events" className="text-gray-500 hover:text-indigo-600 transition-colors">Events</a></li>
              <li><a href="#waitlist" className="text-gray-500 hover:text-indigo-600 transition-colors">Join Waitlist</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-500">
                <Mail className="w-5 h-5 text-indigo-600" />
                <span>hello@saathi.social</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <span>Delhi NCR, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} Saathi. All rights reserved.
          </div>
          <div className="text-sm font-medium text-gray-500">
            Founded by <span className="text-gray-900">Himanshu Shukla</span> & Co-founded by <span className="text-gray-900">Aman Saxena</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
