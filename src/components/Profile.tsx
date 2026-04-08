import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Shield, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Camera, 
  Upload, 
  Check,
  ChevronRight,
  Star,
  Calendar,
  CreditCard,
  Loader2,
  X
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { db, doc, updateDoc, onSnapshot, collection, query, where, getDocs, addDoc, Timestamp } from '../firebase';
import { useLocation, useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isApplyingHost, setIsApplyingHost] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!user) return;

    const params = new URLSearchParams(location.search);
    if (params.get('booking') === 'success' && params.get('eventId')) {
      setShowSuccess(true);
      // In a real app, we'd verify the sessionId here via backend
      // For now, we'll record the booking if it doesn't exist
      const recordBooking = async () => {
        const eventId = params.get('eventId');
        const q = query(collection(db, 'bookings'), 
          where('userUid', '==', user.uid), 
          where('eventId', '==', eventId)
        );
        const existing = await getDocs(q);
        
        if (existing.empty) {
          await addDoc(collection(db, 'bookings'), {
            eventId,
            eventTitle: 'Event Booking', // We could fetch the real title
            userUid: user.uid,
            userEmail: user.email,
            userName: user.displayName,
            status: 'confirmed',
            paymentMethod: 'Stripe',
            createdAt: Timestamp.now(),
          });
        }
        // Clean up URL
        navigate('/profile', { replace: true });
      };
      recordBooking();
    }

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      if (doc.exists()) {
        setUserData(doc.data());
      }
      setLoading(false);
    });

    const fetchBookings = async () => {
      const q = query(collection(db, 'bookings'), where('userUid', '==', user.uid));
      const snap = await getDocs(q);
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchBookings();

    return unsubscribe;
  }, [user]);

  const handleVerifyIdentity = async () => {
    if (!user) return;
    setIsVerifying(true);
    // Simulate Aadhaar/ID verification process
    setTimeout(async () => {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          verificationStatus: 'pending',
          verificationRequestedAt: new Date()
        });
        alert("Identity verification request submitted! Our team will review your Aadhaar/ID within 24 hours.");
      } catch (error) {
        console.error("Verification error:", error);
      } finally {
        setIsVerifying(false);
      }
    }, 1500);
  };

  const handleApplyHost = async () => {
    if (!user) return;
    setIsApplyingHost(true);
    setTimeout(async () => {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          hostApplicationStatus: 'pending',
          hostApplicationAt: new Date()
        });
        alert("Host application submitted! We'll review your profile and get back to you.");
      } catch (error) {
        console.error("Host application error:", error);
      } finally {
        setIsApplyingHost(false);
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-6 bg-emerald-500 text-white rounded-[2rem] shadow-lg shadow-emerald-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-lg">Booking Confirmed!</div>
                  <div className="text-sm opacity-90">Your payment was successful. See you at the event!</div>
                </div>
              </div>
              <button 
                onClick={() => setShowSuccess(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile Header */}
        <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-100 shadow-lg">
                <img 
                  src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}`} 
                  alt={user?.displayName || ''} 
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 transition-all">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-3xl font-black text-gray-900">{user?.displayName}</h1>
                {userData?.isVerified && (
                  <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Member
                  </div>
                )}
                {userData?.role === 'host' && (
                  <div className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-full flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    Verified Host
                  </div>
                )}
              </div>
              <p className="text-gray-500 mb-6">{user?.email}</p>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <div className="text-2xl font-black text-gray-900">{bookings.length}</div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Bookings</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <div className="text-2xl font-black text-orange-600">{userData?.trustScore || 50}</div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Trust Score</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl text-center">
                  <div className="text-2xl font-black text-gray-900">0</div>
                  <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Hosted</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Verification Card */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Trust & Verification</h2>
              </div>

              {!userData?.isVerified ? (
                <div className="space-y-6">
                  <p className="text-gray-600">
                    To maintain a safe community, all Saathi members must verify their identity using a government-issued ID (Aadhaar, PAN, or Passport).
                  </p>
                  
                  {userData?.verificationStatus === 'pending' ? (
                    <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-center gap-4">
                      <Clock className="w-8 h-8 text-amber-600" />
                      <div>
                        <div className="font-bold text-amber-900">Verification Pending</div>
                        <div className="text-sm text-amber-700">We're reviewing your documents. This usually takes 24 hours.</div>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={handleVerifyIdentity}
                      disabled={isVerifying}
                      className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold hover:bg-orange-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-orange-100 disabled:opacity-50"
                    >
                      {isVerifying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                      Verify My Identity
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center gap-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  <div>
                    <div className="font-bold text-emerald-900">Identity Verified</div>
                    <div className="text-sm text-emerald-700">Your account is fully verified. You can now host and attend all events.</div>
                  </div>
                </div>
              )}
            </div>

            {/* Host Application Card */}
            {userData?.role !== 'host' && (
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Become a Host</h2>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Love organizing events? Apply to become a verified host and start creating your own social gatherings on Saathi.
                </p>

                {userData?.hostApplicationStatus === 'pending' ? (
                  <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 flex items-center gap-4">
                    <Clock className="w-8 h-8 text-indigo-600" />
                    <div>
                      <div className="font-bold text-indigo-900">Application Under Review</div>
                      <div className="text-sm text-indigo-700">We're reviewing your host application. We'll notify you soon.</div>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={handleApplyHost}
                    disabled={isApplyingHost || !userData?.isVerified}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-100 disabled:opacity-50"
                  >
                    {isApplyingHost ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                    Apply to Host Events
                  </button>
                )}
                {!userData?.isVerified && (
                  <p className="mt-4 text-xs text-red-500 text-center font-bold">
                    * You must verify your identity before applying to be a host.
                  </p>
                )}
              </div>
            )}

            {/* Recent Bookings */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">My Bookings</h2>
              {bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <Calendar className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{booking.eventTitle}</div>
                          <div className="text-xs text-gray-500">₹{booking.amount} • {new Date(booking.createdAt?.toDate()).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                        Confirmed
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-400 font-medium">No bookings yet. Discover events to get started!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Stats & Security */}
          <div className="space-y-8">
            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white">
              <h3 className="text-lg font-bold mb-6">Security Checklist</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Email Verified</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Identity Verified</span>
                  {userData?.isVerified ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertCircle className="w-5 h-5 text-orange-500" />}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Profile Complete</span>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Trust Level</div>
                <div className="text-2xl font-black text-orange-500 mb-2">{userData?.trustScore || 50}%</div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full" style={{ width: `${userData?.trustScore || 50}%` }} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
              <p className="text-sm text-gray-500 mb-6">Our support team is available 24/7 to help you with verification or bookings.</p>
              <button className="w-full py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                Contact Support
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
