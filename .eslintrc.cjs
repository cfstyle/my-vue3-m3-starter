/* eslint-env node */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    // 强制类型安全，禁止使用 any
    '@typescript-eslint/no-explicit-any': 'error',
    // 强制严格相等
    eqeqeq: ['error', 'always'],
    // 强制单向数据流，禁止在组件中直接修改 props
    'vue/no-mutating-props': 'error',
    // 保证响应式纯净度，严禁在计算属性中使用异步或产生副作用
    'vue/no-async-in-computed-properties': 'error',
    // 允许现有单字组件命名
    'vue/multi-word-component-names': 'off',
    // 未使用变量规范
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ]
  }
}
