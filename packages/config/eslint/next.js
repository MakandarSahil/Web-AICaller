/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['./base.js', 'next/core-web-vitals', 'next/typescript'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/display-name': 'off',
  },
}