import React, { useState } from 'react';
import ResourceList from './ResourceList';
import ResourceForm from './ResourceForm';

const ResourceManagement = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState(null);
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
        <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4 uppercase tracking-tighter">
                        Campus Resource Hub
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
                        Modernizing university facility management with high-efficiency resource cataloging and status tracking.
                    </p>
                </div>

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
