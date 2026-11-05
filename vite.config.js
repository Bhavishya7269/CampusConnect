import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'https://hello-world-workshop.onrender.com',
        changeOrigin: true,
        secure: false,
        headers: {
          'X-User-Id': 'afe3e3e8-1da8-4994-ad64-204224881b51'
        }
      }
    }
  }
});
