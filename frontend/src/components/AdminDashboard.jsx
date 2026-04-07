import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { getUser, clearAuth } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import sliitImage from '../assets/SLIIT.jpeg';
import { FiPlus, FiTrash2, FiActivity, FiBox, FiLayers, FiInfo, FiTrendingUp } from 'react-icons/fi';

const RESOURCE_TYPES = [
  'Lecture Hall', 'Laboratory', 'Equipment', 'Study Area', 'Lounge', 'Sports Facility', 'Other'
];

const RESOURCE_STATUS_OPTIONS = [
  'ACTIVE', 'MAINTENANCE'
];

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [resources, setResources] = useState([]);
  const [safetyReports, setSafetyReports] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [facilityDraft, setFacilityDraft] = useState({ name: '', description: '', location: '', capacity: '' });
  const [resourceDraft, setResourceDraft] = useState({ name: '', type: '', quantity: '', status: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadAll = async () => {
    try {
      const [usersResponse, facilitiesResponse, resourcesResponse, safetyResponse, bookingsResponse, analyticsResponse] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/facilities'),
        api.get('/admin/resources'),
        api.get('/admin/safety/reports'),
        api.get('/resources/bookings/all'),
        api.get('/admin/analytics'),
      ]);

      setUsers(usersResponse.data);
      setFacilities(facilitiesResponse.data);
      setResources(resourcesResponse.data);
      setSafetyReports(safetyResponse.data);
      setBookings(bookingsResponse.data);
      setAnalytics(analyticsResponse.data);
    } catch (err) {
      setError('Unable to load admin data. Please make sure you are logged in as an admin.');
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const updateUserRole = async (id, role) => {
    try {
      const response = await api.put(`/admin/users/${id}`, { role });
      setUsers((current) => current.map((item) => (item.id === id ? response.data : item)));
    } catch (err) {
      setError('Failed to update user role.');
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError('Failed to remove user.');
    }
  };

  const createFacility = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/facilities', {
        ...facilityDraft,
        capacity: Number(facilityDraft.capacity),
      });
      setFacilities((current) => [...current, response.data]);
      setFacilityDraft({ name: '', description: '', location: '', capacity: '' });
    } catch (err) {
      setError('Failed to create facility.');
    }
  };

  const createResource = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/admin/resources', {
        ...resourceDraft,
        quantity: Number(resourceDraft.quantity),
      });
      setResources((current) => [...current, response.data]);
      setResourceDraft({ name: '', type: '', quantity: '', status: '' });
    } catch (err) {
      setError('Failed to create resource.');
    }
  };

  const deleteFacility = async (id) => {
    try {
      await api.delete(`/admin/facilities/${id}`);
      setFacilities((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError('Failed to delete facility.');
    }
  };

  const deleteResource = async (id) => {
    try {
      await api.delete(`/admin/resources/${id}`);
      setResources((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError('Failed to delete resource.');
    }
  };

  const updateSafetyStatus = async (id, status) => {
    try {
      const response = await api.put(`/admin/safety/reports/${id}/status`, { status });
      setSafetyReports((current) => current.map((item) => (item.id === id ? response.data : item)));
    } catch (err) {
      setError('Failed to update report status.');
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const response = await api.put(`/resources/bookings/${id}/status?status=${status}`);
      setBookings((current) => current.map((item) => (item.id === id ? response.data : item)));
    } catch (err) {
      setError('Failed to update booking status.');
    }
  };

  const currentUser = getUser();

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 md:px-10">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold text-[#262626]">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage users, facilities, and campus resources.</p>
            <p className="text-gray-500 mt-1 text-sm">Signed in as {currentUser?.username || 'Admin'} ({currentUser?.email})</p>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-full bg-[#FACC15] px-6 py-3 font-semibold text-[#262626] transition hover:bg-yellow-300"
          >
            Sign Out
          </button>
        </div>

        {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">{error}</div>}

        <div className="flex flex-wrap gap-3 mb-10">
          {['users', 'facilities', 'resources', 'bookings', 'safety', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 rounded-full font-semibold transition ${activeTab === tab ? 'bg-[#262626] text-[#FACC15]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {tab === 'safety' ? 'Safety Approvals' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'users' && (
          <div>
            <div className="overflow-x-auto rounded-3xl border border-gray-200">
              <table className="min-w-full bg-white">
                <thead className="bg-[#FACC15]/15 text-left text-sm uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{user.username}</td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-gray-600">
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value)}
                          className="rounded-xl border border-gray-200 px-3 py-2 text-sm"
                        >
                          <option value="Admin">Admin</option>
                          <option value="Student">Student</option>
                          <option value="Lecturer">Lecturer</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'facilities' && (
          <div className="space-y-8">
            <form onSubmit={createFacility} className="grid gap-4 md:grid-cols-2">
              <input
                value={facilityDraft.name}
                onChange={(e) => setFacilityDraft({ ...facilityDraft, name: e.target.value })}
                placeholder="Facility name"
                className="rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3"
                required
              />
              <input
                value={facilityDraft.location}
                onChange={(e) => setFacilityDraft({ ...facilityDraft, location: e.target.value })}
                placeholder="Location"
                className="rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3"
                required
              />
              <input
                value={facilityDraft.capacity}
                onChange={(e) => setFacilityDraft({ ...facilityDraft, capacity: e.target.value })}
                placeholder="Capacity"
                type="number"
                className="rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3"
                required
              />
              <textarea
                value={facilityDraft.description}
                onChange={(e) => setFacilityDraft({ ...facilityDraft, description: e.target.value })}
                placeholder="Description"
                className="col-span-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3"
                rows={3}
                required
              />
              <button
                type="submit"
                className="col-span-full rounded-3xl bg-[#262626] py-3 text-center font-semibold text-[#FACC15] hover:bg-gray-900"
              >
                Add Facility
              </button>
            </form>

            <div className="overflow-x-auto rounded-3xl border border-gray-200">
              <table className="min-w-full bg-white">
                <thead className="bg-[#FACC15]/15 text-left text-sm uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Capacity</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {facilities.map((facility) => (
                    <tr key={facility.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{facility.name}</td>
                      <td className="px-6 py-4 text-gray-600">{facility.location}</td>
                      <td className="px-6 py-4 text-gray-600">{facility.capacity}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => deleteFacility(facility.id)}
                          className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative h-64 w-full rounded-[2.5rem] overflow-hidden shadow-2xl flex items-center group">
              <img 
                src={sliitImage} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                alt="SLIIT Campus" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#262626]/90 via-[#262626]/40 to-transparent" />
              <div className="relative z-10 p-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FACC15] text-[#262626] text-[10px] font-black uppercase tracking-widest mb-4">
                  <FiTrendingUp /> Asset Monitoring
                </div>
                <h2 className="text-4xl font-black text-[#FACC15] tracking-tight">Resource Management</h2>
                <p className="text-white/80 max-w-md mt-2 font-medium">Control campus assets, track quantities, and update status in real-time.</p>
              </div>
            </div>

            {/* Redesigned Form */}
            <div className="bg-[#262626] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <h3 className="text-2xl font-black text-[#FACC15] flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl bg-[#FACC15] text-[#262626] flex items-center justify-center">
                      <FiPlus size={20} className="stroke-[3px]" />
                    </span>
                    Register New Asset
                  </h3>
                </div>
              </div>
              
              <form onSubmit={createResource} className="grid gap-6 md:grid-cols-2 relative z-10">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#FACC15] uppercase tracking-widest ml-1">Asset Name</label>
                  <input
                    value={resourceDraft.name}
                    onChange={(e) => setResourceDraft({ ...resourceDraft, name: e.target.value })}
                    placeholder="e.g. Modern Equipment"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white focus:ring-2 focus:ring-[#FACC15] outline-none transition-all placeholder:text-white/20"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#FACC15] uppercase tracking-widest ml-1">Asset Type</label>
                  <select
                    value={resourceDraft.type}
                    onChange={(e) => setResourceDraft({ ...resourceDraft, type: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-[#333] px-6 py-4 text-white focus:ring-2 focus:ring-[#FACC15] outline-none transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled className="bg-[#262626]">Select Type</option>
                    {RESOURCE_TYPES.map(type => (
                      <option key={type} value={type} className="bg-[#262626]">{type}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#FACC15] uppercase tracking-widest ml-1">Total Quantity</label>
                  <input
                    value={resourceDraft.quantity}
                    onChange={(e) => setResourceDraft({ ...resourceDraft, quantity: e.target.value })}
                    placeholder="00"
                    type="number"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white focus:ring-2 focus:ring-[#FACC15] outline-none transition-all placeholder:text-white/20"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#FACC15] uppercase tracking-widest ml-1">Availability Status</label>
                  <select
                    value={resourceDraft.status}
                    onChange={(e) => setResourceDraft({ ...resourceDraft, status: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-[#333] px-6 py-4 text-white focus:ring-2 focus:ring-[#FACC15] outline-none transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="" disabled className="bg-[#262626]">Select Status</option>
                    {RESOURCE_STATUS_OPTIONS.map(status => (
                      <option key={status} value={status} className="bg-[#262626] font-bold">{status}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="col-span-full rounded-2xl bg-[#FACC15] py-4 text-center font-black text-[#262626] hover:bg-yellow-300 transition-all shadow-lg shadow-[#FACC15]/20 hover:shadow-[#FACC15]/40 hover:-translate-y-0.5 active:translate-y-0"
                >
                  ADD ASSET TO INVENTORY
                </button>
              </form>
            </div>

            {/* Custom Visual Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((item) => (
                <div key={item.id} className="group relative bg-white border border-gray-100 rounded-[2.5rem] p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border-b-4 border-b-[#FACC15]">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 text-[#262626] flex items-center justify-center group-hover:bg-[#FACC15] transition-colors">
                      <FiBox size={24} />
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${
                      item.status?.toUpperCase() === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.status || 'Unknown'}
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-xl font-black text-[#262626] leading-tight mb-1">{item.name}</h4>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <FiLayers /> {item.type}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">In Stock</span>
                      <span className="text-2xl font-black text-[#262626]">{item.quantity}</span>
                    </div>
                    <button
                      onClick={() => deleteResource(item.id)}
                      className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors"
                      title="Delete Asset"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {resources.length === 0 && (
                <div className="col-span-full py-20 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
                  <FiInfo className="mx-auto mb-4 text-gray-300" size={48} />
                  <p className="text-xl font-bold text-gray-400">Inventory is currently empty.</p>
                </div>
              )}
            </div>
          </div>
        )}
        {activeTab === 'bookings' && (
          <div>
            <div className="overflow-x-auto rounded-3xl border border-gray-200">
              <table className="min-w-full bg-white">
                <thead className="bg-[#FACC15]/15 text-left text-sm uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Resource</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{booking.username}</td>
                      <td className="px-6 py-4 text-gray-600">{booking.resourceName}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          booking.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                          booking.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'APPROVED')}
                          className="text-xs font-bold text-green-600 hover:underline"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'REJECTED')}
                          className="text-xs font-bold text-red-600 hover:underline"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-gray-400">No resource bookings found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'safety' && (
          <div>
            <div className="overflow-x-auto rounded-3xl border border-gray-200">
              <table className="min-w-full bg-white">
                <thead className="bg-[#FACC15]/15 text-left text-sm uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Reported By</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Incident</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {safetyReports.map((report) => (
                    <tr key={report.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">
                            {report.reporterName ? report.reporterName.charAt(0) : 'U'}
                          </div>
                          <span>{report.reporterName || report.userId || 'Unknown Reporter'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{report.location}</td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{report.description}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          report.status === 'Approved' ? 'bg-green-100 text-green-700' :
                          report.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => updateSafetyStatus(report.id, 'Approved')}
                          className="text-xs font-bold text-green-600 hover:underline"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateSafetyStatus(report.id, 'Rejected')}
                          className="text-xs font-bold text-red-600 hover:underline"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                  {safetyReports.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-gray-400">No safety reports found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && analytics && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: analytics.userCount, color: 'blue' },
                { label: 'Facilities', value: analytics.facilityCount, color: 'green' },
                { label: 'Resources', value: analytics.resourceCount, color: 'purple' },
                { label: 'Incidents', value: analytics.safetyReportCount, color: 'red' }
              ].map((stat, i) => (
                <div key={i} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <p className={`text-4xl font-black text-${stat.color}-500 mt-2`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="p-8 bg-[#262626] rounded-[2.5rem] text-white">
              <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                System Health
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Status</p>
                  <p className="text-xl font-bold">{analytics.systemHealth.status}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Database</p>
                  <p className="text-xl font-bold">{analytics.systemHealth.database}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Uptime</p>
                  <p className="text-xl font-bold">{analytics.systemHealth.uptime}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
