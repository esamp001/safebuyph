import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Your backend
        changeOrigin: true,
        secure: false,
        // This ensures cookies are set for the backend, not the frontend
        cookieDomainRewrite: 'localhost',
        // Optionally, remove 'secure' flag from cookies for local dev
        configure: (proxy, options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            let cookies = proxyRes.headers['set-cookie'];
            if (cookies) {
              proxyRes.headers['set-cookie'] = cookies.map((cookie) =>
                cookie.replace(/;(\s)?secure/gi, '')
              );
            }
          });
        },
      },
    },
  },
});
