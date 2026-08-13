import { build } from 'esbuild-wasm';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

async function runBuild() {
  console.log('📦 Starting Cerita Metro production build...');

  if (!existsSync('dist')) {
    mkdirSync('dist', { recursive: true });
  }
  if (!existsSync('dist/assets')) {
    mkdirSync('dist/assets', { recursive: true });
  }

  await build({
    stdin: {
      contents: readFileSync('./src/main.js', 'utf-8'),
      resolveDir: resolve('src'),
      loader: 'js'
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
              return { path: fullPath };
            } else if (!args.path.startsWith('/')) {
              try {
                const pkgDir = resolve('node_modules', args.path);
                if (existsSync(pkgDir + '/package.json')) {
                  const pkgJson = JSON.parse(readFileSync(pkgDir + '/package.json', 'utf8'));
                  const mainFile = pkgJson.module || pkgJson.main || 'index.js';
                  return { path: resolve(pkgDir, mainFile) };
                }
              } catch (e) {}
            }
            return null;
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

  let html = readFileSync('index.html', 'utf-8');
  html = html.replace('<script type="module" src="./src/main.js"></script>', '<script type="module" src="./assets/bundle.js"></script>');
  html = html.replace('<link rel="stylesheet" href="./src/styles.css" />', '<link rel="stylesheet" href="./assets/bundle.css" />');

  writeFileSync('dist/index.html', html);

  console.log('✅ Build completed successfully! Assets output to dist/');
}

runBuild().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
