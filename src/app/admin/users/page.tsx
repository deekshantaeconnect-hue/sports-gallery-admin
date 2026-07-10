// src/app/admin/users/page.tsx

"use client";

import React, { useCallback } from "react";
import { useUsers } from "@/hooks/useUsers";
import { useUserQueryParams } from "@/hooks/useUserQueryParams";
import { UserTable } from "./components/UserTable";
import { UserFilters } from "./components/UserFilters";
import { UserFiltersSkeleton } from "./components/UserFiltersSkeleton";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UsersPage() {
  const { params, updateParams } = useUserQueryParams();
  const { data, isLoading, error, refetch, isFetching } = useUsers();

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    updateParams({ page });
  }, [updateParams]);

  // Handle page size change (resets to page 1)
  const handlePageSizeChange = useCallback((limit: number) => {
    updateParams({ limit, page: 1 });
  }, [updateParams]);

  // Handle retry
  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  // Loading state
  if (isLoading && !data) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            User Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and monitor all users registered in your store
          </p>
        </div>
        <UserFiltersSkeleton />
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="animate-spin text-rose-500" size={40} />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            User Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and monitor all users registered in your store
          </p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 shadow-sm p-8 text-center">
          <div className="text-red-500 mb-4">
            <div className="w-12 h-12 mx-auto bg-red-50 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-lg font-semibold mt-3">Error loading users</h2>
            <p className="text-sm text-red-400 mt-1">
              {error.message || 'Something went wrong'}
            </p>
          </div>
          <Button
            onClick={handleRetry}
            variant="outline"
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const users = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 15, totalPages: 1 };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            User Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and monitor all users registered in your store
          </p>
        </div>
        {isFetching && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Refreshing...
          </div>
        )}
      </div>

      {/* Filters */}
      <UserFilters />

      {/* Table with Pagination */}
      <UserTable
        data={users}
        isLoading={isLoading}
        pageCount={meta.totalPages}
        totalItems={meta.total}
        currentPage={params.page}
        pageSize={params.limit}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}