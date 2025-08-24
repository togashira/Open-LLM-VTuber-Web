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
            src: normalizePath(path.resolve(path.dirname(new URL(import.meta.url).pathname), 'node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js')),
            dest: './libs/',
          },
          {
            src: normalizePath(path.resolve(path.dirname(new URL(import.meta.url).pathname), 'node_modules/@ricky0123/vad-web/dist/silero_vad_v5.onnx')),
            dest: './libs/',
          },
          {
            src: normalizePath(path.resolve(path.dirname(new URL(import.meta.url).pathname), 'node_modules/@ricky0123/vad-web/dist/silero_vad_legacy.onnx')),
            dest: './libs/',
          },
          {
            src: normalizePath(path.resolve(path.dirname(new URL(import.meta.url).pathname), 'node_modules/onnxruntime-web/dist/*.wasm')),
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
        rollupOptions: {
          input: './src/renderer/src/chatbox-entry.tsx',
          external: ['@cubism/live2d-sdk'],
          output: {
            entryFileNames: 'chatbox.js',
            format: 'iife',
            name: 'ITComeTrueChat',
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              '@cubism/live2d-sdk': 'Live2DCubismCore',
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
        '@': path.resolve(path.dirname(new URL(import.meta.url).pathname), './src/renderer/src'),
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
