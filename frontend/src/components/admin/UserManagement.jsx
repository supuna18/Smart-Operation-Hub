import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import AddUserModal from './AddUserModal';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      setError('Unable to load user data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const updateUserRole = async (id, role) => {
    try {
      const response = await api.patch(`/users/${id}/role`, { role });
      setUsers(users.map(u => u.id === id ? response.data : u));
    } catch (err) { alert('Failed to update role'); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Remove this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) { alert('Failed to delete user'); }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-20 font-bold text-gray-400">LOADING RECORDS...</div>;

  return (
    <div className="space-y-6">
      {/* Search & Actions */}
      <div className="flex justify-between items-center gap-4">
        <input 
          type="text" placeholder="Search users..." 
          className="p-4 bg-white border rounded-2xl w-full max-w-md shadow-sm"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-6 py-4 bg-[#FACC15] font-black rounded-2xl text-sm"
        >
          + ADD USER
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase">User</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase">Email</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase">System Role</th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-b hover:bg-gray-50/50">
                <td className="px-8 py-5 font-bold">{user.username}</td>
                <td className="px-8 py-5 text-gray-500">{user.email}</td>
                <td className="px-8 py-5">
                  <select 
                    value={user.role} 
                    onChange={(e) => updateUserRole(user.id, e.target.value)}
                    className="font-bold text-sm bg-transparent outline-none"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="STUDENT">STUDENT</option>
                    <option value="LECTURER">LECTURER</option>
                    <option value="TECHNICIAN">TECHNICIAN</option>
                  </select>
                </td>
                <td className="px-8 py-5 text-right">
                  <button onClick={() => deleteUser(user.id)} className="text-red-400 hover:text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddUserModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onUserAdded={(u) => setUsers([...users, u])}
      />
    </div>
  );
};

export default UserManagement;