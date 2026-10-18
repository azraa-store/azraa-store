import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
  },
  build: {
    target: 'es2020',
    assetsInlineLimit: 0, // keep the hero photograph a real file, not a data URI
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) return 'react';
          if (id.includes('gsap') || id.includes('lenis')) return 'motion';
          // Only used by the sign-up page's phone country picker — leave it
          // out of the eagerly-loaded vendor chunk so it code-splits with
          // SignUpPage's own lazy chunk instead.
          if (id.includes('country-codes-list')) return;
          return 'vendor';
        },
      },
    },
  },
});
