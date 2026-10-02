import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the built site works from any folder or sub-path on the host.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: { port: 5173 },
  preview: { port: 4173 }
});
