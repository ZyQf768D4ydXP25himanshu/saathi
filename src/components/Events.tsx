import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, Users, ShieldCheck, ArrowRight, X, CreditCard, Loader2 } from 'lucide-react';
import { db, collection, getDocs, query, limit, onSnapshot } from '../firebase';
import { useAuth } from '../AuthContext';
import { loadStripe } from '@stripe/stripe-js';

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
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

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
  ];

  const handleBookNow = async (event: Event) => {
    if (!user) {
      signIn();
      return;
    }

    setBookingLoading(true);
    try {
      const stripePublishableKey = (import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY;
      
      // Fallback for demo if keys are missing
      if (!stripePublishableKey || stripePublishableKey === "pk_test_...") {
        console.warn("Stripe keys missing. Using Demo/UPI mode.");
        
        // Simulate a UPI/Paytm payment flow for the demo
        setTimeout(() => {
          const confirmPayment = window.confirm(
            `Demo Mode: Pay ₹${event.budget} via UPI/Paytm?\n\nIn a real app, this would open the Paytm/UPI app or show a QR code.`
          );
          if (confirmPayment) {
            alert("Payment Successful! Your booking is confirmed.");
            setSelectedEvent(null);
          }
          setBookingLoading(false);
        }, 1500);
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

      const result = await (stripe as any).redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      alert(`Booking failed: ${error.message}`);
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'events'), limit(6));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const fetchedEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
        setEvents(fetchedEvents);
      } else {
        setEvents(sampleEvents);
      }
      setLoading(false);
    }, (error) => {
      console.error('Events listener error:', error);
      setEvents(sampleEvents);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <section id="events" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, i) => (
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
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => handleBookNow(selectedEvent)}
                          disabled={bookingLoading}
                          className="flex-1 bg-indigo-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {bookingLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <CreditCard className="w-5 h-5" />
                          )}
                          Pay with Card
                        </button>
                        <button
                          onClick={() => handleBookNow(selectedEvent)}
                          disabled={bookingLoading}
                          className="flex-1 bg-white text-gray-900 border border-gray-200 px-6 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {bookingLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <img src="https://www.vectorlogo.zone/logos/paytm/paytm-icon.svg" className="w-5 h-5" alt="Paytm" />
                          )}
                          UPI / Paytm
                        </button>
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
    </section>
  );
};

export default Events;
