import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://ncaufma.github.io',
  output: 'static',
  integrations: [icon()],
  build: {
    assets: '_assets',
  },
  redirects: {
    '/': '/en/',
    '/about': '/en/about/',
    '/team': '/en/team/',
    '/projects': '/en/projects/',
    '/research-areas': '/en/research-areas/',
    '/publications': '/en/publications/',
    '/collaborations': '/en/collaborations/',
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
