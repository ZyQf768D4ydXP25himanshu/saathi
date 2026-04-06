import React from 'react';
import { AuthProvider } from './AuthContext';
import ErrorBoundary from './ErrorBoundary';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Events from './components/Events';
import Safety from './components/Safety';
import Waitlist from './components/Waitlist';
import Footer from './components/Footer';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
          <Navbar />
          <main>
            <Hero />
            <Features />
            <Events />
            <Safety />
            <Waitlist />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}
