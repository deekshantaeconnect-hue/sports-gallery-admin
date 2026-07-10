// src/types/user.types.ts

import { Order } from './orders';
import { Role } from './types';

/**
 * User status (derived from isActive + deletedAt)
 */
export type UserStatus = 'ACTIVE' | 'BLOCKED' | 'DELETED';

/**
 * Store membership with role
 */
export interface StoreMembership {
  isDefault: import("react/jsx-runtime").JSX.Element;
  id: string;
  storeId: string;
  storeName: string;
  storeSlug: string;
  role: Role;
  isActive: boolean;
  joinedAt: string | Date;
  lastActive: string | Date;
  preferences: Record<string, any>;
}

/**
 * User address (from Address model)
 */
export interface UserAddress {
  id: string;
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

/**
 * Complete User DTO
 * Matches Prisma User model + aggregated data
 */
export interface User {
  defaultStoreName: any;
  id: string;
  name: string;
  email: string | null;
  phone: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | null;
  role: Role;
  isActive: boolean;
  isVerified: boolean;
  lastLogin: string | Date;
  globalId: string;
  
  // Verification timestamps
  emailVerifiedAt?: string | Date | null;
  phoneVerifiedAt?: string | Date | null;
  
  // Timestamps
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt: string | Date | null;
  
  // Aggregated fields (calculated by backend)
  totalOrders: number;
  totalSpend: number;
  
  // Relations (populated on detail view)
  storeMemberships?: StoreMembership[];
  addresses?: UserAddress[];
  orders?: Order[];
}

/**
 * User list response (matches backend pagination)
 */
export interface UserListResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * User query params for list endpoint
 */
export interface UserQueryParams {
  page: number;
  limit: number;
  search?: string; // name, email, phone
  role?: Role;
  isActive?: boolean;
  isVerified?: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  hasEmail?: boolean; // filter users with email
  hasPhone?: boolean; // filter users with phone
  storeId?: string;
  registrationFrom?: string; // ISO date
  registrationTo?: string; // ISO date
  lastLoginFrom?: string; // ISO date
  lastLoginTo?: string; // ISO date
  sortBy?: 'name' | 'email' | 'phone' | 'createdAt' | 'lastLogin' | 'totalOrders' | 'totalSpend';
  sortOrder?: 'asc' | 'desc';
}

/**
 * User mutation payloads
 */
export interface BlockUserPayload {
  reason?: string;
}

export interface UnblockUserPayload {
  reason?: string;
}

export interface UpdateUserRolePayload {
  role: Role;
}

export interface DeleteUserPayload {
  reason?: string;
}

/**
 * User audit log (from OrderAuditLog model)
 */
export interface UserAuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  oldValue: Record<string, any> | null;
  newValue: Record<string, any> | null;
  performedBy: string;
  performedByName: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string | Date;
}

/**
 * User login history (from Session model)
 */
export interface UserLoginHistory {
  id: string;
  sessionToken: string;
  expires: string | Date;
  createdAt: string | Date;
  userAgent?: string;
  ipAddress?: string;
}

/**
 * User order summary (for drawer)
 */
export interface UserOrderSummary {
  totalOrders: number;
  totalSpend: number;
  averageOrderValue: number;
  lastOrderAt: string | Date | null;
  orderStatusCounts: Record<string, number>;
  recentOrders: Array<{
    id: string;
    totalAmount: number;
    status: string;
    paymentStatus: string;
    createdAt: string | Date;
    orderItems: Array<{
      id: string;
      quantity: number;
      price: number;
      product: {
        name: string;
        images: string[];
      };
    }>;
  }>;
}