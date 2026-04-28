import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ncaufma.github.io',
  base: '/nca.ufma.github.io',
  output: 'static',
  integrations: [],
  build: {
    assets: '_assets',
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
