import { defineConfig } from 'astro/config';

export default defineConfig({
  site: process.env.URL ?? 'http://localhost:4321',
});
