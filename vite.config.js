import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    open: '/examples/00-intro.html',
  },
  build: {
    rollupOptions: {
      input: {
        intro: 'examples/00-intro.html',
      },
    },
  },
});
