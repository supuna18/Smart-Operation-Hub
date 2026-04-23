import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import AddUserModal from './AddUserModal';
import { Search, Plus, Trash2, AlertCircle, RefreshCw, Filter, UserCheck, Settings, Bell, Users } from 'lucide-react';

const ROLE_CFG = {
  ADMIN:      { label: 'Admin', color: '#262626', bg: '#fde047', border: '#facc15' },
  STUDENT:    { label: 'Student', color: '#166534', bg: '#dcfce7', border: '#86efac' },
  LECTURER:   { label: 'Lecturer', color: '#9a3412', bg: '#ffedd5', border: '#fdba74' },
  TECHNICIAN: { label: 'Technician', color: '#1e3a8a', bg: '#dbeafe', border: '#93c5fd' },
};

const UserManagement = () => {
  const [users, setUsers]           = useState([]);
  const [search, setSearch]         = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [modalOpen, setModalOpen]   = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setLoading(true); setError('');
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch {
      setError('Unable to load user data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const updateRole = async (id, role) => {
    try {
      const res = await api.patch(`/users/${id}/role`, { role });
      setUsers(prev => prev.map(u => u.id === id ? res.data : u));
    } catch { alert('Failed to update role.'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Remove this user permanently?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch { alert('Failed to delete user.'); }
    finally { setDeletingId(null); }
  };

  const filtered = users.filter(u => {
    const matchesSearch = u.username?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const userRoleKey = u.role ? u.role.replace('ROLE_', '').toUpperCase() : 'STUDENT';
    const matchesRole = roleFilter === 'All' || userRoleKey === roleFilter;
    return matchesSearch && matchesRole;
  });

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="font-['Poppins'] min-h-screen bg-[#FDFDFD]">

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">

        {/* Dark Banner Card */}
        <div className="bg-[#262626] rounded-2xl sm:rounded-[20px] p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden mb-8 shadow-xl">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-8 bg-[#FACC15] rounded-full"></div>
              <h2 className="text-2xl sm:text-[28px] font-black text-white tracking-wide">Users & <span className="text-[#FACC15]">Directory</span></h2>
            </div>
            <p className="text-gray-400 text-[13px] sm:text-sm font-medium max-w-lg mt-3">
              Manage and optimize campus users from a single, high-performance interface.
            </p>
          </div>
          <button 
            onClick={() => setModalOpen(true)}
            className="relative z-10 w-full md:w-auto shrink-0 bg-[#FACC15] hover:bg-[#eab308] text-[#262626] px-6 py-3.5 sm:py-4 rounded-xl font-black text-[13px] sm:text-sm transition-all focus:ring-4 focus:ring-[#FACC15]/30 flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02]"
          >
            <Plus size={18} strokeWidth={3} /> New User
          </button>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          {/* Search */}
          <div className="relative group border border-gray-200 rounded-xl bg-white shadow-sm transition-all focus-within:border-[#FACC15] focus-within:ring-4 focus-within:ring-[#FACC15]/10 lg:col-span-2">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FACC15]" />
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              className="w-full pl-11 pr-4 py-3.5 bg-transparent text-sm outline-none font-medium text-gray-700 placeholder:text-gray-400" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
          
          {/* Categories/Role Filter */}
          <div className="relative border border-gray-200 rounded-xl bg-white shadow-sm transition-all focus-within:border-[#FACC15] focus-within:ring-4 focus-within:ring-[#FACC15]/10">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
               <Filter size={15} />
            </div>
            <select 
               className="w-full pl-11 pr-4 py-3.5 bg-transparent text-sm outline-none font-bold text-gray-700 appearance-none cursor-pointer"
               value={roleFilter}
               onChange={e => setRoleFilter(e.target.value)}
            >
               <option value="All">All Roles</option>
               <option value="ADMIN">Admin</option>
               <option value="STUDENT">Student</option>
            </select>
          </div>

          <div className="relative border border-gray-200 rounded-xl bg-white shadow-sm opacity-60 pointer-events-none hidden md:block">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
               <Users size={15} />
            </div>
            <div className="w-full pl-11 pr-4 py-3.5 bg-transparent text-sm outline-none font-bold text-gray-700 flex items-center h-full">All Statuses</div>
          </div>
        </div>

        {/* Error / Loading States */}
        {loading && (
          <div className="py-20 flex flex-col items-center">
             <RefreshCw className="animate-spin text-[#FACC15] mb-4" size={32} />
             <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Directory...</p>
          </div>
        )}

        {error && (
          <div className="p-5 bg-red-50 text-red-600 rounded-2xl border border-red-200 flex items-start gap-4 font-medium text-sm shadow-sm">
             <AlertCircle size={24} className="shrink-0 mt-0.5" />
             <div>
                <p className="font-bold text-base mb-1">{error}</p>
                <button onClick={load} className="underline font-bold text-red-500 hover:text-red-700">Try Again</button>
             </div>
          </div>
        )}

        {/* Users Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-24 bg-gray-50 rounded-[20px] border border-dashed border-gray-200">
                 <p className="text-gray-500 font-bold text-[15px]">No users found matching your criteria.</p>
              </div>
            ) : (
              filtered.map(user => {
                const roleKey = user.role ? user.role.replace('ROLE_', '').toUpperCase() : 'STUDENT';
                const isAdmin = roleKey === 'ADMIN';
                const cfg = ROLE_CFG[roleKey] || ROLE_CFG.STUDENT;

                return (
                  <div key={user.id} className="bg-white rounded-[20px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group relative flex flex-col duration-300 hover:-translate-y-1">
                    {/* Top Color strip */}
                    <div className="h-[6px] w-full" style={{ backgroundColor: isAdmin ? '#FACC15' : '#10b981' }}></div>
                    
                    <div className="p-6 flex-1 flex flex-col items-center text-center">
                       {/* Avatar */}
                       <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center font-black text-2xl mb-4 border-4 shadow-sm" style={{ backgroundColor: isAdmin ? '#FACC15' : '#f3f4f6', borderColor: isAdmin ? '#fef08a' : '#e5e7eb', color: isAdmin ? '#262626' : '#6b7280' }}>
                          {user.username?.charAt(0).toUpperCase()}
                       </div>
                       
                       <h3 className="font-black text-gray-800 text-lg leading-tight w-full truncate mb-1" title={user.username}>{user.username}</h3>
                       <p className="text-gray-400 text-[13px] font-semibold w-full truncate mb-6">{user.email}</p>

                       {/* Role selector inside card */}
                       <div className="mt-auto w-full border-t border-gray-100 pt-5 flex items-center justify-between">
                          <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">ROLE</label>
                          <select 
                             value={roleKey}
                             onChange={e => updateRole(user.id, e.target.value)}
                             className="text-xs font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer border shadow-sm"
                             style={{ color: cfg.color, backgroundColor: cfg.bg, borderColor: cfg.border }}
                          >
                             <option value="ADMIN">Admin</option>
                             <option value="STUDENT">Student</option>
                          </select>
                       </div>
                    </div>

                    {/* Delete item */}
                    <button 
                       onClick={() => deleteUser(user.id)}
                       disabled={deletingId === user.id}
                       className="absolute top-4 right-4 p-2 bg-red-50 text-red-500 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-all hover:bg-red-100 hover:scale-110 disabled:opacity-50"
                       title="Remove User"
                    >
                       <Trash2 size={15} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      <AddUserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onUserAdded={u => setUsers(prev => [...prev, u])}
      />
    </div>
  );
};

export default UserManagement;