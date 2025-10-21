import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Legacy site Vite configuration
// This config builds the old portfolio site independently
export default defineConfig({
  root: resolve(__dirname),

  plugins: [react()],

  build: {
    outDir: resolve(__dirname, 'dist-legacy'),
    emptyOutDir: true,
    sourcemap: false, // Minimize legacy bundle

    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  // Legacy site specific settings
  server: {
    port: 5174, // Different port to avoid conflicts
  },
});
