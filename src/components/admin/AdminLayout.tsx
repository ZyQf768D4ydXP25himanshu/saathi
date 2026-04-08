import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut, 
  Shield,
  Menu,
  X,
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { useAuth } from '../../AuthContext';
import { db, collection, query, where, onSnapshot } from '../../firebase';

const AdminLayout: React.FC = () => {
  const { user, signOut, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [pendingHostsCount, setPendingHostsCount] = React.useState(0);

  React.useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, 'users'), where('hostApplicationStatus', '==', 'pending'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPendingHostsCount(snapshot.size);
    });

    return unsubscribe;
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-8">You don't have permission to access the admin panel.</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Calendar, label: 'Events', path: '/admin/events' },
    { icon: CreditCard, label: 'Bookings', path: '/admin/bookings' },
    { icon: Users, label: 'Users', path: '/admin/users', badge: pendingHostsCount },
    { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Admin Panel</span>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all group ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-indigo-600'}`} />
                  <span className="font-bold">{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <div className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isActive ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'}`}>
                    {item.badge}
                  </div>
                ) : isActive ? (
                  <ChevronRight className="w-4 h-4" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-6 px-2">
            <img 
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}`} 
              alt="" 
              className="w-10 h-10 rounded-full border-2 border-indigo-50"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-gray-900 truncate">{user?.displayName}</div>
              <div className="text-xs text-gray-500 truncate">Administrator</div>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-red-600 font-bold hover:bg-red-50 rounded-2xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 px-4 flex items-center justify-between z-[60]">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-indigo-600" />
          <span className="font-bold text-gray-900">Admin</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-gray-50 rounded-xl text-gray-600"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[50]"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            className="w-72 h-full bg-white p-6 pt-20"
            onClick={e => e.stopPropagation()}
          >
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-bold">{item.label}</span>
                    </div>
                    {item.badge && item.badge > 0 && (
                      <div className={`px-2 py-0.5 rounded-full text-[10px] font-black ${isActive ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'}`}>
                        {item.badge}
                      </div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:p-8 p-4 pt-20 lg:pt-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
