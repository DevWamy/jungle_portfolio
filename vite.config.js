import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    host: true,  // <-- Permet l'accès réseau sur toutes les interfaces (pas que localhost)
    port: 5173,
  },
})
