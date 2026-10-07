import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';
import viteImagemin from 'vite-plugin-imagemin';

// https://vite.dev/config/
export default defineConfig(() => {
  const enablePwa =
    process.env.NODE_ENV === 'production' && process.env.VITE_DISABLE_PWA !== 'true';
  const plugins = [react(), tailwindcss()];

  if (enablePwa) {
    plugins.push(
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.ico',
          'favicon.svg',
          'favicon-16x16.png',
          'favicon-32x32.png',
          'apple-touch-icon.png',
          'og-image.png',
          'og-image.jpg',
          'og-share.jpg',
          'og-image.webp',
          'robots.txt',
          'humans.txt',
          'llms.txt',
          'llms-full.txt',
          'sitemap.xml',
          'sitemap-index.xml',
          'sitemap-pages.xml',
          'sitemap-projets.xml',
          'sitemap-blog.xml',
          'sitemap-images.xml',
          'sitemap-videos.xml',
          'logo.svg',
          'icons/*.png',
        ],
        manifest: {
          name: 'Barthez Kenwou - Portfolio',
          short_name: 'Barthez K.',
          description:
            'Portfolio de Barthez Kenwou - DevOps & Full-Stack JS. Applications web modernes, cloud et CI/CD.',
          theme_color: '#1a1548',
          background_color: '#100e28',
          display: 'standalone',
          scope: '/',
          start_url: '/',
          lang: 'fr-FR',
          icons: [
            {
              src: '/icons/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icons/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/icons/icon-192-maskable.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/icons/icon-512-maskable.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          // Keep SW precache lean - huge 3D/vendor chunks are runtime-cached
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,webmanifest}'],
          // Exclude huge vendor chunks and any helper utilities that change hash on every build
          globIgnores: ['**/vendor.3d-*.js', '**/vendor.motion-*.js', '**/helpers-*.js'],
          runtimeCaching: [
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
            {
              urlPattern: /\/assets\/.*\.js$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'js-assets-cache',
                expiration: {
                  maxEntries: 80,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
            {
              urlPattern: /\/api\//,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                networkTimeoutSeconds: 3,
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts',
                expiration: {
                  maxEntries: 30,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
              },
            },
          ],
        },
      }),
    );
  }

  // Production-only optimizations
  if (process.env.NODE_ENV === 'production') {
    // Compress assets with brotli and gzip
    plugins.push(
      viteCompression({
        algorithm: 'brotliCompress',
        ext: '.br',
        deleteOriginFile: false,
        threshold: 10240,
      }),
      viteCompression({
        algorithm: 'gzip',
        ext: '.gz',
        threshold: 10240,
      }),
    );

    // Image minify needs native tooling - skip in Docker (set VITE_SKIP_IMAGEMIN=true)
    if (process.env.VITE_SKIP_IMAGEMIN !== 'true') {
      plugins.push(
        viteImagemin({
          gifsicle: { optimizationLevel: 7, interlaced: false },
          optipng: { optimizationLevel: 7 },
          mozjpeg: { quality: 75 },
          pngquant: { quality: [0.7, 0.9], speed: 4 },
          svgo: {
            plugins: [{ name: 'removeViewBox' }, { name: 'removeEmptyAttrs', active: false }],
          },
        }),
      );
    }
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      assetsInlineLimit: 4096,
      brotliSize: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;

            if (id.includes('three') || id.includes('/cobe')) return 'vendor.3d';
            if (
              id.includes('framer-motion') ||
              id.includes('motion-dom') ||
              id.includes('motion-utils') ||
              id.includes('/motion/')
            ) {
              return 'vendor.motion';
            }
            if (id.includes('i18next')) return 'vendor.i18n';
            if (id.includes('lucide-react') || id.includes('react-icons')) return 'vendor.icons';
            if (
              id.includes('react-dom') ||
              id.includes('react-router') ||
              id.includes('/scheduler/') ||
              /node_modules\/(?:react|react-dom)\//.test(id)
            ) {
              return 'vendor.react';
            }
            // Let Vite split the rest - avoid one mega vendor blob
          },
        },
      },
    },
    esbuild: {
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
  };
});
