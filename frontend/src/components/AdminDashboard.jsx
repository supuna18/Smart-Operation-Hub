import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { getUser, clearAuth } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredUsers.map((user) => (
                <div key={user.id} className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform duration-700" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-8">
                      <div className="w-20 h-20 rounded-3xl overflow-hidden bg-gray-50 border-2 border-white shadow-md flex-shrink-0 group-hover:rotate-3 transition-transform duration-500">
                        {user.profileImageUrl ? (
                          <img src={user.profileImageUrl} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl font-black text-[#FACC15]">
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        user.authProvider === 'google' 
                          ? 'bg-blue-50 text-blue-600 border-blue-100' 
                          : 'bg-gray-50 text-gray-400 border-gray-100'
                      }`}>
                        {user.authProvider || 'Local'}
                      </div>
                    </div>

                    <div className="mb-8">
                      <h3 className="text-2xl font-black text-[#262626] truncate mb-1">{user.username}</h3>
                      <p className="text-sm text-gray-400 font-bold truncate flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        {user.email}
                      </p>
                    </div>

                    <div className="space-y-6 pt-6 border-t border-gray-50">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Assigned Role</label>
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value)}
                          className="w-full text-sm font-black text-[#262626] bg-gray-50 border-2 border-transparent rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#FACC15] focus:bg-white focus:border-white outline-none cursor-pointer transition-all appearance-none"
                        >
                          <option value="ADMIN">System Admin</option>
                          <option value="STUDENT">Student Member</option>
                          <option value="LECTURER">Academic Staff</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">UID: {user.id?.slice(-12)}</span>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="flex items-center gap-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                          Terminate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
    </div>
  );
};

export default AdminDashboard;


