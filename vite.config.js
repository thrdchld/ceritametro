import { defineConfig } from 'vite';
import { createHash } from 'crypto';

let passwordHash = '';
if (process.env.APP_PASSWORD_HASH && process.env.APP_PASSWORD_HASH.trim()) {
  passwordHash = process.env.APP_PASSWORD_HASH.trim();
} else if (process.env.APP_PASSWORD && process.env.APP_PASSWORD.trim()) {
  passwordHash = createHash('sha256').update(process.env.APP_PASSWORD.trim()).digest('hex');
}

export default defineConfig({
  base: './',
  define: {
    '__APP_PASSWORD_HASH__': JSON.stringify(passwordHash)
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});
