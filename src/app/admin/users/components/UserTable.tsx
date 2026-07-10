// src/app/admin/users/components/UserTable.tsx

"use client";

import React from "react";
import { DataTable } from "@/components/admin/ui/DataTable";
import { userTableColumns } from "./UserTableColumns";
import { UserPagination } from "./UserPagination";
import { User } from "@/types/user.types";

interface UserTableProps {
  data: User[];
  isLoading: boolean;
  pageCount: number;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  data,
  isLoading,
  pageCount,
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  return (
    <div className="space-y-4">
      <DataTable
        columns={userTableColumns}
        data={data}
        pageCount={pageCount}
        totalItems={totalItems}
        isLoading={isLoading}
        currentPage={currentPage}
        onPageChange={onPageChange}
        noBorder={false}
      />
      
      <UserPagination
        currentPage={currentPage}
        totalPages={pageCount}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        isLoading={isLoading}
      />
    </div>
  );
};