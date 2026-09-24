import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },

  server: {
    port: 5173,
    host: true,
    hmr: {
      host: 'localhost',
      port: 5173,
    },
    proxy: {
      // Lets the dev server talk to the NestJS backend without CORS.
      '/api': { target: 'http://localhost:3000', changeOrigin: true },
    },
  },

  preview: { port: 4173 },

  build: {
    outDir: 'dist',
    sourcemap: false,
    // Raised because the vendor chunks below are intentionally large and
    // long-cached; warning on them every build is just noise.
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        /*
         * Split the heavy, rarely-changing dependencies into their own
         * chunks. Recharts in particular is ~400 kB and is only needed on
         * dashboards and reports — bundling it with app code would force
         * every user to re-download it on each release.
         */
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return undefined;
          if (/[\\/]node_modules[\\/](recharts|d3-|victory)/.test(id)) return 'vendor-charts';
          if (/[\\/]node_modules[\\/](react-router|react-dom|react)[\\/]/.test(id)) return 'vendor-react';
          if (/[\\/]node_modules[\\/](@tanstack|axios)/.test(id)) return 'vendor-query';
          if (/[\\/]node_modules[\\/](react-hook-form|zod|@hookform)/.test(id)) return 'vendor-forms';
          if (/[\\/]node_modules[\\/](@radix-ui|lucide-react)/.test(id)) return 'vendor-ui';
          return 'vendor';
        },
      },
    },
  },
});
