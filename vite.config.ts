import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // GitHub Pages 배포 시에만 서브폴더 경로 사용
    const base = process.env.NODE_ENV === 'production' ? '/zogakzogak/' : '/';
    
    return {
      base,
      define: {
        'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'import.meta.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            assetFileNames: 'assets/[name].[hash].[ext]'
          }
        }
      },
      server: {
        headers: {
          'Service-Worker-Allowed': '/'
        }
      }
    };
});
