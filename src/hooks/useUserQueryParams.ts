// src/hooks/useUserQueryParams.ts

import { useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { UserQueryParams } from '@/types/user.types';
import { Role } from '@/types/types';

/**
 * Default query params
 */
const DEFAULT_PARAMS: UserQueryParams = {
  page: 1,
  limit: 15,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

/**
 * Parse URL search params into typed UserQueryParams
 */
function parseSearchParams(searchParams: URLSearchParams): UserQueryParams {
  const params: UserQueryParams = {
    page: Number(searchParams.get('page')) || DEFAULT_PARAMS.page,
    limit: Number(searchParams.get('limit')) || DEFAULT_PARAMS.limit,
    sortBy: (searchParams.get('sortBy') as UserQueryParams['sortBy']) || DEFAULT_PARAMS.sortBy,
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || DEFAULT_PARAMS.sortOrder,
  };

  // String filters
  const search = searchParams.get('search');
  if (search) params.search = search;

  const role = searchParams.get('role');
  if (role && Object.values(Role).includes(role as Role)) {
    params.role = role as Role;
  }

  const storeId = searchParams.get('storeId');
  if (storeId) params.storeId = storeId;

  // Boolean filters
  const isActive = searchParams.get('isActive');
  if (isActive !== null) {
    params.isActive = isActive === 'true';
  }

  const isVerified = searchParams.get('isVerified');
  if (isVerified !== null) {
    params.isVerified = isVerified === 'true';
  }

  const emailVerified = searchParams.get('emailVerified');
  if (emailVerified !== null) {
    params.emailVerified = emailVerified === 'true';
  }

  const phoneVerified = searchParams.get('phoneVerified');
  if (phoneVerified !== null) {
    params.phoneVerified = phoneVerified === 'true';
  }

  const hasEmail = searchParams.get('hasEmail');
  if (hasEmail !== null) {
    params.hasEmail = hasEmail === 'true';
  }

  const hasPhone = searchParams.get('hasPhone');
  if (hasPhone !== null) {
    params.hasPhone = hasPhone === 'true';
  }

  // Date filters
  const registrationFrom = searchParams.get('registrationFrom');
  if (registrationFrom) params.registrationFrom = registrationFrom;

  const registrationTo = searchParams.get('registrationTo');
  if (registrationTo) params.registrationTo = registrationTo;

  const lastLoginFrom = searchParams.get('lastLoginFrom');
  if (lastLoginFrom) params.lastLoginFrom = lastLoginFrom;

  const lastLoginTo = searchParams.get('lastLoginTo');
  if (lastLoginTo) params.lastLoginTo = lastLoginTo;

  return params;
}

/**
 * Hook for managing user list query params in URL
 * Follows pattern from useOrdersQueryParams
 */
export function useUserQueryParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse current params
  const params = useMemo(() => parseSearchParams(searchParams), [searchParams]);

  /**
   * Update URL with new params
   * Resets page when filters change
   */
  const updateParams = useCallback(
    (updates: Partial<UserQueryParams>, options?: { resetPage?: boolean }) => {
      const newParams = new URLSearchParams(searchParams.toString());

      // Track if we're changing a filter (not pagination/sorting)
      const filterKeys: (keyof UserQueryParams)[] = [
        'search', 'role', 'isActive', 'isVerified', 'emailVerified', 'phoneVerified',
        'hasEmail', 'hasPhone', 'registrationFrom', 'registrationTo',
        'lastLoginFrom', 'lastLoginTo', 'storeId',
      ];
      
      const isFilterChange = Object.keys(updates).some(
        (key) => filterKeys.includes(key as keyof UserQueryParams)
      );

      // Apply updates
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });

      // Reset page if filters changed (unless explicitly disabled)
      if (isFilterChange && options?.resetPage !== false) {
        newParams.set('page', '1');
      }

      // Remove empty search params
      const queryString = newParams.toString();
      const url = queryString ? `${pathname}?${queryString}` : pathname;
      const currentUrl = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

      if (url === currentUrl) {
        return;
      }

      router.push(url, { scroll: false });
    },
    [searchParams, router, pathname]
  );

  /**
   * Get a single param value
   */
  const getParam = useCallback(
    (key: string): string | undefined => {
      return searchParams.get(key) || undefined;
    },
    [searchParams]
  );

  /**
   * Get all params as a record
   */
  const getAllParams = useCallback(() => {
    const result: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }, [searchParams]);

  /**
   * Reset all filters (keep pagination)
   */
  const resetFilters = useCallback(() => {
    const newParams = new URLSearchParams();
    newParams.set('page', String(params.page));
    newParams.set('limit', String(params.limit));
    newParams.set('sortBy', params.sortBy || 'createdAt');
    newParams.set('sortOrder', params.sortOrder || 'desc');
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  }, [params.page, params.limit, params.sortBy, params.sortOrder, pathname, router]);

  /**
   * Reset everything (including pagination)
   */
  const resetAll = useCallback(() => {
    const newParams = new URLSearchParams();
    newParams.set('page', '1');
    newParams.set('limit', '15');
    newParams.set('sortBy', 'createdAt');
    newParams.set('sortOrder', 'desc');
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  }, [pathname, router]);

  return {
    params,
    updateParams,
    getParam,
    getAllParams,
    resetFilters,
    resetAll,
  };
}