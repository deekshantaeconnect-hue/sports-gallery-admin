// src/app/admin/users/components/UserSortableHeader.tsx

"use client";

import React, { useCallback } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserQueryParams } from "@/hooks/useUserQueryParams";
import { UserQueryParams } from "@/types/user.types";

interface UserSortableHeaderProps {
  column: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const UserSortableHeader: React.FC<UserSortableHeaderProps> = ({
  column,
  label,
  align = 'left',
  className = '',
}) => {
  const { params, updateParams } = useUserQueryParams();
  
  const currentSortBy = params.sortBy;
  const currentSortOrder = params.sortOrder || 'desc';
  const isActive = currentSortBy === column;

  const handleSort = useCallback(() => {
    let newSortOrder: 'asc' | 'desc' = 'desc';
    
    if (isActive) {
      // Toggle sort order
      newSortOrder = currentSortOrder === 'desc' ? 'asc' : 'desc';
    }
    
    updateParams({
      sortBy: column as UserQueryParams['sortBy'],
      sortOrder: newSortOrder,
    });
  }, [column, isActive, currentSortOrder, updateParams]);

  const alignClass = {
    left: 'text-left justify-start',
    center: 'text-center justify-center',
    right: 'text-right justify-end',
  }[align];

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSort}
      className={`
        h-8 px-2 font-medium text-gray-500 hover:text-gray-900
        ${alignClass} ${className}
      `}
    >
      <span>{label}</span>
      {isActive ? (
        currentSortOrder === 'desc' ? (
          <ArrowDown className="ml-1 h-3 w-3" />
        ) : (
          <ArrowUp className="ml-1 h-3 w-3" />
        )
      ) : (
        <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />
      )}
    </Button>
  );
};