import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import autoprefixer from 'autoprefixer'; // Import directly

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'img/**/*',
          dest: './img'
        }
      ]
    })
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        shop: resolve(__dirname, 'shop.html'),
        blog: resolve(__dirname, 'blog.html'),
        about: resolve(__dirname, 'about.html'),
        contact: resolve(__dirname, 'contact.html'),
        addtocart: resolve(__dirname, 'addtocart.html'),
        checkout: resolve(__dirname, 'checkout_page.html'),
        login: resolve(__dirname, 'login.html'),
        signup: resolve(__dirname, 'signup.html'),
        reset: resolve(__dirname, 'reset.html'),
        forget: resolve(__dirname, 'forget.html'),
      },
    },
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer() // Use the imported autoprefixer
      ]
    }
  },
  base: './',
});