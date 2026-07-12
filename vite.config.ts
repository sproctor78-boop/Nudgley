import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: 'react-index.html'
    }
  },
  test: {
    environment: 'node',
    globals: true,
    css: true
  }
});
