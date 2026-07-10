// src/app/admin/users/components/UserRoleBadge.tsx

import React from 'react';
import { Role } from '@/types/types';

interface UserRoleBadgeProps {
  role: Role;
  size?: 'sm' | 'md' | 'lg';
}

const USER_ROLE_CONFIG: Record<Role, { label: string; className: string }> = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    className: 'bg-purple-50 text-purple-700 ring-purple-600/20',
  },
  STORE_MANAGER: {
    label: 'Store Manager',
    className: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  },
  SUPPORT_STAFF: {
    label: 'Support Staff',
    className: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  },
  VENDOR: {
    label: 'Vendor',
    className: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  },
  USER: {
    label: 'User',
    className: 'bg-gray-50 text-gray-700 ring-gray-500/20',
  },
};

export const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({
  role,
  size = 'sm',
}) => {
  const config = USER_ROLE_CONFIG[role];

  if (!config) {
    return <span className="text-gray-500 text-sm">{role}</span>;
  }

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={`
        inline-flex items-center
        rounded-full font-medium
        ring-1 ring-inset
        ${config.className}
        ${sizeClasses[size]}
      `}
    >
      {config.label}
    </span>
  );
};