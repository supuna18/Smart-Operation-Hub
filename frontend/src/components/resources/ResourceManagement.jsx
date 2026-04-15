import React, { useState, useEffect } from 'react';
import { isAdmin } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import ResourceList from './ResourceList';
import ResourceForm from './ResourceForm';
import heroImage from '../../assets/reso1.jpeg';
import libraryVideo from '../../assets/library.mp4';

const ResourceManagement = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isAdmin()) {
            navigate('/AdminDashboard');
        }
    }, [navigate]);
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
        <div className="min-h-screen bg-slate-50 font-poppins selection:bg-yellow-200">
            {/* Header Sectio.n. */}
            <div className="bg-white border-b border-slate-200 pt-16 pb-20 relative overflow-hidden">
                {/* Subtle top decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        {/* Left Text */}
                        <div className="max-w-2xl text-center lg:text-left">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold uppercase tracking-wider mb-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                                Facility Management
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-5 leading-tight">
                                Campus <span className="text-yellow-500">Resource</span> Hub
                            </h1>
                            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                                A centralized dashboard to track, manage, and optimize university assets and infrastructure automatically.
                            </p>
                        </div>

                        {/* Right Ima.ge */}
                        <div className="w-full lg:w-[500px] flex-shrink-0 relative">
                            {/* Decorative backing for the image */}
                            <div className="absolute inset-0 bg-yellow-400 rounded-3xl translate-x-3 translate-y-3 opacity-20 hidden md:block" />
                            <div className="absolute -inset-4 bg-yellow-100/50 blur-3xl -z-10 rounded-full" />
                            <div className="relative z-10 w-full rounded-3xl shadow-2xl border-4 border-white overflow-hidden aspect-[4/3]">
                                <video
                                    src={libraryVideo}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover object-center"
                                />
                                {/* Soft overlay to ensure premium feel */}
                                <div className="absolute inset-0 bg-slate-900/5 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20 pb-20">
                <ResourceList
                    key={refreshKey}
                    onEdit={handleEdit}
                    onAdd={handleAdd}
                />

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
