module.exports = {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: [
        //Lets us use React.lazy(() => {})
        '@babel/plugin-syntax-dynamic-import',
        'react-hot-loader/babel'
    ],
    env: {
        test: {
            plugins: ['@babel/plugin-transform-runtime'],
        },
    },
};
