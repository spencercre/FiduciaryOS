import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('/firebase/') || id.includes('\\firebase\\') || id.includes('node_modules/firebase')) return 'firebase';
          if (id.includes('/react/') || id.includes('\\react\\') || id.includes('node_modules/react')) return 'react';
          if (id.includes('/react-dom/') || id.includes('\\react-dom\\') || id.includes('node_modules/react-dom')) return 'react-dom';
          if (id.includes('/lucide-react/') || id.includes('\\lucide-react\\') || id.includes('node_modules/lucide-react')) return 'icons';
          return 'vendor';
        },
      },
    },
  },
})
