import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // GitHub Pages 배포 시에만 서브폴더 경로 사용
    const base = process.env.NODE_ENV === 'production' ? '/zogakzogak/' : '/';
    
    return {
      base,
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      server: {
        proxy: {
          '/api': {
            target: 'http://54.180.125.150:8080',
            changeOrigin: true,
            secure: false,
            rewrite: (path) => path.replace(/^\/api/, '/api')
          }
        }
      },
      build: {
        rollupOptions: {
          output: {
            assetFileNames: (assetInfo) => {
              if (assetInfo.name === 'sw.js') {
                return 'sw.js';
              }
              return 'assets/[name]-[hash][extname]';
            }
          }
        }
      }
    };
});
