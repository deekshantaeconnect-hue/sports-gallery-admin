// src/services/admin.analytics.ts

import apiClient from '@/lib/api-client';

export interface AnalyticsConfigData {
  enableGoogleAnalytics: boolean;
  googleAnalyticsMeasurementId?: string;
  enableGoogleTagManager: boolean;
  googleTagManagerContainerId?: string;
  enableMetaPixel: boolean;
  metaPixelId?: string;
  enableMicrosoftClarity: boolean;
  microsoftClarityProjectId?: string;
  enableDebugMode: boolean;
}

export interface TestConfigResponse {
  success: boolean;
  message: string;
  details: {
    googleAnalytics?: {
      enabled: boolean;
      measurementId: string;
      valid: boolean;
    };
    googleTagManager?: {
      enabled: boolean;
      containerId: string;
      valid: boolean;
    };
    metaPixel?: {
      enabled: boolean;
      pixelId: string;
      valid: boolean;
    };
    microsoftClarity?: {
      enabled: boolean;
      projectId: string;
      valid: boolean;
    };
  };
}

/**
 * Get analytics configuration for the current store
 * The backend resolves the store from x-store-slug header or authenticated user
 */
export const getAnalyticsConfig = async (): Promise<AnalyticsConfigData> => {
  const response = await apiClient.get('/admin/settings/analytics');
  return response.data;
};

/**
 * Update analytics configuration for the current store
 */
export const updateAnalyticsConfig = async (
  data: Partial<AnalyticsConfigData>
): Promise<AnalyticsConfigData> => {
  const response = await apiClient.put('/admin/settings/analytics', data);
  return response.data.data;
};

/**
 * Test the current analytics configuration
 */
export const testAnalyticsConfig = async (): Promise<TestConfigResponse> => {
  const response = await apiClient.put('/admin/settings/analytics/test');
  return response.data;
};

/**
 * Get public analytics config for storefront (no auth required)
 * The storeSlug can be a slug or ID, resolved by backend middleware
 */
export const getPublicAnalyticsConfig = async (
  storeSlug: string
): Promise<{
  enableGoogleAnalytics: boolean;
  googleAnalyticsMeasurementId: string | null;
  enableGoogleTagManager: boolean;
  googleTagManagerContainerId: string | null;
  enableMetaPixel: boolean;
  metaPixelId: string | null;
  enableMicrosoftClarity: boolean;
  microsoftClarityProjectId: string | null;
  enableDebugMode: boolean;
}> => {
  try {
    // The backend will resolve the store from the x-store-id header
    // which can be either a slug or ID
    const response = await apiClient.get('/store/settings/analytics/public', {
      headers: {
        'x-store-id': storeSlug,
      },
    });
    return response.data.data;
  } catch (error) {
    // Return safe default if anything fails
    console.warn('[Analytics] Failed to fetch public config, using defaults');
    return {
      enableGoogleAnalytics: false,
      googleAnalyticsMeasurementId: null,
      enableGoogleTagManager: false,
      googleTagManagerContainerId: null,
      enableMetaPixel: false,
      metaPixelId: null,
      enableMicrosoftClarity: false,
      microsoftClarityProjectId: null,
      enableDebugMode: false,
    };
  }
};

/**
 * Track a server-side purchase event (Meta Conversions API / GA4 Measurement Protocol)
 */
export const trackServerPurchase = async (event: {
  transaction_id: string;
  currency: string;
  value: number;
  tax?: number;
  shipping?: number;
  coupon?: string;
  discount?: number;
  items: Array<{
    id: string;
    name: string;
    category?: string;
    brand?: string;
    price: number;
    quantity: number;
    variant?: string;
  }>;
  storeSlug?: string;
}): Promise<void> => {
  await apiClient.post('/analytics/server/purchase', event);
};

// Export all functions as a single object for convenience
export const adminAnalytics = {
  getConfig: getAnalyticsConfig,
  updateConfig: updateAnalyticsConfig,
  testConfig: testAnalyticsConfig,
  getPublicConfig: getPublicAnalyticsConfig,
  trackServerPurchase: trackServerPurchase,
};