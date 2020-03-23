module.exports = {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: [
        //Lets us use React.lazy(() => {})
        '@babel/plugin-syntax-dynamic-import',
        "@babel/plugin-proposal-class-properties"
    ],
    env: {
        test: {
            plugins: ['@babel/plugin-transform-runtime'],
            
        },
    },
};

