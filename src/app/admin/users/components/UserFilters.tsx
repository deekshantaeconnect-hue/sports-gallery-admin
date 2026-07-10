// src/app/admin/users/components/UserFilters.tsx

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Filter, RotateCcw, X } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useUserQueryParams } from "@/hooks/useUserQueryParams";
import { Role } from "@/types/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/admin/ui/Switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/admin/ui/Badge";
import { UserDateFilter } from "./UserDateFilter";
import { UserStoreFilter } from "./UserStoreFilter";
import { UserExportButton } from "./UserExportButton";

const ALL_OPTION_VALUE = "__all__";

const ROLE_OPTIONS = [
  { label: "All Roles", value: ALL_OPTION_VALUE },
  { label: "Super Admin", value: Role.SUPER_ADMIN },
  { label: "Store Manager", value: Role.STORE_MANAGER },
  { label: "Support Staff", value: Role.SUPPORT_STAFF },
  { label: "Vendor", value: Role.VENDOR },
  { label: "User", value: Role.USER },
];

const VERIFICATION_OPTIONS = [
  { label: "All", value: ALL_OPTION_VALUE },
  { label: "Verified", value: "verified" },
  { label: "Unverified", value: "unverified" },
];

export const UserFilters: React.FC = () => {
  const { params, updateParams, resetFilters } = useUserQueryParams();
  const [searchTerm, setSearchTerm] = useState(params.search || "");
  const [role, setRole] = useState<Role | typeof ALL_OPTION_VALUE>(
    params.role ?? ALL_OPTION_VALUE,
  );
  const [isActive, setIsActive] = useState<boolean | undefined>(params.isActive);
  const [emailVerified, setEmailVerified] = useState<boolean | undefined>(params.emailVerified);
  const [phoneVerified, setPhoneVerified] = useState<boolean | undefined>(params.phoneVerified);
  const [hasEmail, setHasEmail] = useState<boolean | undefined>(params.hasEmail);
  const [hasPhone, setHasPhone] = useState<boolean | undefined>(params.hasPhone);
  
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Sync search to URL
  useEffect(() => {
    if (debouncedSearch === params.search) return;
    updateParams({ search: debouncedSearch || undefined });
  }, [debouncedSearch, params.search, updateParams]);

  // Sync role to URL
  useEffect(() => {
    const normalizedRole = role === ALL_OPTION_VALUE ? undefined : role;
    if (normalizedRole === params.role) return;
    updateParams({ role: normalizedRole });
  }, [role, params.role, updateParams]);

  // Sync isActive to URL
  useEffect(() => {
    if (isActive === params.isActive) return;
    updateParams({ isActive });
  }, [isActive, params.isActive, updateParams]);

  // Sync emailVerified to URL
  useEffect(() => {
    if (emailVerified === params.emailVerified) return;
    updateParams({ emailVerified });
  }, [emailVerified, params.emailVerified, updateParams]);

  // Sync phoneVerified to URL
  useEffect(() => {
    if (phoneVerified === params.phoneVerified) return;
    updateParams({ phoneVerified });
  }, [phoneVerified, params.phoneVerified, updateParams]);

  // Count active filters
  const filterCount = useMemo(() => {
    let count = 0;
    if (params.search) count++;
    if (params.role) count++;
    if (params.isActive !== undefined) count++;
    if (params.emailVerified !== undefined) count++;
    if (params.phoneVerified !== undefined) count++;
    if (params.hasEmail !== undefined) count++;
    if (params.hasPhone !== undefined) count++;
    if (params.registrationFrom || params.registrationTo) count++;
    if (params.lastLoginFrom || params.lastLoginTo) count++;
    if (params.storeId) count++;
    return count;
  }, [params]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
      {/* Primary Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
            aria-label="Search users"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Role Filter */}
        <Select value={role} onValueChange={(value) => setRole(value === ALL_OPTION_VALUE ? ALL_OPTION_VALUE : (value as Role))}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Store Filter */}
        <UserStoreFilter />

        {/* Status Filter */}
        <Select
          value={isActive !== undefined ? String(isActive) : ALL_OPTION_VALUE}
          onValueChange={(value) => {
            if (value === ALL_OPTION_VALUE) setIsActive(undefined);
            else setIsActive(value === "true");
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all-status" value={ALL_OPTION_VALUE}>All Status</SelectItem>
            <SelectItem key="status-active" value="true">Active</SelectItem>
            <SelectItem key="status-blocked" value="false">Blocked</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Secondary Filter Row */}
      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100">
        {/* Email Verification */}
        <Select
          value={emailVerified !== undefined ? String(emailVerified) : ALL_OPTION_VALUE}
          onValueChange={(value) => {
            if (value === ALL_OPTION_VALUE) setEmailVerified(undefined);
            else setEmailVerified(value === "true");
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Email Verified" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="email-all" value={ALL_OPTION_VALUE}>All</SelectItem>
            <SelectItem key="email-verified" value="true">Verified</SelectItem>
            <SelectItem key="email-unverified" value="false">Unverified</SelectItem>
          </SelectContent>
        </Select>

        {/* Phone Verification */}
        <Select
          value={phoneVerified !== undefined ? String(phoneVerified) : ALL_OPTION_VALUE}
          onValueChange={(value) => {
            if (value === ALL_OPTION_VALUE) setPhoneVerified(undefined);
            else setPhoneVerified(value === "true");
          }}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Phone Verified" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="phone-all" value={ALL_OPTION_VALUE}>All</SelectItem>
            <SelectItem key="phone-verified" value="true">Verified</SelectItem>
            <SelectItem key="phone-unverified" value="false">Unverified</SelectItem>
          </SelectContent>
        </Select>

        {/* Email/Phone Presence Toggles */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Has Email</span>
            <Switch
              checked={!!hasEmail}
              onChange={(checked) => setHasEmail(checked || undefined)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Has Phone</span>
            <Switch
              checked={!!hasPhone}
              onChange={(checked) => setHasPhone(checked || undefined)}
            />
          </div>
        </div>

        {/* Date Filters */}
        <UserDateFilter
          label="Registered"
          fromKey="registrationFrom"
          toKey="registrationTo"
        />
        <UserDateFilter
          label="Last Login"
          fromKey="lastLoginFrom"
          toKey="lastLoginTo"
        />

        {/* Export Button */}
        <div className="ml-auto">
          <UserExportButton />
        </div>
      </div>

      {/* Active filters bar */}
      {filterCount > 0 && (
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-500 font-medium">
            {filterCount} filter{filterCount > 1 ? "s" : ""} active
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-xs text-gray-500 hover:text-gray-700 h-7 px-2"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};