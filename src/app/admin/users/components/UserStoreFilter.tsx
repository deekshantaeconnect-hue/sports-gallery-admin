// src/app/admin/users/components/UserStoreFilter.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/admin/ui/Badge";
import { useUserQueryParams } from "@/hooks/useUserQueryParams";
import apiClient from "@/lib/api-client";

interface StoreOption {
  id: string;
  name: string;
  slug: string;
}

export const UserStoreFilter: React.FC = () => {
  const { params, updateParams } = useUserQueryParams();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStores, setSelectedStores] = useState<string[]>(() => {
    // Parse storeId from params (could be comma-separated)
    const storeId = params.storeId;
    if (!storeId) return [];
    return storeId.split(',');
  });

  // Fetch stores for the current tenant
  const { data: stores, isLoading } = useQuery({
    queryKey: ['admin-stores'],
    queryFn: async () => {
      const response = await apiClient.get<StoreOption[]>('/admin/stores');
      return response;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Sync selected stores to URL
  useEffect(() => {
    const storeIdParam = selectedStores.length > 0 ? selectedStores.join(',') : undefined;
    if (storeIdParam === params.storeId) return;
    updateParams({ storeId: storeIdParam });
  }, [selectedStores, params.storeId, updateParams]);

  const toggleStore = (storeId: string) => {
    setSelectedStores((prev) =>
      prev.includes(storeId)
        ? prev.filter((id) => id !== storeId)
        : [...prev, storeId]
    );
  };

  const removeStore = (storeId: string) => {
    setSelectedStores((prev) => prev.filter((id) => id !== storeId));
  };

  const clearAll = () => {
    setSelectedStores([]);
  };

  const getStoreName = (storeId: string) => {
    return stores?.find((s) => s.id === storeId)?.name || storeId;
  };

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            <span className="truncate">
              {selectedStores.length > 0
                ? `${selectedStores.length} store${selectedStores.length > 1 ? 's' : ''} selected`
                : "All Stores"}
            </span>
            {isLoading ? (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput 
              placeholder="Search stores..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandEmpty>No stores found.</CommandEmpty>
            {stores && stores.length > 0 && (
              <CommandGroup>
                {stores.map((store) => (
                  <CommandItem
                    key={store.id}
                    value={store.id}
                    onSelect={() => toggleStore(store.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedStores.includes(store.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <span className="truncate">{store.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected stores badges */}
      {selectedStores.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedStores.map((storeId) => (
            <Badge key={storeId} variant="neutral" className="text-xs">
              {getStoreName(storeId)}
              <button
                onClick={() => removeStore(storeId)}
                className="ml-1 hover:text-gray-700"
                aria-label={`Remove ${getStoreName(storeId)} filter`}
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {selectedStores.length > 1 && (
            <button
              onClick={clearAll}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
};