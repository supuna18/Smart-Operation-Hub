import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const AddUserModal = ({ isOpen, onClose, onUserAdded }) => {
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'STUDENT' });

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative bg-white p-10 rounded-[3rem] w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-black mb-6">Create New Member</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Username" className="w-full p-4 bg-gray-50 rounded-2xl border" onChange={(e) => setNewUser({...newUser, username: e.target.value})} />
              <input type="email" placeholder="Email" className="w-full p-4 bg-gray-50 rounded-2xl border" onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
              <input type="password" placeholder="Password" className="w-full p-4 bg-gray-50 rounded-2xl border" onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
              <select className="w-full p-4 bg-gray-50 rounded-2xl border font-bold" onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                <option value="STUDENT">STUDENT</option>
                <option value="LECTURER">LECTURER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <button className="w-full py-4 bg-[#262626] text-[#FACC15] rounded-2xl font-black">CONFIRM & CREATE</button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddUserModal;