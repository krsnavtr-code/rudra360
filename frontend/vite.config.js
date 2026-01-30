import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Proxy API requests to the backend
        '^/api': {
          target: env.VITE_API_URL || 'https://api.funwithjuli.in',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    // Make environment variables available to the client
    define: {
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'https://api.funwithjuli.in'),
    },
  };
});