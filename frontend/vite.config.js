import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    https: false, // Desactiva HTTPS para el servidor de desarrollo
    host: 'localhost',
    port: 5173,
  },
});