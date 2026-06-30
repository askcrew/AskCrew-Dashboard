// ============================================================================
// ENVIRONMENT CONFIGURATION
// ============================================================================
// Direct API connection for testing
// ============================================================================

export const CONFIG = {
  API_BASE_URL: 'https://admin.askcrews.com/api/v1',
  ENABLE_MOCK_DATA: false,
  // Simulated network latency (ms) used only while ENABLE_MOCK_DATA is true
  MOCK_DELAY: 800,
} as const
