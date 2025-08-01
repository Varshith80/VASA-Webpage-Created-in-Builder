#!/usr/bin/env node

import { build } from 'vite';
import path from 'path';

async function testBuild() {
  try {
    console.log('🔨 Testing Vercel build...');
    
    await build({
      root: process.cwd(),
      publicDir: 'public',
      build: {
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: false,
        minify: 'esbuild',
      },
      plugins: [
        (await import('@vitejs/plugin-react-swc')).default()
      ],
      resolve: {
        alias: {
          '@': path.resolve(process.cwd(), './client'),
          '@shared': path.resolve(process.cwd(), './shared'),
        },
      },
    });
    
    console.log('✅ Test build completed!');
  } catch (error) {
    console.error('❌ Test build failed:', error);
  }
}

testBuild();
