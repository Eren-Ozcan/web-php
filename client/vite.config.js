import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // tüm arayüzleri dinle
    port: 5173,
    // hem localhost'u hem tüm ngrok domainlerini kabul et
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      // tüm *.ngrok-free.dev alan adlarını kabul et (regex)
      /\.ngrok-free\.dev$/
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
