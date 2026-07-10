// src/lib/query-keys/user-keys.ts

import { UserQueryParams } from '@/types/user.types';

/**
 * Query key factory for user-related queries
 * Enables type-safe cache invalidation
 */
export const userKeys = {
  // Base key
  all: ['users'] as const,
  
  // List queries
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: UserQueryParams) => [...userKeys.lists(), params] as const,
  
  // Detail queries
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  
  // Related data
  memberships: (userId: string) => [...userKeys.detail(userId), 'memberships'] as const,
  addresses: (userId: string) => [...userKeys.detail(userId), 'addresses'] as const,
  orders: (userId: string) => [...userKeys.detail(userId), 'orders'] as const,
  orderSummary: (userId: string) => [...userKeys.detail(userId), 'order-summary'] as const,
  loginHistory: (userId: string) => [...userKeys.detail(userId), 'login-history'] as const,
  audit: (userId: string) => [...userKeys.detail(userId), 'audit'] as const,
};

/**
 * Helper to invalidate all user queries
 */
export const invalidateUserQueries = (queryClient: any, userId?: string) => {
  if (userId) {
    // Invalidate specific user
    queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
    queryClient.invalidateQueries({ queryKey: userKeys.memberships(userId) });
    queryClient.invalidateQueries({ queryKey: userKeys.addresses(userId) });
    queryClient.invalidateQueries({ queryKey: userKeys.orderSummary(userId) });
    queryClient.invalidateQueries({ queryKey: userKeys.loginHistory(userId) });
    queryClient.invalidateQueries({ queryKey: userKeys.audit(userId) });
  }
  
  // Always invalidate list (to refresh table)
  queryClient.invalidateQueries({ queryKey: userKeys.lists() });
};