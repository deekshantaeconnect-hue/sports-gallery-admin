// src/app/admin/users/components/UserStatusBadge.tsx

import React from 'react';
import { UserStatus } from '@/types/user.types';

interface UserStatusBadgeProps {
  status: UserStatus;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

const USER_STATUS_CONFIG: Record<UserStatus, { label: string; className: string; dotColor: string }> = {
  ACTIVE: {
    label: 'Active',
    className: 'bg-green-50 text-green-700 ring-green-600/20',
    dotColor: 'bg-green-400',
  },
  BLOCKED: {
    label: 'Blocked',
    className: 'bg-red-50 text-red-700 ring-red-600/20',
    dotColor: 'bg-red-400',
  },
  DELETED: {
    label: 'Deleted',
    className: 'bg-gray-50 text-gray-600 ring-gray-500/20',
    dotColor: 'bg-gray-400',
  },
};

export const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({
  status,
  size = 'sm',
  showDot = true,
}) => {
  const config = USER_STATUS_CONFIG[status];

  if (!config) {
    return <span className="text-gray-500 text-sm">{status}</span>;
  }

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const dotSize = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full font-medium
        ring-1 ring-inset
        ${config.className}
        ${sizeClasses[size]}
      `}
    >
      {showDot && (
        <span
          className={`
            rounded-full
            ${dotSize[size]}
            ${config.dotColor}
          `}
        />
      )}
      {config.label}
    </span>
  );
};