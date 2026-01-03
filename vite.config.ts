
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Garante que o process.env seja acessível no frontend conforme exigido pelo SDK Gemini
    'process.env': process.env
  }
});
