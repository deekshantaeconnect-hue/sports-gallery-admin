// src/services/user.service.ts

import apiClient from '@/lib/api-client';
import { Role } from '@/types/types';
import {
  User,
  UserListResponse,
  UserQueryParams,
  BlockUserPayload,
  UnblockUserPayload,
  UpdateUserRolePayload,
  DeleteUserPayload,
  UserAuditLog,
  UserLoginHistory,
  UserOrderSummary,
  UserAddress,
  StoreMembership,
} from '@/types/user.types';

/**
 * User service with all API calls
 * Follows the pattern established in admin-orders.service.ts
 */
export const userService = {

/**
 * Get paginated user list with filters
 * GET /admin/users
 * Supports AbortSignal for request cancellation
 */
getUsers: async (
  params: UserQueryParams,
  signal?: AbortSignal
): Promise<UserListResponse> => {
  const queryParams = new URLSearchParams();
  
  // Required pagination params
  queryParams.append('page', String(params.page));
  queryParams.append('limit', String(params.limit));
  
  // Optional filters
  if (params.search) queryParams.append('search', params.search);
  if (params.role) queryParams.append('role', params.role);
  if (params.isActive !== undefined) {
    queryParams.append('isActive', String(params.isActive));
  }
  if (params.isVerified !== undefined) {
    queryParams.append('isVerified', String(params.isVerified));
  }
  if (params.emailVerified !== undefined) {
    queryParams.append('emailVerified', String(params.emailVerified));
  }
  if (params.phoneVerified !== undefined) {
    queryParams.append('phoneVerified', String(params.phoneVerified));
  }
  if (params.hasEmail !== undefined) {
    queryParams.append('hasEmail', String(params.hasEmail));
  }
  if (params.hasPhone !== undefined) {
    queryParams.append('hasPhone', String(params.hasPhone));
  }
  if (params.registrationFrom) {
    queryParams.append('registrationFrom', params.registrationFrom);
  }
  if (params.registrationTo) {
    queryParams.append('registrationTo', params.registrationTo);
  }
  if (params.lastLoginFrom) {
    queryParams.append('lastLoginFrom', params.lastLoginFrom);
  }
  if (params.lastLoginTo) {
    queryParams.append('lastLoginTo', params.lastLoginTo);
  }
  if (params.storeId) {
    queryParams.append('storeId', params.storeId);
  }
  
  // Sorting
  if (params.sortBy) {
    queryParams.append('sortBy', params.sortBy);
    queryParams.append('sortOrder', params.sortOrder || 'desc');
  }
  
  const response = await apiClient.get<UserListResponse>(
    `/admin/users?${queryParams.toString()}`,
    { signal } // Pass abort signal for cancellation
  );
  
  return response;
},

  /**
   * Get single user by ID
   * GET /admin/users/:id
   */
  getUser: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/admin/users/${id}`);
    return response;
  },

  /**
   * Block a user (set isActive = false)
   * PATCH /admin/users/:id/block
   */
  blockUser: async (id: string, payload: BlockUserPayload): Promise<User> => {
    const response = await apiClient.patch<User>(`/admin/users/${id}/block`, payload);
    return response;
  },

  /**
   * Unblock a user (set isActive = true)
   * PATCH /admin/users/:id/unblock
   */
  unblockUser: async (id: string, payload: UnblockUserPayload): Promise<User> => {
    const response = await apiClient.patch<User>(`/admin/users/${id}/unblock`, payload);
    return response;
  },

  /**
   * Update user role
   * PATCH /admin/users/:id/role
   */
  updateUserRole: async (id: string, payload: UpdateUserRolePayload): Promise<User> => {
    const response = await apiClient.patch<User>(`/admin/users/${id}/role`, payload);
    return response;
  },

  /**
   * Soft delete a user (set deletedAt)
   * DELETE /admin/users/:id
   */
  deleteUser: async (id: string, payload: DeleteUserPayload): Promise<void> => {
    await apiClient.delete(`/admin/users/${id}`, { data: payload });
  },

  /**
   * Restore a soft-deleted user (set deletedAt = null)
   * PATCH /admin/users/:id/restore
   */
  restoreUser: async (id: string): Promise<User> => {
    const response = await apiClient.patch<User>(`/admin/users/${id}/restore`);
    return response;
  },

  /**
   * Get user's store memberships
   * GET /admin/users/:id/memberships
   */
  getUserMemberships: async (id: string): Promise<StoreMembership[]> => {
    const response = await apiClient.get<StoreMembership[]>(`/admin/users/${id}/memberships`);
    return response;
  },

  /**
   * Get user's addresses
   * GET /admin/users/:id/addresses
   */
  getUserAddresses: async (id: string): Promise<UserAddress[]> => {
    const response = await apiClient.get<UserAddress[]>(`/admin/users/${id}/addresses`);
    return response;
  },

  /**
   * Get user's order summary
   * GET /admin/users/:id/order-summary
   */
  getUserOrderSummary: async (id: string): Promise<UserOrderSummary> => {
    const response = await apiClient.get<UserOrderSummary>(`/admin/users/${id}/order-summary`);
    return response;
  },

  /**
   * Get user's login history
   * GET /admin/users/:id/login-history
   */
  getUserLoginHistory: async (id: string): Promise<UserLoginHistory[]> => {
    const response = await apiClient.get<UserLoginHistory[]>(`/admin/users/${id}/login-history`);
    return response;
  },

  /**
   * Get user's audit logs
   * GET /admin/users/:id/audit
   */
  getUserAuditLogs: async (id: string): Promise<UserAuditLog[]> => {
    const response = await apiClient.get<UserAuditLog[]>(`/admin/users/${id}/audit`);
    return response;
  },

  // src/services/user.service.ts - Add this method

/**
 * Export users with current filters
 * GET /admin/users/export
 */
exportUsers: async (params: {
  search?: string;
  role?: Role;
  isActive?: boolean;
  isVerified?: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  registrationFrom?: string;
  registrationTo?: string;
  lastLoginFrom?: string;
  lastLoginTo?: string;
  format?: 'csv' | 'excel';
}): Promise<{ data: Blob }> => {
  const queryParams = new URLSearchParams();
  
  // Add all filter params
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });
  
  // Default format
  if (!params.format) {
    queryParams.append('format', 'csv');
  }
  
  const response = await apiClient.get(
    `/admin/users/export?${queryParams.toString()}`,
    { responseType: 'blob' }
  );
  
  return response;
},
};

