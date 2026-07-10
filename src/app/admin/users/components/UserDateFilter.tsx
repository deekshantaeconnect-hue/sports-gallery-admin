// src/app/admin/users/components/UserDateFilter.tsx

"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Calendar, X } from "lucide-react";
import { useUserQueryParams } from "@/hooks/useUserQueryParams";
import { format } from "date-fns";

interface UserDateFilterProps {
  label: string;
  fromKey: 'registrationFrom' | 'lastLoginFrom';
  toKey: 'registrationTo' | 'lastLoginTo';
}

export const UserDateFilter: React.FC<UserDateFilterProps> = ({
  label,
  fromKey,
  toKey,
}) => {
  const { params, updateParams } = useUserQueryParams();
  
  const [fromDate, setFromDate] = useState(params[fromKey] || "");
  const [toDate, setToDate] = useState(params[toKey] || "");

  // Sync to URL on change
  useEffect(() => {
    if (fromDate === params[fromKey] && toDate === params[toKey]) return;
    
    updateParams({
      [fromKey]: fromDate || undefined,
      [toKey]: toDate || undefined,
    });
  }, [fromDate, toDate, fromKey, toKey, params, updateParams]);

  const hasFilter = !!(fromDate || toDate);

  const clearFilter = useCallback(() => {
    setFromDate("");
    setToDate("");
  }, []);

  return (
    <div className="relative">
      <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-rose-500 focus-within:border-transparent transition-all">
        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="w-[130px] py-1 text-sm bg-transparent border-0 outline-none text-gray-700"
          aria-label={`${label} from date`}
          max={toDate || undefined}
        />
        <span className="text-gray-400 text-sm">→</span>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="w-[130px] py-1 text-sm bg-transparent border-0 outline-none text-gray-700"
          aria-label={`${label} to date`}
          min={fromDate || undefined}
        />
        {hasFilter && (
          <button
            onClick={clearFilter}
            className="p-0.5 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Clear date filter"
          >
            <X className="w-3.5 h-3.5 text-gray-400" />
          </button>
        )}
      </div>
      <span className="absolute -top-2 left-3 px-1 bg-white text-xs text-gray-400">
        {label}
      </span>
    </div>
  );
};