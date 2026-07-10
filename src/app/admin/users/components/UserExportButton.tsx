// src/app/admin/users/components/UserExportButton.tsx

"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserQueryParams } from "@/hooks/useUserQueryParams";
import { userService } from "@/services/user.service";
import toast from "react-hot-toast";

export const UserExportButton: React.FC = () => {
  const { params } = useUserQueryParams();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'csv' | 'excel' = 'csv') => {
    setIsExporting(true);
    try {
      // Build export params from current filters
      const exportParams = {
        search: params.search,
        role: params.role,
        isActive: params.isActive,
        isVerified: params.isVerified,
        registrationFrom: params.registrationFrom,
        registrationTo: params.registrationTo,
        lastLoginFrom: params.lastLoginFrom,
        lastLoginTo: params.lastLoginTo,
        format,
      };

      // Call export endpoint
      const response = await userService.exportUsers(exportParams);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users_export_${Date.now()}.${format === 'csv' ? 'csv' : 'xlsx'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(`Users exported successfully as ${format.toUpperCase()}`);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to export users');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isExporting}
          className="flex items-center gap-2"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};