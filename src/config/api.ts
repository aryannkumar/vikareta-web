// API Configuration with fallback support
export const API_CONFIG = {
  // Primary API URLs (in order of preference)
  apiUrls: [
    process.env.NEXT_PUBLIC_API_URL_PRIMARY || 'https://api.vikareta.com/api/v1',
    process.env.NEXT_PUBLIC_API_URL_SECONDARY || 'https://api.vikareta.com/api/v1',
  ].filter(Boolean),

  // WebSocket URLs
  wsUrls: [
    process.env.NEXT_PUBLIC_WS_URL_PRIMARY || 'wss://api.vikareta.com',
    process.env.NEXT_PUBLIC_WS_URL_SECONDARY || 'wss://api.vikareta.com',
  ].filter(Boolean),

  // App URL
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://vikareta.com',

  // Timeout settings
  timeout: 10000, // 10 seconds
  retryAttempts: 2,
};

// Function to get the best available API URL
export const getApiUrl = async (): Promise<string> => {
  for (const url of API_CONFIG.apiUrls) {
    try {
      // Create AbortController for timeout functionality
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      // Test if the API is reachable
      const response = await fetch(`${url}/health`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        console.log(`Using API URL: ${url}`);
        return url;
      }
    } catch (error) {
      console.warn(`API URL ${url} is not reachable:`, error);
      continue;
    }
  }

  // Fallback to the first URL if none are reachable
  console.warn('No API URLs are reachable, using fallback:', API_CONFIG.apiUrls[0]);
  return API_CONFIG.apiUrls[0];
};

// Function to get the best available WebSocket URL
export const getWsUrl = async (): Promise<string> => {
  // For now, return the first WS URL
  // You can implement similar logic as getApiUrl if needed
  return API_CONFIG.wsUrls[0];
};

export default API_CONFIG;