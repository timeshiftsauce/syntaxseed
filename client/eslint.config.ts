import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  // 前端文件配置
  {
    files: ['src/**/*.{js,ts,vue}'],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // 禁用一些对 Vue 项目不友好的规则
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off', // 完全禁用 any 类型检查
      'no-undef': 'off', // Vue 的 auto-import 会导致这个规则误报
      'vue/no-unused-vars': 'warn',
      'vue/multi-word-component-names': 'off', // 允许单词组件名
    },
  },

  // 后端和工具文件配置
  // {
  //   files: ['serves/**/*.js', 'axios/**/*.js', 'axios/**/*.ts'],
  //   languageOptions: {
  //     globals: globals.node,
  //   },
  //   rules: {
  //     '@typescript-eslint/no-require-imports': 'off', // 允许 require 导入
  //     '@typescript-eslint/no-unused-vars': 'warn', // 警告而不是错误
  //     '@typescript-eslint/no-unused-expressions': 'off',
  //     'no-redeclare': 'off',
  //     'require-yield': 'off',
  //   },
  // },

  // 生成的类型文件
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off', // 允许类型文件中的 ts 注释
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  // Vue 文件特殊配置
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
    rules: {
      'vue/valid-template-root': 'off', // 允许空模板
    },
  },

  // 忽略文件
  {
    ignores: [
      '**/dist/**',
      '**/dist-ssr/**',
      '**/coverage/**',
      '**/node_modules/**',
      '**/*.vue.js', // Vue 编译生成的文件
      '**/.nuxt/**',
      '**/.output/**',
      'components.d.ts', // 自动生成的组件类型文件
      'serves/**'
    ],
  },
]
