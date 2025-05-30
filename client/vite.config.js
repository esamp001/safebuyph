import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      strictPort: true, // This will prevent Vite from trying the next available port
      proxy: {
        '/api': {
          target: 'http://localhost:3000', // Your backend
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: 'localhost',
          // Optionally, remove 'secure' flag from cookies for local dev
          configure: (proxy, options) => {
            proxy.on('proxyRes', (proxyRes, req, res) => {
              let cookies = proxyRes.headers['set-cookie'];
              if (cookies) {
                cookies = cookies.map((cookie) =>
                  cookie
                    .replace(/;(\s)?secure/gi, '')
                    .replace(/;(\s)?SameSite=Lax/gi, ';SameSite=Lax')
                );
                proxyRes.headers['set-cookie'] = cookies;
              }
            });
          },
        },
      },
    },
    // Only expose specific environment variables
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_KEY': JSON.stringify(env.VITE_SUPABASE_KEY),
    },
  };
});
