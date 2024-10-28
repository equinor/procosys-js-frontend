module.exports = {
    presets: [
        '@babel/preset-env',
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
    ],
    plugins: [
        //Lets us use React.lazy(() => {})
        '@babel/plugin-syntax-dynamic-import',
        'react-hot-loader/babel',
        ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        ['@babel/plugin-proposal-private-methods', { loose: true }],
    ],
    env: {
        test: {
            plugins: ['@babel/plugin-transform-runtime'],
        },
    },
};
