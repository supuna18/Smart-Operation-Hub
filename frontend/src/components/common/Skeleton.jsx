import React from 'react';

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`}></div>
  );
};

export const ResourceCardSkeleton = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[400px]">
      <div className="h-1.5 w-full bg-slate-100" />
      <div className="h-40 w-full bg-slate-100 animate-pulse" />
      <div className="p-5 flex-1 space-y-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-3/4" />
        <div className="space-y-2 pt-4">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
    </div>
  );
};

export default Skeleton;
