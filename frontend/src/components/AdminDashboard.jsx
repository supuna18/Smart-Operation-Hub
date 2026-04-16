import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { getUser, clearAuth } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import heroImage from '../assets/reso1.jpeg';
import { FiPlus, FiTrash2, FiActivity, FiBox, FiLayers, FiInfo, FiTrendingUp, FiDownload } from 'react-icons/fi';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Categories and local asset defaults
import lectureHallImg from '../assets/reso1.jpeg';
import labImg from '../assets/labR.jpeg';
import equipmentImg from '../assets/equipmentR.jpeg';
import studyAreaImg from '../assets/studyareaR.jpeg';
import loungeImg from '../assets/loungeR.jpeg';
import sportsImg from '../assets/sportfacilityR.jpeg';
import otherImg from '../assets/otherR.jpeg';

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
  const [resourceDraft, setResourceDraft] = useState({ name: '', type: '', quantity: '', status: '', imageUrl: '' });
  const [editingResource, setEditingResource] = useState(null);
  const [error, setError] = useState('');
  const { showToast } = useToast();
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
      showToast('User role updated successfully!', 'success');
    } catch (err) {
      showToast('Failed to update user role.', 'error');
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((current) => current.filter((item) => item.id !== id));
      showToast('User removed successfully.', 'success');
    } catch (err) {
      showToast('Failed to remove user.', 'error');
    }
  };

  const createFacility = async (e) => {
    e.preventDefault();
    if (Number(facilityDraft.capacity) < 0) {
      showToast('Capacity cannot be negative.', 'error');
      return;
    }
    try {
      const response = await api.post('/admin/facilities', {
        ...facilityDraft,
        capacity: Number(facilityDraft.capacity),
      });
      setFacilities((current) => [...current, response.data]);
      setFacilityDraft({ name: '', description: '', location: '', capacity: '' });
      showToast('Facility added successfully!', 'success');
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FACC15', '#262626']
      });
    } catch (err) {
      showToast('Failed to create facility.', 'error');
    }
  };

  const getTypeDefaultImage = (type) => {
    const defaults = {
      'Lecture Hall': lectureHallImg,
      'Lab': labImg,
      'Laboratory': labImg,
      'Auditorium': lectureHallImg,
      'Equipment': equipmentImg,
      'Study Area': studyAreaImg,
      'Lounge': loungeImg,
      'Sports Facility': sportsImg,
      'Other': otherImg
    };
    return defaults[type] || otherImg;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image size should be less than 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setResourceDraft({ ...resourceDraft, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (resource) => {
    setResourceDraft({
      name: resource.name,
      type: resource.type,
      quantity: resource.quantity,
      status: resource.status,
      imageUrl: resource.imageUrl || ''
    });
    setEditingResource(resource);
    // Smooth scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Editing: ${resource.name}`, 'info');
  };

  const cancelEdit = () => {
    setResourceDraft({ name: '', type: '', quantity: '', status: '', imageUrl: '' });
    setEditingResource(null);
  };

  const handleSubmitResource = async (e) => {
    e.preventDefault();
    if (Number(resourceDraft.quantity) < 0) {
      showToast('Quantity cannot be negative.', 'error');
      return;
    }
    try {
      if (editingResource) {
        // UPDATE MODE
        const response = await api.put(`/admin/resources/${editingResource.id}`, {
          ...resourceDraft,
          quantity: Number(resourceDraft.quantity),
        });
        setResources((current) => current.map(res => res.id === editingResource.id ? response.data : res));
        showToast('Resource updated successfully!', 'success');
        cancelEdit();
      } else {
        // CREATE MODE
        const response = await api.post('/admin/resources', {
          ...resourceDraft,
          quantity: Number(resourceDraft.quantity),
        });
        setResources((current) => [...current, response.data]);
        setResourceDraft({ name: '', type: '', quantity: '', status: '', imageUrl: '' });
        showToast('Resource registered successfully!', 'success');
      }
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FACC15', '#262626']
      });
    } catch (err) {
      showToast(`Failed to ${editingResource ? 'update' : 'create'} resource.`, 'error');
    }
  };

  const deleteFacility = async (id) => {
    try {
      await api.delete(`/admin/facilities/${id}`);
      setFacilities((current) => current.filter((item) => item.id !== id));
      showToast('Facility deleted.', 'success');
    } catch (err) {
      showToast('Failed to delete facility.', 'error');
    }
  };

  const deleteResource = async (id) => {
    try {
      await api.delete(`/admin/resources/${id}`);
      setResources((current) => current.filter((item) => item.id !== id));
      showToast('Resource removed from inventory.', 'success');
    } catch (err) {
      showToast('Failed to delete resource.', 'error');
    }
  };

  const updateSafetyStatus = async (id, status) => {
    try {
      const response = await api.put(`/admin/safety/reports/${id}/status`, { status });
      setSafetyReports((current) => current.map((item) => (item.id === id ? response.data : item)));
      showToast(`Report ${status.toLowerCase()} successfully.`, 'success');
    } catch (err) {
      showToast('Failed to update report status.', 'error');
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const response = await api.put(`/resources/bookings/${id}/status?status=${status}`);
      setBookings((current) => current.map((item) => (item.id === id ? response.data : item)));
      showToast(`Booking ${status.toLowerCase()}!`, 'success');
    } catch (err) {
      showToast('Failed to update booking status.', 'error');
    }
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();
    const tableColumn = ["Asset Name", "Type", "Status", "Quantity", "Location"];
    const tableRows = [];

    resources.forEach(res => {
      const resourceData = [
        res.name,
        res.type,
        res.status,
        res.quantity,
        res.location || 'N/A'
      ];
      tableRows.push(resourceData);
    });

    doc.setFontSize(20);
    doc.text("Campus Resource Inventory Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    doc.autoTable(tableColumn, tableRows, { startY: 40, theme: 'grid', headStyles: { fillColor: [250, 204, 21], textColor: [38, 38, 38] } });
    doc.save(`Campus_Inventory_${new Date().getTime()}.pdf`);
    showToast('Report generated successfully!', 'success');
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
                min="0"
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
                src={heroImage} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                alt="Modern Resource Facility" 
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
                    {editingResource ? 'Update Existing Asset' : 'Register New Asset'}
                  </h3>
                </div>
                {editingResource && (
                  <button 
                    onClick={cancelEdit}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
              
              <form onSubmit={handleSubmitResource} className="grid gap-6 md:grid-cols-2 relative z-10">
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
                    min="0"
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
                <div className="space-y-1 col-span-full">
                  <label className="text-[10px] font-black text-[#FACC15] uppercase tracking-widest ml-1 text-yellow-500">Asset Image (Link or Upload)</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-2">
                       <input
                        value={resourceDraft.imageUrl}
                        onChange={(e) => setResourceDraft({ ...resourceDraft, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-white focus:ring-2 focus:ring-[#FACC15] outline-none transition-all placeholder:text-white/20 text-sm"
                      />
                      <div className="flex items-center gap-3">
                        <label className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl cursor-pointer transition-all border border-dashed border-white/20">
                          <FiPlus /> <span>Pick Local Image</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleFileChange}
                          />
                        </label>
                        {resourceDraft.imageUrl && (
                          <button 
                            type="button"
                            onClick={() => setResourceDraft({ ...resourceDraft, imageUrl: '' })}
                            className="bg-red-500/20 hover:bg-red-500/40 text-red-500 px-4 py-3 rounded-xl text-xs font-bold transition-all"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                    {resourceDraft.imageUrl && (
                      <div className="w-full md:w-32 h-32 rounded-2xl border-2 border-[#FACC15]/30 overflow-hidden bg-white/5 flex items-center justify-center shrink-0">
                        <img 
                          src={resourceDraft.imageUrl} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML = '<span class="text-[10px] text-red-400 p-2 text-center font-bold uppercase">Invalid URL</span>';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  className="col-span-full rounded-2xl bg-[#FACC15] py-4 text-center font-black text-[#262626] hover:bg-yellow-300 transition-all shadow-lg shadow-[#FACC15]/20 hover:shadow-[#FACC15]/40 hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-widest"
                >
                  {editingResource ? 'Update Asset Details' : 'ADD ASSET TO INVENTORY'}
                </button>
              </form>
            </div>

            {/* Custom Visual Card Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resources.map((item) => (
                <div key={item.id} className="group relative bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden hover:border-yellow-400 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col">
                  {/* Status Bar */}
                  <div className={`h-1.5 w-full ${item.status?.toUpperCase() === 'ACTIVE' ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                  
                  {/* Image Header */}
                  <div className="h-48 w-full relative overflow-hidden bg-slate-100 flex items-center justify-center">
                    <img 
                      src={item.imageUrl || getTypeDefaultImage(item.type)} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        if (e.target.src !== getTypeDefaultImage(item.type)) {
                          e.target.src = getTypeDefaultImage(item.type);
                        } else {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = '<div class="text-slate-300"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" height="48" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg></div>';
                        }
                      }}
                    />
                    <div className="absolute top-4 right-4 z-10">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg backdrop-blur-md ${
                        item.status?.toUpperCase() === 'ACTIVE' ? 'bg-emerald-500/90 text-white' : 'bg-yellow-500/90 text-slate-900'
                      }`}>
                        {item.status || 'Unknown'}
                      </span>
                    </div>
                  </div>

                  <div className="p-7 flex flex-col flex-1">
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                         <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg">
                           {item.type}
                         </span>
                      </div>
                      <h4 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-yellow-600 transition-colors uppercase tracking-tight">{item.name}</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-auto">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock Level</span>
                        <div className="flex items-center gap-3">
                          <FiBox size={16} className="text-yellow-500" />
                          <span className="text-xl font-black text-slate-900">{item.quantity}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleEdit(item)}
                          className="w-14 h-14 rounded-2xl bg-yellow-50 text-yellow-600 border border-yellow-200 flex items-center justify-center hover:bg-yellow-400 hover:text-white transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
                          title="Modify Asset Data"
                        >
                          <FiTrendingUp size={24} className="stroke-[2.5px]" />
                        </button>
                        <button
                          onClick={() => deleteResource(item.id)}
                          className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
                          title="Permanently Remove Asset"
                        >
                          <FiTrash2 size={24} className="stroke-[2.5px]" />
                        </button>
                      </div>
                    </div>
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-[#262626]">System Insights</h2>
              <button 
                onClick={generatePDFReport}
                className="flex items-center gap-2 bg-[#262626] text-[#FACC15] px-6 py-3 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg"
              >
                <FiDownload size={18} /> Download Inventory Report
              </button>
            </div>
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
