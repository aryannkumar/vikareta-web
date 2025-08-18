import eslintConfigNext from 'eslint-config-next';

const eslintConfig = [
  {
    ignores: ['node_modules'],
  },
  // Use Next.js recommended config
  ...eslintConfigNext.flatConfig,
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];

export default eslintConfig;
