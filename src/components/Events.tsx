import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, Users, ShieldCheck, ArrowRight, X, CreditCard, Loader2, Shield, Search, Filter } from 'lucide-react';
import { db, collection, getDocs, query, limit, onSnapshot, addDoc, Timestamp } from '../firebase';
import { useAuth } from '../AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import VerificationFlow from './VerificationFlow';

interface Event {
  id: string;
  title: string;
  description: string;
  hostName: string;
  hostUid?: string;
  date: string;
  location: string;
  city: string;
  category: string;
  budget: number;
  maxAttendees: number;
  attendees: string[];
  isVerified: boolean;
}

const Events: React.FC = () => {
  const { user, signIn } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [pendingBookingEvent, setPendingBookingEvent] = useState<Event | null>(null);
  const [showCancel, setShowCancel] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Networking', 'Social', 'Dinner', 'Workshops', 'Sports', 'Clubbing'];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('booking') === 'cancel') {
      setShowCancel(true);
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Sample data for initial display
  const sampleEvents: Event[] = [
    {
      id: '1',
      title: 'Cyber Hub Networking Mixer',
      description: 'Join us for a high-impact networking evening at the heart of Gurgaon. Connect with founders, techies, and creatives from the NCR region.',
      hostName: 'Arjun V.',
      hostUid: 'host1',
      date: '2026-04-12T18:30:00Z',
      location: 'Cyber Hub',
      city: 'Gurgaon',
      category: 'Networking',
      budget: 800,
      maxAttendees: 25,
      attendees: [],
      isVerified: true,
    },
    {
      id: '2',
      title: 'Hauz Khas Board Game Night',
      description: 'A cozy evening of strategy games and great food in the artistic lanes of Hauz Khas Village. Perfect for meeting new people over a game of Catan.',
      hostName: 'Megha S.',
      hostUid: 'host2',
      date: '2026-04-15T19:00:00Z',
      location: 'Hauz Khas Village',
      city: 'Delhi',
      category: 'Social',
      budget: 450,
      maxAttendees: 15,
      attendees: [],
      isVerified: true,
    },
    {
      id: '3',
      title: 'Stranger Dinner: Noida Edition',
      description: 'An exclusive dinner with 5 strangers curated for meaningful conversations. No small talk, just deep connections over a 3-course meal.',
      hostName: 'Saathi Official',
      hostUid: 'host3',
      date: '2026-04-18T20:00:00Z',
      location: 'Sector 18',
      city: 'Noida',
      category: 'Dinner',
      budget: 1500,
      maxAttendees: 6,
      attendees: [],
      isVerified: true,
    },
    {
      id: '4',
      title: 'Privee: Saturday Night Fever',
      description: 'Experience the ultimate luxury nightlife at Privee. Top DJs, premium drinks, and an electric atmosphere. Entry includes one complimentary drink.',
      hostName: 'Nightlife Delhi',
      hostUid: 'host4',
      date: '2026-04-11T22:00:00Z',
      location: 'Shangri-La Eros',
      city: 'Delhi',
      category: 'Clubbing',
      budget: 2500,
      maxAttendees: 50,
      attendees: [],
      isVerified: true,
    },
    {
      id: '5',
      title: 'Soho: Techno Takeover',
      description: 'Dive into the underground techno scene at Soho. A night dedicated to pure beats and immersive lighting. Strictly for techno lovers.',
      hostName: 'Vibe Check',
      hostUid: 'host5',
      date: '2026-04-17T21:30:00Z',
      location: 'Chanakyapuri',
      city: 'Delhi',
      category: 'Clubbing',
      budget: 1800,
      maxAttendees: 40,
      attendees: [],
      isVerified: true,
    },
    {
      id: '6',
      title: 'Kitty Su: Neon Glow Party',
      description: 'The boldest party in town is back! Wear your brightest neon and get ready to glow under the UV lights. Best dressed wins a surprise gift.',
      hostName: 'The Lalit',
      hostUid: 'host6',
      date: '2026-04-24T22:30:00Z',
      location: 'Barakhamba Road',
      city: 'Delhi',
      category: 'Clubbing',
      budget: 2000,
      maxAttendees: 60,
      attendees: [],
      isVerified: true,
    },
  ];

  const handleBookNow = async (event: Event) => {
    if (!user) {
      signIn();
      return;
    }

    setPendingBookingEvent(event);
    setIsVerifying(true);
  };

  const proceedToPayment = async () => {
    const event = pendingBookingEvent;
    if (!event || !user) return;

    setIsVerifying(false);
    setIsRedirecting(true);
    setBookingLoading(true);
    try {
      const stripePublishableKey = (import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY;
      
      // Fallback for demo if keys are missing
      if (!stripePublishableKey || stripePublishableKey === "pk_test_...") {
        console.warn("Stripe keys missing. Redirecting to Simulated Gateway.");
        
        // Simulate a redirect to a custom gateway page
        setTimeout(() => {
          setIsRedirecting(false);
          setBookingLoading(false);
          // In a real app, this would be navigate('/simulated-gateway')
          const choice = window.confirm(
            `SECURE GATEWAY REDIRECT\n\nChoose Payment Method:\n1. UPI (Paytm/PhonePe/GPay)\n2. Credit/Debit Card\n3. Netbanking\n\nClick OK to simulate a successful UPI payment.`
          );
          if (choice) {
            handleDemoBooking(event);
          }
        }, 2000);
        return;
      }

      const stripe = await loadStripe(stripePublishableKey);
      if (!stripe) throw new Error("Stripe failed to load.");

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          title: event.title,
          budget: event.budget,
          userEmail: user.email,
        }),
      });

      const session = await response.json();
      if (session.error) throw new Error(session.error);

      // Redirect to Stripe's secure hosted page
      const result = await (stripe as any).redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      alert(`Payment Gateway Error: ${error.message}`);
      setIsRedirecting(false);
      setBookingLoading(false);
    }
  };

  const handleDemoBooking = async (event: Event) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'bookings'), {
        eventId: event.id,
        eventTitle: event.title,
        userUid: user.uid,
        userEmail: user.email,
        userName: user.displayName,
        amount: event.budget,
        status: 'confirmed',
        paymentMethod: 'UPI/Simulated',
        createdAt: Timestamp.now(),
      });
      alert("Payment Successful! Your booking is confirmed.");
      setSelectedEvent(null);
    } catch (error) {
      console.error("Booking save error:", error);
      alert("Payment successful but failed to record booking.");
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'events'), limit(20));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let fetchedEvents: Event[] = [];
      if (!snapshot.empty) {
        fetchedEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
      } else {
        fetchedEvents = sampleEvents;
      }
      setEvents(fetchedEvents);
      setFilteredEvents(fetchedEvents);
      setLoading(false);
    }, (error) => {
      console.error('Events listener error:', error);
      setEvents(sampleEvents);
      setFilteredEvents(sampleEvents);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'All' || event.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredEvents(filtered);
  }, [searchTerm, activeCategory, events]);

  return (
    <section id="events" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence>
          {showCancel && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-6 bg-red-500 text-white rounded-[2rem] shadow-lg shadow-red-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <X className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-lg">Payment Cancelled</div>
                  <div className="text-sm opacity-90">Your booking was not completed. You can try again whenever you're ready.</div>
                </div>
              </div>
              <button 
                onClick={() => setShowCancel(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-extrabold text-gray-900 mb-6"
            >
              What's happening near you
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600"
            >
              Every event is hosted by a verified organizer. Every attendee is a real, identity-checked person.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-bold text-gray-900">Delhi NCR</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <div className="mb-12 space-y-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search by event title, location, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-[2rem] shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-lg transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedEvent(event)}
              className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer"
            >
              <div className="relative h-48 bg-gray-200 overflow-hidden">
                <img
                  src={`https://picsum.photos/seed/${event.id}/800/600`}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-indigo-600 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Host
                </div>
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-indigo-600 rounded-full text-xs font-bold text-white">
                  {event.category}
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">
                  {event.title}
                </h3>
                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${event.hostUid || event.id}`} alt="" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{event.hostName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-900 font-bold">
                    <span className="text-sm">₹</span>
                    <span>{event.budget}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Event Detail Modal */}
        <AnimatePresence>
          {selectedEvent && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl relative"
              >
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-6 right-6 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-900 hover:bg-white transition-colors z-10"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="h-64 relative">
                  <img
                    src={`https://picsum.photos/seed/${selectedEvent.id}/1200/800`}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-8">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full">
                        {selectedEvent.category}
                      </span>
                      <span className="px-3 py-1 bg-white/90 text-indigo-600 text-xs font-bold rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Verified Event
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-white">{selectedEvent.title}</h2>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Date & Time</div>
                        <div className="text-sm font-bold text-gray-900">
                          {new Date(selectedEvent.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Location</div>
                        <div className="text-sm font-bold text-gray-900">{selectedEvent.location}, {selectedEvent.city}</div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed mb-8">
                    {selectedEvent.description}
                  </p>

                  <div className="flex flex-col gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Price per person</div>
                        <div className="text-2xl font-black text-gray-900">₹{selectedEvent.budget}</div>
                      </div>
                      <div className="flex flex-col gap-3 w-full">
                        <button
                          onClick={() => handleBookNow(selectedEvent)}
                          disabled={bookingLoading}
                          className="w-full bg-indigo-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                          {bookingLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <CreditCard className="w-5 h-5" />
                          )}
                          Pay with Card / Google Pay
                        </button>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => handleBookNow(selectedEvent)}
                            disabled={bookingLoading}
                            className="bg-white text-gray-900 border border-gray-200 px-6 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            <img src="https://www.vectorlogo.zone/logos/paytm/paytm-icon.svg" className="w-5 h-5" alt="Paytm" />
                            UPI / Paytm
                          </button>
                          <button
                            onClick={() => handleBookNow(selectedEvent)}
                            disabled={bookingLoading}
                            className="bg-white text-gray-900 border border-gray-200 px-6 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            <img src="https://www.vectorlogo.zone/logos/paypal/paypal-icon.svg" className="w-5 h-5" alt="PayPal" />
                            PayPal
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {!(import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY || (import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY === "pk_test_..." ? (
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                        <p className="text-xs text-amber-800 text-center font-medium">
                          ⚠️ Payment Keys Missing: Please add VITE_STRIPE_PUBLISHABLE_KEY and STRIPE_SECRET_KEY to Settings &gt; Secrets to enable real payments.
                        </p>
                      </div>
                    ) : (
                      <p className="text-[10px] text-gray-400 text-center">
                        Securely processed by Stripe. Supports Card, UPI, and Netbanking.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <button className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:gap-3 transition-all">
            View all events in Delhi NCR
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {isRedirecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-white/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-8"
          >
            <div className="w-24 h-24 bg-orange-50 rounded-[2.5rem] flex items-center justify-center mb-8 relative">
              <Shield className="w-12 h-12 text-orange-600" />
              <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-[2.5rem] animate-spin" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">Redirecting to Secure Gateway</h2>
            <p className="text-gray-500 max-w-sm">
              Please do not refresh the page. We are connecting you to our secure payment partner to complete your booking for <span className="font-bold text-gray-900">"{pendingBookingEvent?.title}"</span>.
            </p>
            <div className="mt-12 flex items-center gap-8 opacity-50 grayscale">
              <img src="https://www.vectorlogo.zone/logos/stripe/stripe-ar21.svg" className="h-8" alt="Stripe" />
              <img src="https://www.vectorlogo.zone/logos/paytm/paytm-ar21.svg" className="h-8" alt="Paytm" />
              <img src="https://www.vectorlogo.zone/logos/google_pay/google_pay-ar21.svg" className="h-8" alt="GPay" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <VerificationFlow 
        isOpen={isVerifying}
        onClose={() => setIsVerifying(false)}
        onComplete={proceedToPayment}
        eventTitle={pendingBookingEvent?.title || ''}
      />
    </section>
  );
};

export default Events;
