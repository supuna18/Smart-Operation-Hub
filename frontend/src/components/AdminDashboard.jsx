import React, { useState } from 'react';
import { getUser, clearAuth } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import UserManagement from './admin/UserManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const navigate = useNavigate();
  const currentUser = getUser();

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter">Campus Control</h1>
            <p className="text-gray-400 font-bold uppercase text-xs mt-2 tracking-widest">Admin Dashboard Hub</p>
          </div>
          <button onClick={() => { clearAuth(); navigate('/login'); }} className="p-4 bg-white border rounded-2xl text-red-500 font-bold shadow-sm hover:bg-red-50 transition-all">
            Logout
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
          {['users', 'facilities', 'resources', 'maintenance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-[#262626] text-[#FACC15] shadow-lg shadow-black/20' : 'bg-white text-gray-400 border'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dynamic Content Area */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'users' && <UserManagement />}
          
          {activeTab === 'facilities' && (
            <div className="py-20 text-center bg-white border border-dashed rounded-[3rem] text-gray-300 font-bold uppercase tracking-widest">
              Facilities Management Content (Member 1 Workspace)
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="py-20 text-center bg-white border border-dashed rounded-[3rem] text-gray-300 font-bold uppercase tracking-widest">
              Incident Tickets View (Member 3 Workspace)
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;