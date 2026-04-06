import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { db, collection, getDocs, query, limit, orderBy } from '../../firebase';

interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  totalBookings: number;
  totalRevenue: number;
  recentBookings: any[];
  recentEvents: any[];
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
    recentEvents: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const eventsSnap = await getDocs(collection(db, 'events'));
        const bookingsSnap = await getDocs(collection(db, 'bookings'));

        let revenue = 0;
        const bookings = bookingsSnap.docs.map(doc => {
          const data = doc.data();
          if (data.status === 'confirmed') revenue += data.amount;
          return { id: doc.id, ...data };
        });

        const recentEvents = eventsSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        setStats({
          totalUsers: usersSnap.size,
          totalEvents: eventsSnap.size,
          totalBookings: bookingsSnap.size,
          totalRevenue: revenue,
          recentBookings: bookings.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5),
          recentEvents,
        });
      } catch (error) {
        console.error('Dashboard stats error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-50 text-blue-600', trend: '+12%', trendUp: true },
    { label: 'Active Events', value: stats.totalEvents, icon: Calendar, color: 'bg-indigo-50 text-indigo-600', trend: '+5%', trendUp: true },
    { label: 'Total Bookings', value: stats.totalBookings, icon: CreditCard, color: 'bg-emerald-50 text-emerald-600', trend: '+18%', trendUp: true },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: TrendingUp, color: 'bg-amber-50 text-amber-600', trend: '+24%', trendUp: true },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
        </div>
        <button className="bg-white border border-gray-200 px-4 py-2 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Last 30 Days
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${stat.trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.trendUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {stat.trend}
              </div>
            </div>
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">{stat.label}</div>
            <div className="text-3xl font-black text-gray-900">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
            <button className="text-indigo-600 font-bold text-sm hover:underline">View All</button>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recentBookings.length > 0 ? (
              stats.recentBookings.map((booking) => (
                <div key={booking.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                      {booking.userName?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{booking.userName}</div>
                      <div className="text-sm text-gray-500">{booking.eventTitle}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">₹{booking.amount}</div>
                    <div className={`text-xs font-bold px-2 py-1 rounded-full inline-block ${
                      booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {booking.status}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500">No recent bookings found.</div>
            )}
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Recently Created Events</h2>
            <button className="text-indigo-600 font-bold text-sm hover:underline">View All</button>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recentEvents.length > 0 ? (
              stats.recentEvents.map((event) => (
                <div key={event.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{event.title}</div>
                      <div className="text-sm text-gray-500">{event.city} • {new Date(event.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      event.isVerified ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {event.isVerified ? 'Verified' : 'Pending'}
                    </span>
                    <ArrowUpRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500">No recent events found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
