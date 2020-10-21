const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: ['react-hot-loader/patch', './src/index.tsx'],
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                loader: 'file-loader',
            },
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader'
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
                exclude: [
                    // these packages have problems with their sourcemaps
                    path.resolve(__dirname, 'node_modules/react-double-scrollbar'),
                ],
            },
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'v2-assets/fonts/'
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
        alias: {
            'react-dom': '@hot-loader/react-dom',
            '@procosys/core': path.resolve(__dirname, 'src/core/'),
            '@procosys/modules': path.resolve(__dirname, 'src/modules/'),
            '@procosys/hooks': path.resolve(__dirname, 'src/hooks/'),
            '@procosys/components': path.resolve(__dirname, 'src/components/'),
            '@procosys/assets': path.resolve(__dirname, 'src/assets/'),
            '@procosys/http': path.resolve(__dirname, 'src/http/'),
            '@procosys/util': path.resolve(__dirname, 'src/util/'),
        }
    },
    output: {
        // `filename` provides a template for naming your bundles (remember to use `[name]`)
        filename: 'v2-assets/[name].[hash].bundle.js',
        // `chunkFilename` provides a template for naming code-split bundles (optional)
        chunkFilename: 'v2-assets/[name].[hash].chunk.js',
        path: path.resolve(__dirname, 'build'),
        publicPath: '/'
    },
    devServer: {
        //contentBase: path.join(__dirname, 'build/'),
        port: 3000,
        /*HTML5 - Always route to index.html (React handles routing) */
        historyApiFallback: true
    },
    devtool: 'source-map',
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        minimize: false
    },
    plugins: [
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(true)
        }),
        /* Automatically creates our index.html page */
        new HtmlWebpackPlugin({
            title: 'ProCoSys',
            favicon: 'src/assets/icons/ProCoSys_favicon16x16.png',
            meta: {
                viewport: 'width=device-width, initial-scale=1'
            }
        }),
        /* Deletes our build directory when building */
        new CleanWebpackPlugin()
    ]
};
