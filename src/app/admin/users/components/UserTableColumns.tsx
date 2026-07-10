// src/app/admin/users/components/UserTableColumns.tsx

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { User, UserStatus } from '@/types/user.types';
import { UserStatusBadge } from './UserStatusBadge';
import { UserRoleBadge } from './UserRoleBadge';
import { UserActions } from './UserActions';
import { UserSortableHeader } from './UserSortableHeader';
import { format } from 'date-fns';

/**
 * Helper to determine user status from isActive and deletedAt
 */
export function getUserStatus(user: User): UserStatus {
  if (user.deletedAt) return 'DELETED';
  if (!user.isActive) return 'BLOCKED';
  return 'ACTIVE';
}

/**
 * Format currency in INR
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date
 */
function formatDate(date: string | Date | null): string {
  if (!date) return '—';
  return format(new Date(date), 'dd MMM yyyy, hh:mm a');
}

/**
 * User table column definitions with sorting
 */
export const userTableColumns: ColumnDef<User>[] = [
  {
    id: 'user',
    accessorKey: 'name',
    header: () => <UserSortableHeader column="name" label="User" />,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm font-medium text-gray-700 border border-gray-200 flex-shrink-0">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">{user.name || '—'}</span>
            <span className="text-xs text-gray-500">ID: {user.globalId?.slice(0, 8) || user.id.slice(0, 8)}</span>
          </div>
        </div>
      );
    },
    enableSorting: true,
    size: 200,
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: () => <UserSortableHeader column="email" label="Email" />,
    cell: ({ row }) => {
      const email = row.original.email;
      return (
        <div className="flex flex-col">
          <span className="text-sm text-gray-900">{email || '—'}</span>
          {email && (
            <span className="text-xs text-gray-400">
              {row.original.emailVerifiedAt ? '✓ Verified' : '⚠ Unverified'}
            </span>
          )}
        </div>
      );
    },
    enableSorting: true,
    size: 180,
  },
  {
    id: 'phone',
    accessorKey: 'phone',
    header: () => <UserSortableHeader column="phone" label="Phone" />,
    cell: ({ row }) => {
      const phone = row.original.phone;
      return (
        <div className="flex flex-col">
          <span className="text-sm text-gray-900">{phone || '—'}</span>
          {phone && (
            <span className="text-xs text-gray-400">
              {row.original.phoneVerifiedAt ? '✓ Verified' : '⚠ Unverified'}
            </span>
          )}
        </div>
      );
    },
    enableSorting: true,
    size: 150,
  },
  {
    id: 'role',
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <UserRoleBadge role={row.original.role} />,
    enableSorting: false,
    size: 140,
  },
  {
    id: 'storeMemberships',
    accessorKey: 'storeMemberships',
    header: 'Store Membership(s)',
    cell: ({ row }) => {
      const memberships = row.original.storeMemberships;
      if (!memberships || memberships.length === 0) return <span className="text-gray-400 text-sm">—</span>;
      
      return (
        <div className="flex flex-col gap-0.5">
          {memberships.slice(0, 2).map((membership) => (
            <span key={membership.id} className="text-sm text-gray-700">
              {membership.storeName}
              {membership.isDefault && (
                <span className="ml-1 text-xs text-gray-400">(Default)</span>
              )}
            </span>
          ))}
          {memberships.length > 2 && (
            <span className="text-xs text-gray-400">+{memberships.length - 2} more</span>
          )}
        </div>
      );
    },
    enableSorting: false,
    size: 180,
  },
  {
    id: 'defaultStore',
    accessorKey: 'defaultStoreName',
    header: 'Default Store',
    cell: ({ row }) => {
      const defaultStore = row.original.defaultStoreName;
      return <span className="text-sm text-gray-700">{defaultStore || '—'}</span>;
    },
    enableSorting: false,
    size: 140,
  },
  {
    id: 'verification',
    header: 'Verification',
    cell: ({ row }) => {
      const user = row.original;
      const emailVerified = !!user.emailVerifiedAt;
      const phoneVerified = !!user.phoneVerifiedAt;
      
      return (
        <div className="flex flex-col gap-0.5">
          <span className={`text-xs ${emailVerified ? 'text-green-600' : 'text-gray-400'}`}>
            Email: {emailVerified ? '✓ Verified' : '—'}
          </span>
          <span className={`text-xs ${phoneVerified ? 'text-green-600' : 'text-gray-400'}`}>
            Phone: {phoneVerified ? '✓ Verified' : '—'}
          </span>
        </div>
      );
    },
    enableSorting: false,
    size: 130,
  },
  {
    id: 'status',
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const status = getUserStatus(row.original);
      return <UserStatusBadge status={status} />;
    },
    enableSorting: false,
    size: 100,
  },
  {
    id: 'totalOrders',
    accessorKey: 'totalOrders',
    header: () => <UserSortableHeader column="totalOrders" label="Orders" align="right" />,
    cell: ({ row }) => {
      const count = row.original.totalOrders || 0;
      return <span className="text-sm font-medium text-gray-900 text-right block">{count}</span>;
    },
    enableSorting: true,
    size: 90,
  },
  {
    id: 'totalSpend',
    accessorKey: 'totalSpend',
    header: () => <UserSortableHeader column="totalSpend" label="Total Spend" align="right" />,
    cell: ({ row }) => {
      const amount = row.original.totalSpend || 0;
      return <span className="text-sm font-medium text-gray-900 text-right block">{formatCurrency(amount)}</span>;
    },
    enableSorting: true,
    size: 120,
  },
  {
    id: 'lastLogin',
    accessorKey: 'lastLogin',
    header: () => <UserSortableHeader column="lastLogin" label="Last Login" />,
    cell: ({ row }) => {
      const lastLogin = row.original.lastLogin;
      return <span className="text-sm text-gray-600">{formatDate(lastLogin)}</span>;
    },
    enableSorting: true,
    size: 170,
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: () => <UserSortableHeader column="createdAt" label="Created" />,
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return <span className="text-sm text-gray-600">{formatDate(createdAt)}</span>;
    },
    enableSorting: true,
    size: 170,
  },
  {
    id: 'actions',
    header: () => <span className="text-right block">Actions</span>,
    cell: ({ row }) => {
      const user = row.original;
      const status = getUserStatus(user);
      return (
        <div className="flex justify-end">
          <UserActions user={user} status={status} />
        </div>
      );
    },
    enableSorting: false,
    size: 80,
    meta: {
      sticky: 'right',
    },
  },
];