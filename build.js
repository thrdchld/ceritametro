import { build } from 'esbuild-wasm';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { createHash } from 'crypto';

async function runBuild() {
  console.log('📦 Starting Cerita Metro production build...');

  if (!existsSync('dist')) {
    mkdirSync('dist', { recursive: true });
  }
  if (!existsSync('dist/assets')) {
    mkdirSync('dist/assets', { recursive: true });
  }

  // Compute password hash from GitHub Secret or environment variable
  let passwordHash = '';
  if (process.env.APP_PASSWORD_HASH && process.env.APP_PASSWORD_HASH.trim()) {
    passwordHash = process.env.APP_PASSWORD_HASH.trim();
  } else if (process.env.APP_PASSWORD && process.env.APP_PASSWORD.trim()) {
    passwordHash = createHash('sha256').update(process.env.APP_PASSWORD.trim()).digest('hex');
    console.log('🔒 Master password configured from environment variable (hashed with SHA-256).');
  }

  await build({
    stdin: {
      contents: readFileSync('./src/main.js', 'utf-8'),
      resolveDir: resolve('src'),
      loader: 'js'
    },
    define: {
      '__APP_PASSWORD_HASH__': JSON.stringify(passwordHash),
      'globalThis.__APP_PASSWORD_HASH__': JSON.stringify(passwordHash),
      'window.__APP_PASSWORD_HASH__': JSON.stringify(passwordHash)
    },
    plugins: [
      {
        name: 'local-file-resolver',
        setup(b) {
          b.onResolve({ filter: /.*/ }, args => {
            if (args.path.startsWith('.')) {
              let fullPath = resolve(args.resolveDir, args.path);
              if (!existsSync(fullPath) && existsSync(fullPath + '.js')) fullPath += '.js';
              if (!existsSync(fullPath) && existsSync(fullPath + '.json')) fullPath += '.json';
              return { path: fullPath, namespace: 'metro-ns' };
            } else if (!args.path.startsWith('/')) {
              try {
                const subpathResolved = resolve('node_modules', args.path);
                if (existsSync(subpathResolved)) return { path: subpathResolved, namespace: 'metro-ns' };
                if (existsSync(subpathResolved + '.js')) return { path: subpathResolved + '.js', namespace: 'metro-ns' };

                const pkgDir = resolve('node_modules', args.path);
                if (existsSync(pkgDir + '/package.json')) {
                  const pkgJson = JSON.parse(readFileSync(pkgDir + '/package.json', 'utf8'));
                  const mainFile = pkgJson.module || pkgJson.main || 'index.js';
                  let resolvedMain = resolve(pkgDir, mainFile);
                  if (!existsSync(resolvedMain) && existsSync(resolvedMain + '.js')) resolvedMain += '.js';
                  return { path: resolvedMain, namespace: 'metro-ns' };
                }
              } catch (e) {}
            }
            return null;
          });

          b.onLoad({ filter: /.*/, namespace: 'metro-ns' }, args => {
            const contents = readFileSync(args.path, 'utf-8');
            const loader = args.path.endsWith('.css') ? 'css' : args.path.endsWith('.json') ? 'json' : 'js';
            return {
              contents,
              loader,
              resolveDir: resolve(args.path, '..')
            };
          });
        }
      }
    ],
    bundle: true,
    minify: true,
    sourcemap: false,
    target: ['es2020'],
    outfile: 'dist/assets/bundle.js',
    loader: {
      '.css': 'css',
      '.json': 'json'
    }
  });

  const timestamp = Date.now();
  let html = readFileSync('index.html', 'utf-8');
  html = html.replace('<script type="module" src="./src/main.js"></script>', `<script type="module" src="./assets/bundle.js?v=${timestamp}"></script>`);
  html = html.replace('<link rel="stylesheet" href="./src/styles.css" />', `<link rel="stylesheet" href="./assets/bundle.css?v=${timestamp}" />`);

  writeFileSync('dist/index.html', html);

  console.log('✅ Build completed successfully! Assets output to dist/');
}

runBuild().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
