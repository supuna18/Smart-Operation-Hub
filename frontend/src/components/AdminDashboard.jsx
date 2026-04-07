import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { getUser, clearAuth } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [resources, setResources] = useState([]);
  const [safetyReports, setSafetyReports] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [facilityDraft, setFacilityDraft] = useState({ name: '', description: '', location: '', capacity: '' });
  const [resourceDraft, setResourceDraft] = useState({ name: '', type: '', quantity: '', status: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadAll = async () => {
    try {
      const [usersResponse, facilitiesResponse, resourcesResponse, safetyResponse, analyticsResponse] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/facilities'),
        api.get('/admin/resources'),
        api.get('/admin/safety/reports'),
        api.get('/admin/analytics'),
      ]);

      setUsers(usersResponse.data);
      setFacilities(facilitiesResponse.data);
      setResources(resourcesResponse.data);
      setSafetyReports(safetyResponse.data);
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
          {['users', 'facilities', 'resources', 'safety', 'analytics'].map((tab) => (
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
          <div className="space-y-8">
            <form onSubmit={createResource} className="grid gap-4 md:grid-cols-2">
              <input
                value={resourceDraft.name}
                onChange={(e) => setResourceDraft({ ...resourceDraft, name: e.target.value })}
                placeholder="Resource name"
                className="rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3"
                required
              />
              <input
                value={resourceDraft.type}
                onChange={(e) => setResourceDraft({ ...resourceDraft, type: e.target.value })}
                placeholder="Type"
                className="rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3"
                required
              />
              <input
                value={resourceDraft.quantity}
                onChange={(e) => setResourceDraft({ ...resourceDraft, quantity: e.target.value })}
                placeholder="Quantity"
                type="number"
                className="rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3"
                required
              />
              <input
                value={resourceDraft.status}
                onChange={(e) => setResourceDraft({ ...resourceDraft, status: e.target.value })}
                placeholder="Status"
                className="rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3"
                required
              />
              <button
                type="submit"
                className="col-span-full rounded-3xl bg-[#262626] py-3 text-center font-semibold text-[#FACC15] hover:bg-gray-900"
              >
                Add Resource
              </button>
            </form>

            <div className="overflow-x-auto rounded-3xl border border-gray-200">
              <table className="min-w-full bg-white">
                <thead className="bg-[#FACC15]/15 text-left text-sm uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {resources.map((item) => (
                    <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                      <td className="px-6 py-4 text-gray-600">{item.type}</td>
                      <td className="px-6 py-4 text-gray-600">{item.quantity}</td>
                      <td className="px-6 py-4 text-gray-600">{item.status}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => deleteResource(item.id)}
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
