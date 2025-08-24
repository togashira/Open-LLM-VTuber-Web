// ~/Open-LLM-VTuber-Web/vite.config.ts
import { defineConfig, normalizePath } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

export default defineConfig(({ mode }) => {
  const baseConfig = {
    plugins: [
      viteStaticCopy({
        targets: [
          {
            src: normalizePath(path.resolve(__dirname, 'node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js')),
            dest: './libs/',
          },
          {
            src: normalizePath(path.resolve(__dirname, 'node_modules/@ricky0123/vad-web/dist/silero_vad_v5.onnx')),
            dest: './libs/',
          },
          {
            src: normalizePath(path.resolve(__dirname, 'node_modules/@ricky0123/vad-web/dist/silero_vad_legacy.onnx')),
            dest: './libs/',
          },
          {
            src: normalizePath(path.resolve(__dirname, 'node_modules/onnxruntime-web/dist/*.wasm')),
            dest: './libs/',
          },
        ],
      }),
      react(),
    ],
    root: '.',
    publicDir: 'public',
    base: '/',
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/chat': {
          target: 'https://api.itcometrue.academy',
          changeOrigin: true,
          secure: true,
        },
        '/asr': {
          target: 'https://api.itcometrue.academy',
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };

  if (mode === 'web') {
    return {
      ...baseConfig,
      build: {
        outDir: 'dist/web',
        emptyOutDir: true,
        lib: {
          entry: './src/renderer/src/chatbox-entry.tsx',
          name: 'ITComeTrueChat',
          formats: ['iife'],
        },
        rollupOptions: {
          output: {
            entryFileNames: (chunkInfo) => {
              const date = new Date().toISOString().slice(0,10).replace(/-/g, '');
              return `chatbox-${date}_1.js`;
            },
            assetFileNames: (assetInfo) => {
              const date = new Date().toISOString().slice(0,10).replace(/-/g, '');
              if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                return `chatbox-${date}_2.css`;
              }
              return assetInfo.name || '[name]';
            },
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
            },
          },
        },
        minify: 'esbuild',
        sourcemap: false,
      },
    };
  }

  // Electronデフォルト設定（現状維持）
  return {
    ...baseConfig,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/renderer/src'),
    },
  },
    build: {
      outDir: 'out/renderer',
      rollupOptions: {
        input: './src/renderer/index.html',
      },
    },
  };
});
