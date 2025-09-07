import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Backend proxy setup (adjust port if your backend runs elsewhere)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4000'
    }
  }
});
