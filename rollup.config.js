import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';
import clear from 'rollup-plugin-clear';
// 如果需要压缩 UMD/IIFE 输出，可以添加
// import terser from '@rollup/plugin-terser';

const outDir = 'dist';

const rollupConfig = defineConfig({
  input: 'src/index.ts',
  output: [
    {
      dir: outDir,
      format: 'cjs',
      entryFileNames: 'index.cjs',
      sourcemap: true
    },
    {
      dir: outDir,
      format: 'es',
      entryFileNames: 'index.js',
      sourcemap: true
    },
    {
      dir: outDir,
      format: 'umd',
      name: 'LiryCommonConfig',
      entryFileNames: 'index.umd.js',
      sourcemap: true
    }
  ],
  plugins: [
    clear({
      targets: [outDir]
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: outDir
    }),
    commonjs(),
    resolve()
  ]
});

export default rollupConfig;
