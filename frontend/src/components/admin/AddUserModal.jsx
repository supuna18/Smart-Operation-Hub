import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, User, Mail, Lock, Shield, Check } from 'lucide-react';
import api from '../../utils/api';

const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'STUDENT' });

  // Reset form when modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setNewUser({ username: '', email: '', password: '', role: 'STUDENT' });
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users', newUser);
      onUserAdded(res.data);
      onClose();
    } catch (err) { alert('Failed to add user'); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-['Poppins']">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
          />
          
          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 10 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white w-full max-w-[500px] flex flex-col overflow-hidden shadow-2xl"
            style={{ borderRadius: '12px' }}
          >
            {/* Dark Header */}
            <div className="bg-[#262626] px-6 py-5 flex items-center justify-between border-b border-[#3f3f3f]">
              <div className="flex items-center gap-3">
                <div className="bg-[#FACC15] w-8 h-8 rounded-md flex items-center justify-center shrink-0">
                  <Plus size={20} className="text-[#262626]" strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-bold text-white tracking-wide">Add New User</h2>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Username */}
                <div>
                  <label className="flex items-center gap-2 mb-2 text-[13px] font-bold text-slate-700">
                    <User size={14} className="text-[#eab308]" /> Username
                  </label>
                  <input 
                    type="text" 
                    required
                    value={newUser.username}
                    placeholder="E.g. John Doe" 
                    className="w-full px-4 py-2.5 bg-white text-sm text-gray-800 rounded-lg border border-gray-300 outline-none focus:border-[#FACC15] focus:ring-[3px] focus:ring-[#FACC15]/20 transition-all placeholder:text-gray-400 font-medium" 
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})} 
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 mb-2 text-[13px] font-bold text-slate-700">
                    <Mail size={14} className="text-[#eab308]" /> Email Address
                  </label>
                  <input 
                    type="email" 
                    required
                    value={newUser.email}
                    placeholder="E.g. john@example.com" 
                    className="w-full px-4 py-2.5 bg-white text-sm text-gray-800 rounded-lg border border-gray-300 outline-none focus:border-[#FACC15] focus:ring-[3px] focus:ring-[#FACC15]/20 transition-all placeholder:text-gray-400 font-medium" 
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})} 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Role */}
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-[13px] font-bold text-slate-700">
                      <Shield size={14} className="text-[#eab308]" /> Role
                    </label>
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-2.5 bg-white text-sm text-gray-800 rounded-lg border border-gray-300 outline-none focus:border-[#FACC15] focus:ring-[3px] focus:ring-[#FACC15]/20 transition-all font-medium appearance-none" 
                        onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                        value={newUser.role}
                      >
                        <option value="STUDENT">Student</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="flex items-center gap-2 mb-2 text-[13px] font-bold text-slate-700">
                      <Lock size={14} className="text-[#eab308]" /> Password
                    </label>
                    <input 
                      type="password" 
                      required
                      value={newUser.password}
                      placeholder="••••••••" 
                      className="w-full px-4 py-2.5 bg-white text-sm text-gray-800 rounded-lg border border-gray-300 outline-none focus:border-[#FACC15] focus:ring-[3px] focus:ring-[#FACC15]/20 transition-all placeholder:text-gray-400 font-medium" 
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})} 
                    />
                  </div>
                </div>

                {/* Horizontal divider */}
                <div className="pt-3">
                  <div className="border-t border-gray-100 mb-6" />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <button 
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 px-4 bg-white border border-gray-300 text-slate-700 rounded-lg font-bold text-sm hover:bg-gray-50 focus:outline-none focus:ring-[3px] focus:ring-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 px-4 bg-[#FACC15] text-[#262626] rounded-lg font-bold text-sm hover:bg-[#eab308] focus:outline-none focus:ring-[3px] focus:ring-[#FACC15]/40 transition-all flex items-center justify-center gap-2"
                  >
                    <Check size={16} strokeWidth={2.5} /> Save User
                  </button>
                </div>

              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddUserModal;