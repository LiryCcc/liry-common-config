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
      // CommonJS 输出
      // file: 'index.cjs', // <-- 删除 file
      dir: outDir, // <-- 保留 dir
      format: 'cjs',
      entryFileNames: 'index.cjs', // <-- 使用 entryFileNames 指定入口文件输出名
      sourcemap: true
    },
    {
      // ES Module 输出
      // file: 'index.js', // <-- 删除 file
      dir: outDir, // <-- 保留 dir
      format: 'es',
      entryFileNames: 'index.js', // <-- 使用 entryFileNames 指定入口文件输出名 (更规范的命名)
      sourcemap: true
    },
    {
      // UMD 输出 (通常用于浏览器)
      // file: 'index.umd.js', // <-- 删除 file
      dir: outDir, // <-- 保留 dir
      format: 'umd', // <-- 格式改为 umd
      name: 'LiryCommonConfig', // <-- 必须指定一个全局变量名
      entryFileNames: 'index.umd.js', // <-- 使用 entryFileNames 指定入口文件输出名
      sourcemap: true
      // 如果是 UMD，可能需要配置 globals 来处理外部依赖，例如:
      // globals: {
      //   lodash: '_'
      // }
    }
  ],
  plugins: [
    // 清理插件通常放在最前面
    clear({
      targets: [outDir] // 建议使用 targets 并且是数组形式
    }),
    typescript({
      tsconfig: './tsconfig.json',
      // 告诉 Rollup 插件不要生成 .d.ts，让 tsc 独立完成
      declaration: false,
      declarationDir: null
    }),
    commonjs(),
    resolve()
    // 如果只在 UMD 输出中压缩，可以考虑将 terser 放在 UMD 输出的 plugins 数组中
    // 否则放在顶层 plugins 中会压缩所有输出
    // terser({
    //   include: [/index\.umd\.js$/] // 示例：只压缩 UMD 文件
    // })
  ]
});

export default rollupConfig;
