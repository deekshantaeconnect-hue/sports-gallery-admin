// src/app/admin/users/components/UserActions.tsx

"use client";

import React, { useState } from "react";
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Package,
  MapPin,
  Users,
  Ban,
  Shield,
  Key,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { User, UserStatus } from "@/types/user.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface UserActionsProps {
  user: User;
  status: UserStatus;
}

export const UserActions: React.FC<UserActionsProps> = ({ user, status }) => {
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showUnblockDialog, setShowUnblockDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);

  // Permission checks (will be replaced with RBAC later)
  const canView = true;
  const canEdit = user.role !== 'SUPER_ADMIN'; // Only SUPER_ADMIN can't be edited
  const canBlock = user.role !== 'SUPER_ADMIN' && status !== 'BLOCKED' && status !== 'DELETED';
  const canUnblock = user.role !== 'SUPER_ADMIN' && status === 'BLOCKED';
  const canDelete = user.role !== 'SUPER_ADMIN' && status !== 'DELETED';
  const canRestore = user.role !== 'SUPER_ADMIN' && status === 'DELETED';
  const canResetPassword = true;
  const canViewOrders = true;
  const canViewAddresses = true;
  const canViewMemberships = true;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            {/* View User */}
            <DropdownMenuItem 
              onClick={() => setShowDetailsDrawer(true)}
              className="cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              View User
            </DropdownMenuItem>

            {/* Edit User */}
            {canEdit && (
              <DropdownMenuItem 
                onClick={() => {/* Navigate to edit page or open edit modal */}}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit User
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            {/* View Orders */}
            {canViewOrders && (
              <DropdownMenuItem 
                onClick={() => {/* Navigate to user orders */}}
                className="cursor-pointer"
              >
                <Package className="mr-2 h-4 w-4" />
                View Orders
              </DropdownMenuItem>
            )}

            {/* View Addresses */}
            {canViewAddresses && (
              <DropdownMenuItem 
                onClick={() => {/* Navigate to user addresses */}}
                className="cursor-pointer"
              >
                <MapPin className="mr-2 h-4 w-4" />
                View Addresses
              </DropdownMenuItem>
            )}

            {/* View Store Memberships */}
            {canViewMemberships && (
              <DropdownMenuItem 
                onClick={() => {/* Navigate to user memberships */}}
                className="cursor-pointer"
              >
                <Users className="mr-2 h-4 w-4" />
                View Store Memberships
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            {/* Block User */}
            {canBlock && (
              <DropdownMenuItem 
                onClick={() => setShowBlockDialog(true)}
                className="cursor-pointer text-amber-600"
              >
                <Ban className="mr-2 h-4 w-4" />
                Block User
              </DropdownMenuItem>
            )}

            {/* Unblock User */}
            {canUnblock && (
              <DropdownMenuItem 
                onClick={() => setShowUnblockDialog(true)}
                className="cursor-pointer text-green-600"
              >
                <Shield className="mr-2 h-4 w-4" />
                Unblock User
              </DropdownMenuItem>
            )}

            {/* Reset Password */}
            {canResetPassword && (
              <DropdownMenuItem 
                onClick={() => setShowResetPasswordDialog(true)}
                className="cursor-pointer"
              >
                <Key className="mr-2 h-4 w-4" />
                Reset Password
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            {/* Delete User (Soft Delete) */}
            {canDelete && (
              <DropdownMenuItem 
                onClick={() => setShowDeleteDialog(true)}
                className="cursor-pointer text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </DropdownMenuItem>
            )}

            {/* Restore User */}
            {canRestore && (
              <DropdownMenuItem 
                onClick={() => {/* Restore user */}}
                className="cursor-pointer text-blue-600"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Restore User
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialogs - to be implemented in Phase 7 */}
      {/* 
        <UserDetailsDrawer 
          open={showDetailsDrawer} 
          onOpenChange={setShowDetailsDrawer} 
          userId={user.id} 
        />
        <BlockUserDialog ... />
        <UnblockUserDialog ... />
        <ResetPasswordDialog ... />
        <DeleteUserDialog ... />
      */}
    </>
  );
};