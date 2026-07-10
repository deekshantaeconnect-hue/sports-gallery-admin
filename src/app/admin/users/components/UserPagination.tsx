// src/app/admin/users/components/UserPagination.tsx

"use client";

import React, { useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading?: boolean;
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const UserPagination: React.FC<UserPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const handlePageSizeChange = useCallback((value: string) => {
    onPageSizeChange(Number(value));
  }, [onPageSizeChange]);

  const canGoPrevious = currentPage > 1 && !isLoading;
  const canGoNext = currentPage < totalPages && !isLoading;

  // Generate page numbers for display (show at most 5)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('…');
      }
      
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('…');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  if (totalItems === 0) {
    return (
      <div className="flex items-center justify-between px-2 py-3 text-sm text-gray-500">
        <span>No users found</span>
        <div className="flex items-center gap-2">
          <span>Show</span>
          <Select
            value={String(pageSize)}
            onValueChange={handlePageSizeChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[80px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>per page</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-3">
      {/* Results info */}
      <div className="text-sm text-gray-500">
        Showing <span className="font-medium text-gray-900">{startItem}</span> to{" "}
        <span className="font-medium text-gray-900">{endItem}</span> of{" "}
        <span className="font-medium text-gray-900">{totalItems}</span> users
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-4">
        {/* Page size selector */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="hidden sm:inline">Show</span>
          <Select
            value={String(pageSize)}
            onValueChange={handlePageSizeChange}
            disabled={isLoading}
          >
            <SelectTrigger className="w-[80px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="hidden sm:inline">per page</span>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          {/* First page */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(1)}
            disabled={!canGoPrevious}
            aria-label="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* Previous page */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canGoPrevious}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => {
              if (page === '…') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="flex h-8 w-8 items-center justify-center text-sm text-gray-400"
                  >
                    …
                  </span>
                );
              }

              const isActive = page === currentPage;
              return (
                <Button
                  key={page}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-8 p-0 text-sm"
                  onClick={() => onPageChange(Number(page))}
                  disabled={isLoading || isActive}
                  aria-label={`Go to page ${page}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {page}
                </Button>
              );
            })}
          </div>

          {/* Next page */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canGoNext}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Last page */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onPageChange(totalPages)}
            disabled={!canGoNext}
            aria-label="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};