const path = require('path');


// Export a function. Accept the base config as the only param.
module.exports = {
  core: {
    builder: "webpack5",
  },
  'stories': [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  'addons': [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-addon-jsx',
  ],

  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.(scss)$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });

    config.resolve.fallback = { "crypto": false, "path": false };
    config.resolve.alias = {
      '@procosys/core': path.resolve(__dirname, '../src/core/'),
      'react-dom': '@hot-loader/react-dom',
      '@procosys/modules': path.resolve(__dirname, '../src/modules/'),
      '@procosys/hooks': path.resolve(__dirname, '../src/hooks/'),
      '@procosys/components': path.resolve(__dirname, '../src/components/'),
      '@procosys/assets': path.resolve(__dirname, '../src/assets/'),
      '@procosys/http': path.resolve(__dirname, '../src/http/'),
      '@procosys/util': path.resolve(__dirname, '../src/util/')
    };
    
    // Return the altered config
    return config;
  },
};
