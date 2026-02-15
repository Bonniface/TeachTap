
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Fix: Property 'cwd' does not exist on type 'Process' in some environments where Node types are not fully loaded.
  // We cast process to any to safely access the current working directory for env loading.
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY)
    },
    build: {
      outDir: 'dist',
      target: 'esnext'
    },
    server: {
      port: 3000
    }
  };
});
