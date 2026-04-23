import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { getUser, setAuthData } from '../utils/auth';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Lock, CheckCircle, AlertCircle } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/me');
      setProfile(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load profile details.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      await api.patch('/users/update-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setSuccess('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-gray-100 border-t-[#FACC15] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-[900px] mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden"
      >
        {/* Profile Header */}
        <div className="bg-[#262626] p-12 text-white relative">
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="w-32 h-32 rounded-3xl bg-[#FACC15] flex items-center justify-center text-4xl font-black text-[#262626] shadow-2xl">
              {profile?.username?.charAt(0).toUpperCase()}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black mb-2">{profile?.username}</h1>
              <div className="flex items-center justify-center md:justify-start gap-4 text-gray-400">
                <span className="bg-white/10 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#FACC15]">
                  {profile?.role}
                </span>
                <span className="text-sm">{profile?.email}</span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 -mr-20 -mt-20 rounded-full blur-3xl"></div>
        </div>

        <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Details Section */}
          <div className="space-y-8">
            <h2 className="text-xl font-black text-[#FACC15] flex items-center gap-3 mb-6">
              <User className="text-[#FACC15]" size={22} />
              Account Details
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100/80">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Full Name</label>
                <p className="font-bold text-[#262626] text-base">{profile?.username}</p>
              </div>

              <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100/80">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">Email Address</label>
                <p className="font-bold text-[#262626] text-base">{profile?.email}</p>
              </div>

              <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100/80">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1.5">System Authority</label>
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-[#FACC15]" />
                  <p className="font-bold text-[#262626] text-base">{profile?.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="space-y-8">
            <h2 className="text-xl font-black text-[#FACC15] flex items-center gap-3 mb-6">
              <Lock className="text-[#FACC15]" size={22} />
              Update Password
            </h2>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}
              {success && (
                <div className="p-4 bg-green-50 text-green-600 rounded-xl text-sm font-bold flex items-center gap-2">
                  <CheckCircle size={18} />
                  {success}
                </div>
              )}

              <div className="space-y-2">
                <input
                  type="password"
                  placeholder="Current Password"
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#FACC15] outline-none transition-all font-medium text-sm shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <input
                  type="password"
                  placeholder="New Password"
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#FACC15] outline-none transition-all font-medium text-sm shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-5 py-3.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#FACC15] outline-none transition-all font-medium text-sm shadow-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#262626] text-[#FACC15] rounded-xl font-black text-sm uppercase tracking-widest hover:shadow-lg transition-all active:scale-[0.98] mt-4"
              >
                Update Security Credentials
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
