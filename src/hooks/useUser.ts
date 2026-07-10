// src/hooks/useUser.ts

import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { userKeys } from '@/lib/query-keys/user-keys';

import { useUserQueryParams } from './useUserQueryParams';
import { UserListResponse } from '@/types/user.types';


/**
 * Hook for fetching a single user by ID
 */
export function useUser(id: string | null) {
  return useQuery({
    queryKey: userKeys.detail(id || ''),
    queryFn: () => {
      if (!id) throw new Error('User ID is required');
      return userService.getUser(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Hook for fetching user's store memberships
 */
export function useUserMemberships(userId: string | null) {
  return useQuery({
    queryKey: userKeys.memberships(userId || ''),
    queryFn: () => {
      if (!userId) throw new Error('User ID is required');
      return userService.getUserMemberships(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook for fetching user's addresses
 */
export function useUserAddresses(userId: string | null) {
  return useQuery({
    queryKey: userKeys.addresses(userId || ''),
    queryFn: () => {
      if (!userId) throw new Error('User ID is required');
      return userService.getUserAddresses(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook for fetching user's order summary
 */
export function useUserOrderSummary(userId: string | null) {
  return useQuery({
    queryKey: userKeys.orderSummary(userId || ''),
    queryFn: () => {
      if (!userId) throw new Error('User ID is required');
      return userService.getUserOrderSummary(userId);
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for fetching user's login history
 */
export function useUserLoginHistory(userId: string | null) {
  return useQuery({
    queryKey: userKeys.loginHistory(userId || ''),
    queryFn: () => {
      if (!userId) throw new Error('User ID is required');
      return userService.getUserLoginHistory(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

/**
 * Hook for fetching user's audit logs
 */
export function useUserAuditLogs(userId: string | null) {
  return useQuery({
    queryKey: userKeys.audit(userId || ''),
    queryFn: () => {
      if (!userId) throw new Error('User ID is required');
      return userService.getUserAuditLogs(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}


/**
 * Hook for fetching paginated user list with filters
 * Features:
 * - Request cancellation via AbortSignal
 * - Debounced search (handled at component level)
 * - Stable query keys for cache
 */
export function useUsers() {
  const { params } = useUserQueryParams();

  return useQuery<UserListResponse>({
    queryKey: userKeys.list(params),
    queryFn: ({ signal }) => {
      // Pass abort signal to service for cancellation
      return userService.getUsers(params, signal);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    // Keep previous data while fetching new data
    placeholderData: (previousData) => previousData,
  });
}