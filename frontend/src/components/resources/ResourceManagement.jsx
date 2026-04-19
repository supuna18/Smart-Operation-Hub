import React, { useState, useEffect } from 'react';
import { isAdmin } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import ResourceList from './ResourceList';
import ResourceForm from './ResourceForm';
import ResourceApprovalHub from './ResourceApprovalHub';
import heroImage from '../../assets/reso1.jpeg';
import libraryVideo from '../../assets/library.mp4';

const ResourceManagement = ({ isEmbedded = false, onAddTrigger = 0 }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (onAddTrigger > 0) {
            handleAdd();
        }
    }, [onAddTrigger]);

    // Removed the automatic redirect to allow admins to manage resources directly
    // and to support embedding in the AdminDashboard.

    const [viewMode, setViewMode] = useState('assets'); // 'assets' or 'bookings'
    const [refreshKey, setRefreshKey] = useState(0);

    const handleEdit = (resource) => {
        setSelectedResource(resource);
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setSelectedResource(null);
        setIsFormOpen(true);
    };

    const handleSave = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className={`font-poppins selection:bg-yellow-200 ${!isEmbedded ? 'min-h-screen bg-slate-50' : ''}`}>
            {/* Header Section (Only if not embedded) */}
            {!isEmbedded && (
                <div className="bg-[#262626] border-b border-white/5 pt-16 pb-20 relative overflow-hidden">
                    {/* Subtle top decoration */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-transparent" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                            {/* Left Text */}
                            <div className="max-w-2xl text-center lg:text-left">
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 text-yellow-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                                    Facility Management V2.0
                                </span>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-[1.1]">
                                    Campus <span className="text-yellow-400">Resource</span> Hub
                                </h1>
                                <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                                    A centralized ecosystem to track, manage, and optimize university assets with precision and real-time intelligence.
                                </p>
                            </div>

                            {/* Right Image/Video Section */}
                            <div className="w-full lg:w-[500px] flex-shrink-0 relative">
                                {/* Decorative backing for the image */}
                                <div className="absolute inset-0 bg-yellow-400 rounded-[2rem] translate-x-4 translate-y-4 opacity-10 hidden md:block" />
                                <div className="absolute -inset-10 bg-yellow-400/20 blur-[100px] -z-10 rounded-full opacity-30" />
                                <div className="relative z-10 w-full rounded-[2rem] shadow-2xl border-8 border-[#ffffff08] overflow-hidden aspect-[4/3] backdrop-blur-3xl">
                                    <video
                                        src={libraryVideo}
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className="w-full h-full object-cover object-center scale-[1.02]"
                                    />
                                    {/* Soft overlay to ensure premium feel */}
                                    <div className="absolute inset-0 bg-slate-900/20 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className={`max-w-7xl mx-auto ${!isEmbedded ? 'px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-20' : ''}`}>
                
                {/* Mode Selector - Premium Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-white/20 flex gap-2">
                        <button 
                            onClick={() => setViewMode('assets')}
                            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
                                viewMode === 'assets' 
                                    ? 'bg-[#262626] text-[#FACC15] shadow-lg shadow-black/20' 
                                    : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            Asset Registry
                        </button>
                        <button 
                            onClick={() => setViewMode('bookings')}
                            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
                                viewMode === 'bookings' 
                                    ? 'bg-[#262626] text-[#FACC15] shadow-lg shadow-black/20' 
                                    : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            Booking Requests
                        </button>
                    </div>
                </div>

                {viewMode === 'assets' ? (
                    <ResourceList
                        key={refreshKey}
                        onEdit={handleEdit}
                        onAdd={handleAdd}
                    />
                ) : (
                    <ResourceApprovalHub />
                )}

                {isFormOpen && (
                    <ResourceForm
                        resource={selectedResource}
                        onClose={() => setIsFormOpen(false)}
                        onSave={handleSave}
                    />
                )}
            </div>
        </div>

    );
};

export default ResourceManagement;
