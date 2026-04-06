import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  Shield, 
  Bell, 
  CreditCard, 
  Globe, 
  Save,
  Loader2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { db, doc, getDoc, setDoc, Timestamp } from '../../firebase';

interface PlatformSettings {
  platformName: string;
  maintenanceMode: boolean;
  platformFeePercentage: number;
  featuredEventId: string;
  supportEmail: string;
  launchCity: string;
  updatedAt: any;
}

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<PlatformSettings>({
    platformName: 'Saathi',
    maintenanceMode: false,
    platformFeePercentage: 10,
    featuredEventId: '',
    supportEmail: 'hello@saathi.social',
    launchCity: 'Delhi NCR',
    updatedAt: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'platform');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data() as PlatformSettings);
        }
      } catch (error) {
        console.error('Fetch settings error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await setDoc(doc(db, 'settings', 'platform'), {
        ...settings,
        updatedAt: Timestamp.now(),
      });
      setMessage({ type: 'success', text: 'Settings updated successfully!' });
    } catch (error) {
      console.error('Save settings error:', error);
      setMessage({ type: 'error', text: 'Failed to update settings.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-500">Configure global parameters and platform behavior.</p>
      </div>

      {message && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl flex items-center gap-3 ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          <span className="font-bold">{message.text}</span>
        </motion.div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">General Configuration</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Platform Name</label>
              <input 
                type="text" 
                value={settings.platformName}
                onChange={e => setSettings({...settings, platformName: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Support Email</label>
              <input 
                type="email" 
                value={settings.supportEmail}
                onChange={e => setSettings({...settings, supportEmail: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Primary Launch City</label>
              <input 
                type="text" 
                value={settings.launchCity}
                onChange={e => setSettings({...settings, launchCity: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Platform Fee (%)</label>
              <input 
                type="number" 
                value={settings.platformFeePercentage}
                onChange={e => setSettings({...settings, platformFeePercentage: parseInt(e.target.value)})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Security & Maintenance</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl border border-gray-100">
              <div>
                <div className="font-bold text-gray-900">Maintenance Mode</div>
                <div className="text-sm text-gray-500">Disable all public access to the platform.</div>
              </div>
              <button 
                type="button"
                onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                className={`w-14 h-8 rounded-full p-1 transition-all ${settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-300'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-all ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            disabled={saving}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save All Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
