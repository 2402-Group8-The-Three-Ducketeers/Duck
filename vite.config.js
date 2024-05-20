import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: ["kaboom"],
  },
server: {
  proxy:{
  "/auth" : "http://localhost:8080", 
  "/api" : "http://localhost:8080"

  }
}, 
  plugins: [react()],
})
