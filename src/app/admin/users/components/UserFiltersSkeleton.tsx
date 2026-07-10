// src/app/admin/users/components/UserFiltersSkeleton.tsx

import React from "react";

export const UserFiltersSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4 animate-pulse">
      {/* Primary Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] max-w-md h-10 bg-gray-100 rounded-lg" />
        <div className="w-[160px] h-10 bg-gray-100 rounded-lg" />
        <div className="w-[200px] h-10 bg-gray-100 rounded-lg" />
        <div className="w-[140px] h-10 bg-gray-100 rounded-lg" />
      </div>

      {/* Secondary Filter Row */}
      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100">
        <div className="w-[140px] h-10 bg-gray-100 rounded-lg" />
        <div className="w-[140px] h-10 bg-gray-100 rounded-lg" />
        <div className="w-[180px] h-10 bg-gray-100 rounded-lg" />
        <div className="w-[280px] h-10 bg-gray-100 rounded-lg" />
        <div className="w-[280px] h-10 bg-gray-100 rounded-lg" />
        <div className="ml-auto w-[120px] h-10 bg-gray-100 rounded-lg" />
      </div>
    </div>
  );
};