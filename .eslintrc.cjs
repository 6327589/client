module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'standard',
    'plugin:vue/vue3-essential',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  rules: {
    'vue/multi-word-component-names': 'off', // 关闭名称校验
    'comma-dangle': ['error', 'always-multiline'],
    camelcase: 'off', // 允许下划线连接
  },
  globals: {
    WxLogin: 'readonly',
  },
}
