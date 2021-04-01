module.exports = {
  presets: [['@babel/preset-env'], '@babel/preset-react', '@babel/typescript'],
  plugins: [
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
  ],
};
