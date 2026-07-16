// src/app/admin/settings/analytics/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Info,
  Save,
  TestTube,
  XCircle,
} from 'lucide-react';
import { adminAnalytics } from '@/services/admin.analytics.service';
import toast from 'react-hot-toast';

// Validation schema
const analyticsSchema = z.object({
  enableGoogleAnalytics: z.boolean(),
  googleAnalyticsMeasurementId: z.string()
    .optional()
    .refine(
      (val) => !val || /^G-[A-Z0-9]+$/.test(val),
      { message: 'Must start with G-' }
    ),
  enableGoogleTagManager: z.boolean(),
  googleTagManagerContainerId: z.string()
    .optional()
    .refine(
      (val) => !val || /^GTM-[A-Z0-9]+$/.test(val),
      { message: 'Must start with GTM-' }
    ),
  enableMetaPixel: z.boolean(),
  metaPixelId: z.string()
    .optional()
    .refine(
      (val) => !val || /^\d+$/.test(val),
      { message: 'Must be numeric' }
    ),
  enableMicrosoftClarity: z.boolean(),
  microsoftClarityProjectId: z.string().optional(),
  enableDebugMode: z.boolean(),
});

type AnalyticsFormData = z.infer<typeof analyticsSchema>;

export default function AnalyticsSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    details: any;
  } | null>(null);
  const [showTestDetails, setShowTestDetails] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
    reset,
  } = useForm<AnalyticsFormData>({
    resolver: zodResolver(analyticsSchema),
    defaultValues: {
      enableGoogleAnalytics: false,
      enableGoogleTagManager: false,
      enableMetaPixel: false,
      enableMicrosoftClarity: false,
      enableDebugMode: false,
    },
  });

  // Watch enabled states for conditional rendering
  const enableGA = watch('enableGoogleAnalytics');
  const enableGTM = watch('enableGoogleTagManager');
  const enableMeta = watch('enableMetaPixel');
  const enableClarity = watch('enableMicrosoftClarity');
  const debugMode = watch('enableDebugMode');

  // Load config on mount
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoading(true);
      const config = await adminAnalytics.getConfig();
   

      reset(config);
    } catch (error: any) {
      console.error('Failed to load analytics config:', error);
      toast.error(error?.message || 'Failed to load analytics configuration');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: AnalyticsFormData) => {
    try {
      setSaving(true);
      await adminAnalytics.updateConfig(data);
      // Reset dirty state
      reset(data);
      
      // Show success toast
      toast.success('Analytics configuration saved successfully!');
    } catch (error: any) {
      console.error('Failed to save analytics config:', error);
      
      // Extract error message from response
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to save analytics configuration';
      
      // Show error toast with details
      toast.error(errorMessage);
      
      // If there are validation errors, show them
      if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        errors.forEach((err: string) => {
          toast.error(err);
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    try {
      setTesting(true);
      setTestResult(null);
      
      const result = await adminAnalytics.testConfig();
      setTestResult(result);
      
      // Show toast based on test result
      if (result.success) {
        toast.success('✅ All analytics configurations are valid!');
      } else {
        toast.error('❌ Configuration issues found. Check details below.');
      }
    } catch (error: any) {
      console.error('Failed to test analytics config:', error);
      toast.error(error?.message || 'Failed to test analytics configuration');
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006044]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
          <Activity className="w-6 h-6 text-[#006044]" />
          Analytics & Tracking
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Configure analytics and tracking services for your store. Each store has its own independent configuration.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Google Analytics */}
        <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">GA</span>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">Google Analytics 4</h3>
                <p className="text-xs text-zinc-500">Track website traffic and user behavior</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                {...register('enableGoogleAnalytics')}
              />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#006044] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006044]"></div>
            </label>
          </div>
          <div className="px-6 py-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Measurement ID
                {enableGA && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                placeholder="G-XXXXXXXXXX"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006044] ${
                  errors.googleAnalyticsMeasurementId ? 'border-red-500' : 'border-zinc-300'
                } ${!enableGA ? 'bg-zinc-50 text-zinc-400' : ''}`}
                disabled={!enableGA}
                {...register('googleAnalyticsMeasurementId')}
              />
              {errors.googleAnalyticsMeasurementId && (
                <p className="mt-1 text-sm text-red-500">{errors.googleAnalyticsMeasurementId.message}</p>
              )}
              {enableGA && (
                <p className="mt-1 text-xs text-zinc-400">Format: G-XXXXXXXXXX (e.g., G-ABCDEF1234)</p>
              )}
            </div>
          </div>
        </div>

        {/* Google Tag Manager */}
        <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">GTM</span>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">Google Tag Manager</h3>
                <p className="text-xs text-zinc-500">Manage all your tracking tags from one place</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                {...register('enableGoogleTagManager')}
              />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#006044] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006044]"></div>
            </label>
          </div>
          <div className="px-6 py-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Container ID
                {enableGTM && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                placeholder="GTM-XXXXXXX"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006044] ${
                  errors.googleTagManagerContainerId ? 'border-red-500' : 'border-zinc-300'
                } ${!enableGTM ? 'bg-zinc-50 text-zinc-400' : ''}`}
                disabled={!enableGTM}
                {...register('googleTagManagerContainerId')}
              />
              {errors.googleTagManagerContainerId && (
                <p className="mt-1 text-sm text-red-500">{errors.googleTagManagerContainerId.message}</p>
              )}
              {enableGTM && (
                <p className="mt-1 text-xs text-zinc-400">Format: GTM-XXXXXXX (e.g., GTM-ABC123)</p>
              )}
            </div>
          </div>
        </div>

        {/* Meta Pixel */}
        <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">M</span>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">Meta Pixel</h3>
                <p className="text-xs text-zinc-500">Track conversions and build audiences</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                {...register('enableMetaPixel')}
              />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#006044] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006044]"></div>
            </label>
          </div>
          <div className="px-6 py-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Pixel ID
                {enableMeta && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                placeholder="123456789012345"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006044] ${
                  errors.metaPixelId ? 'border-red-500' : 'border-zinc-300'
                } ${!enableMeta ? 'bg-zinc-50 text-zinc-400' : ''}`}
                disabled={!enableMeta}
                {...register('metaPixelId')}
              />
              {errors.metaPixelId && (
                <p className="mt-1 text-sm text-red-500">{errors.metaPixelId.message}</p>
              )}
              {enableMeta && (
                <p className="mt-1 text-xs text-zinc-400">Numeric ID from Meta Business Suite</p>
              )}
            </div>
          </div>
        </div>

        {/* Microsoft Clarity */}
        <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">C</span>
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">Microsoft Clarity</h3>
                <p className="text-xs text-zinc-500">Session recordings and heatmaps</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                {...register('enableMicrosoftClarity')}
              />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#006044] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006044]"></div>
            </label>
          </div>
          <div className="px-6 py-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">
                Project ID
                {enableClarity && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                placeholder="abc123xyz"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006044] ${
                  errors.microsoftClarityProjectId ? 'border-red-500' : 'border-zinc-300'
                } ${!enableClarity ? 'bg-zinc-50 text-zinc-400' : ''}`}
                disabled={!enableClarity}
                {...register('microsoftClarityProjectId')}
              />
              {errors.microsoftClarityProjectId && (
                <p className="mt-1 text-sm text-red-500">{errors.microsoftClarityProjectId.message}</p>
              )}
              {enableClarity && (
                <p className="mt-1 text-xs text-zinc-400">Project ID from Clarity dashboard</p>
              )}
            </div>
          </div>
        </div>

        {/* Debug Mode */}
        <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                {debugMode ? (
                  <Eye className="w-4 h-4 text-amber-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-amber-400" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900">Debug Mode</h3>
                <p className="text-xs text-zinc-500">Log all analytics events to console for testing</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                {...register('enableDebugMode')}
              />
              <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#006044] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006044]"></div>
            </label>
          </div>
          {debugMode && (
            <div className="px-6 py-3 border-t border-zinc-100 bg-amber-50">
              <p className="text-xs text-amber-700 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Debug mode is enabled. All analytics events will be logged to the browser console.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-200">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTest}
              disabled={testing || saving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 rounded-lg hover:bg-zinc-200 disabled:opacity-50 transition-colors"
            >
              {testing ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-zinc-700 border-t-transparent rounded-full"></span>
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="w-4 h-4" />
                  Test Configuration
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={loadConfig}
              className="px-4 py-2 text-sm font-medium text-zinc-600 border border-zinc-300 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isDirty || saving}
              className={`flex items-center gap-2 px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                isDirty && !saving
                  ? 'bg-[#006044] hover:bg-[#004d33]'
                  : 'bg-zinc-300 cursor-not-allowed'
              }`}
            >
              {saving ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResult && (
          <div className={`p-4 rounded-lg border ${
            testResult.success 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-3">
              {testResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className={`font-medium ${
                  testResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {testResult.success ? '✅ All configurations are valid' : '❌ Configuration issues found'}
                </p>
                <p className="text-sm text-zinc-600 mt-1">{testResult.message}</p>
                
                {testResult.details && (
                  <button
                    onClick={() => setShowTestDetails(!showTestDetails)}
                    className="text-xs text-[#006044] hover:underline mt-2"
                  >
                    {showTestDetails ? 'Hide details' : 'Show details'}
                  </button>
                )}

                {showTestDetails && testResult.details && (
                  <div className="mt-3 space-y-2">
                    {Object.entries(testResult.details).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-zinc-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span className={value.valid !== false ? 'text-green-600' : 'text-red-600'}>
                          {value.enabled ? (
                            value.valid !== false ? '✅ Valid' : '❌ Invalid'
                          ) : '⏭️ Disabled'}
                          {value.enabled && value.measurementId && ` (${value.measurementId})`}
                          {value.enabled && value.containerId && ` (${value.containerId})`}
                          {value.enabled && value.pixelId && ` (${value.pixelId})`}
                          {value.enabled && value.projectId && ` (${value.projectId})`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}