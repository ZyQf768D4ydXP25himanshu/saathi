import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  CreditCard, 
  Download,
  Filter,
  Loader2
} from 'lucide-react';
import { db, collection, getDocs, query, orderBy } from '../../firebase';

const AdminReports: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsSnap = await getDocs(collection(db, 'bookings'));
        const eventsSnap = await getDocs(collection(db, 'events'));
        const usersSnap = await getDocs(collection(db, 'users'));

        // Process Revenue Data (simplified for demo)
        const revenueByMonth = [
          { name: 'Jan', value: 45000 },
          { name: 'Feb', value: 52000 },
          { name: 'Mar', value: 48000 },
          { name: 'Apr', value: 61000 },
          { name: 'May', value: 55000 },
          { name: 'Jun', value: 67000 },
        ];
        setRevenueData(revenueByMonth);

        // Process Category Data
        const categories: Record<string, number> = {};
        eventsSnap.docs.forEach(doc => {
          const cat = doc.data().category || 'Other';
          categories[cat] = (categories[cat] || 0) + 1;
        });
        setCategoryData(Object.entries(categories).map(([name, value]) => ({ name, value })));

        // Process User Growth
        const growth = [
          { name: 'Week 1', users: 120 },
          { name: 'Week 2', users: 250 },
          { name: 'Week 3', users: 480 },
          { name: 'Week 4', users: 890 },
          { name: 'Week 5', users: 1200 },
        ];
        setUserGrowthData(growth);

      } catch (error) {
        console.error('Fetch reports error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-500">Deep dive into platform performance and user behavior.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter Range
          </button>
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">Revenue Trend (INR)</h2>
            <div className="text-emerald-600 font-bold flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              +14.5%
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* User Growth */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-gray-900">User Acquisition</h2>
            <div className="text-indigo-600 font-bold flex items-center gap-1">
              <Users className="w-4 h-4" />
              New Users
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="users" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Event Categories */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-8">Event Distribution</h2>
          <div className="h-80 w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-1/2 space-y-4">
              {categoryData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-sm font-bold text-gray-700">{entry.name}</span>
                  <span className="text-sm text-gray-400 ml-auto">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-6"
        >
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white flex flex-col justify-between">
            <CreditCard className="w-8 h-8 opacity-50" />
            <div>
              <div className="text-sm font-bold opacity-70 uppercase tracking-widest mb-1">Avg. Booking</div>
              <div className="text-3xl font-black">₹1,240</div>
            </div>
          </div>
          <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white flex flex-col justify-between">
            <Calendar className="w-8 h-8 opacity-50" />
            <div>
              <div className="text-sm font-bold opacity-70 uppercase tracking-widest mb-1">Events / Day</div>
              <div className="text-3xl font-black">4.2</div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col justify-between col-span-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">Conversion Rate</div>
              <div className="text-indigo-600 font-bold">8.4%</div>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: '8.4%' }} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminReports;
