// src/hooks/useUsers.ts

import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { userKeys } from '@/lib/query-keys/user-keys';
import { useUserQueryParams } from './useUserQueryParams';
import { UserListResponse } from '@/types/user.types';

/**
 * Hook for fetching paginated user list with filters
 * Follows pattern from useAdminOrders
 */
export function useUsers() {
  const { params } = useUserQueryParams();

  return useQuery<UserListResponse>({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
}