import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { getUser, clearAuth } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'STUDENT' });
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!newUser.username.trim()) errors.username = 'Username is required';
    if (!newUser.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newUser.email)) {
      errors.email = 'Invalid email format';
    }
    if (!newUser.password) {
      errors.password = 'Password is required';
    } else if (newUser.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Unable to load user data. Please ensure you have administrative privileges.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      const response = await api.post('/users', newUser);
      setUsers((current) => [...current, response.data]);
      setIsAddModalOpen(false);
      setNewUser({ username: '', email: '', password: '', role: 'STUDENT' });
      setValidationErrors({});
    } catch (err) {
      console.error(err);
      setError('Failed to create new user. Email might already be in use.');
    }
  };

  const updateUserRole = async (id, role) => {
    try {
      const response = await api.patch(`/users/${id}/role`, { role });
      setUsers((current) => current.map((item) => (item.id === id ? response.data : item)));
    } catch (err) {
      console.error(err);
      setError('Failed to update user role.');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to remove this user from the system?')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to remove user.');
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentUser = getUser();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-[#262626] tracking-tight">User Management</h1>
            <p className="text-gray-500 mt-2 font-medium">Overview and control of all registered campus members</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 bg-white p-3 pr-6 rounded-[2rem] shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-[#FACC15] flex items-center justify-center font-bold text-[#262626] text-xl shadow-inner">
                {currentUser?.username?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800 leading-tight">{currentUser?.username || 'Admin'}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">System Administrator</p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="p-4 bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl border border-gray-100 transition-all shadow-sm"
              title="Sign Out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-2xl font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            {error}
          </div>
        )}

        {/* Search and Stats Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="relative flex-grow max-w-xl group">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FACC15] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
            <input
              type="text"
              placeholder="Filter users by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 rounded-[1.5rem] border border-gray-100 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FACC15] focus:border-transparent transition-all placeholder:text-gray-300 font-medium"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="px-8 py-4 bg-white rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col items-center min-w-[120px]">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Registered</span>
              <span className="text-2xl font-black text-[#262626]">{users.length}</span>
            </div>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-4 bg-[#FACC15] text-[#262626] rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:shadow-lg hover:shadow-[#FACC15]/20 transition-all active:scale-95 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Add User
            </button>
            <button 
              onClick={fetchUsers}
              className="p-4 bg-[#262626] text-[#FACC15] rounded-[1.5rem] hover:shadow-lg hover:shadow-black/20 transition-all active:scale-95"
              title="Refresh Data"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="w-16 h-16 border-4 border-gray-100 border-t-[#FACC15] rounded-full animate-spin mb-6"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Retrieving Member Records...</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">User</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Auth</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">System Role</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#FACC15]/10 flex items-center justify-center font-bold text-[#FACC15]">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold text-[#262626]">{user.username}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-sm text-gray-500 font-medium">{user.email}</td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            user.authProvider === 'google' 
                              ? 'bg-blue-50 text-blue-600 border-blue-100' 
                              : 'bg-gray-50 text-gray-400 border-gray-100'
                          }`}>
                            {user.authProvider || 'Local'}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <select
                            value={user.role}
                            onChange={(e) => updateUserRole(user.id, e.target.value)}
                            className="bg-transparent text-sm font-bold text-[#262626] focus:outline-none cursor-pointer hover:text-[#FACC15] transition-colors"
                          >
                            <option value="ADMIN">ADMIN</option>
                            <option value="STUDENT">STUDENT</option>
                            <option value="LECTURER">LECTURER</option>
                            <option value="TECHNICIAN">TECHNICIAN</option>
                          </select>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete User"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-40 bg-white rounded-[3rem] border border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-200"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                </div>
                <p className="text-gray-400 font-bold uppercase tracking-widest">No matching records found</p>
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-[#FACC15] font-black text-sm uppercase tracking-widest hover:underline"
                >
                  Clear search filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-[#262626]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-black text-[#262626]">Add New User</h2>
                  <button 
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>

                <form onSubmit={handleAddUser} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                    <input
                      type="text"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 outline-none transition-all font-medium ${validationErrors.username ? 'border-red-500' : 'border-transparent focus:bg-white focus:border-[#FACC15]'}`}
                      placeholder="Enter full name"
                    />
                    {validationErrors.username && <p className="text-red-500 text-[10px] font-bold ml-1">{validationErrors.username}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 outline-none transition-all font-medium ${validationErrors.email ? 'border-red-500' : 'border-transparent focus:bg-white focus:border-[#FACC15]'}`}
                      placeholder="email@campus.com"
                    />
                    {validationErrors.email && <p className="text-red-500 text-[10px] font-bold ml-1">{validationErrors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Default Password</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className={`w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 outline-none transition-all font-medium ${validationErrors.password ? 'border-red-500' : 'border-transparent focus:bg-white focus:border-[#FACC15]'}`}
                      placeholder="••••••••"
                    />
                    {validationErrors.password && <p className="text-red-500 text-[10px] font-bold ml-1">{validationErrors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">System Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#FACC15] outline-none transition-all font-bold appearance-none cursor-pointer"
                    >
                      <option value="STUDENT">Student Member</option>
                      <option value="LECTURER">Academic Staff</option>
                      <option value="TECHNICIAN">Technician</option>
                      <option value="ADMIN">System Administrator</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-5 bg-[#262626] text-[#FACC15] rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-black/10 hover:shadow-black/20 hover:-translate-y-1 transition-all active:scale-95 mt-4"
                  >
                    Confirm & Create User
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;


