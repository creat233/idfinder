
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.74c2a83b7ced4d2cb87e8d1d99308981',
  appName: 'idfinder',
  webDir: 'dist',
  server: {
    url: 'https://74c2a83b-7ced-4d2c-b87e-8d1d99308981.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e40af',
      showSpinner: false
    }
  }
};

export default config;
