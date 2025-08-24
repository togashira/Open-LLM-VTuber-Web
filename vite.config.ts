// ~/Open-LLM-VTuber-Web/vite.config.ts
import { defineConfig, normalizePath } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';

export default defineConfig({
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
  build: {
    outDir: 'dist', // 統一出力先
    emptyOutDir: true,
    rollupOptions: {
      input: './src/renderer/src/chatbox-entry.js',
      output: {
        entryFileNames: 'chatbox.js',
        format: 'iife',
        name: 'ITComeTrueChat',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    minify: 'esbuild',
    sourcemap: false,
  },
});