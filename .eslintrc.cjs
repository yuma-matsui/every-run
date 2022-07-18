module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  env: {
    es2021: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname
  },
  ignorePatterns: ['./dist'],
  extends: [
    'standard',
    'standard-typescript',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ]
}
