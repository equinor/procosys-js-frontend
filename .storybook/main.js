const path = require('path');


module.exports = {
  'stories': [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  'addons': [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-addon-material-ui'
  ],
  'webpack': async (config) => {
    config.resolve.alias = {
      '@procosys/core': path.resolve(__dirname, '../src/core/'),
      'react-dom': '@hot-loader/react-dom',
      '@procosys/modules': path.resolve(__dirname, '../src/modules/'),
      '@procosys/hooks': path.resolve(__dirname, '../src/hooks/'),
      '@procosys/components': path.resolve(__dirname, '../src/components/'),
      '@procosys/assets': path.resolve(__dirname, '../src/assets/'),
      '@procosys/http': path.resolve(__dirname, '../src/http/'),
      '@procosys/util': path.resolve(__dirname, '../src/util/'),
    },
      config.resolve.modules = [
        path.resolve(__dirname, '..', 'src'),
        path.resolve(__dirname, '..', 'node_modules'),
      ];

    config.module.rules.push(
      {
        test: /\.(ttf|eot|svg)(\?[a-z0-9#=&.]+)?$/,
        loaders: ["file-loader"]
      });

    return config;
  }
}