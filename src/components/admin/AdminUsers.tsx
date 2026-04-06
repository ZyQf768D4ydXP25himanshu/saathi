import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  Shield, 
  User, 
  Mail, 
  Calendar, 
  MoreVertical, 
  CheckCircle2, 
  XCircle,
  Loader2,
  Lock,
  Unlock
} from 'lucide-react';
import { db, collection, getDocs, query, orderBy, updateDoc, doc } from '../../firebase';

interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  role: 'user' | 'host' | 'admin';
  isVerified: boolean;
  trustScore: number;
  createdAt: any;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setUsers(snap.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile)));
    } catch (error) {
      console.error('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (uid: string, role: 'user' | 'host' | 'admin') => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${role}?`)) return;
    try {
      await updateDoc(doc(db, 'users', uid), { role });
      fetchUsers();
    } catch (error) {
      console.error('Update role error:', error);
      alert('Failed to update role');
    }
  };

  const toggleVerify = async (uid: string, isVerified: boolean) => {
    try {
      await updateDoc(doc(db, 'users', uid), { isVerified: !isVerified });
      fetchUsers();
    } catch (error) {
      console.error('Toggle verify error:', error);
    }
  };

  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500">Manage user roles, verification, and permissions.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-bold text-sm">
            Total Users: {users.length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-all">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-8 py-4">User Details</th>
                <th className="px-8 py-4">Role</th>
                <th className="px-8 py-4">Verification</th>
                <th className="px-8 py-4">Trust Score</th>
                <th className="px-8 py-4">Joined</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center">
                    <div className="flex items-center justify-center gap-3 text-gray-500">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-gray-50 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                          alt="" 
                          className="w-10 h-10 rounded-full border-2 border-indigo-50"
                        />
                        <div>
                          <div className="font-bold text-gray-900">{user.displayName}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <select 
                        value={user.role}
                        onChange={(e) => updateRole(user.uid, e.target.value as any)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full outline-none transition-all cursor-pointer ${
                          user.role === 'admin' 
                            ? 'bg-indigo-50 text-indigo-600' 
                            : user.role === 'host'
                            ? 'bg-amber-50 text-amber-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <option value="user">User</option>
                        <option value="host">Host</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-8 py-6">
                      <button 
                        onClick={() => toggleVerify(user.uid, user.isVerified)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          user.isVerified 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {user.isVerified ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
                        {user.isVerified ? 'Verified' : 'Unverified'}
                      </button>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              user.trustScore > 80 ? 'bg-emerald-500' : 
                              user.trustScore > 50 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${user.trustScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-600">{user.trustScore}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-500">
                      {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 bg-white border border-gray-100 text-gray-600 rounded-lg hover:bg-gray-100 transition-all">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-gray-500">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
