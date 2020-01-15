const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        procosys: './src/index.tsx',
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                loader: 'file-loader'
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
                exclude: /node_modules/
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
                            outputPath: 'fonts/'
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'],
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },
    output: {
        // `filename` provides a template for naming your bundles (remember to use `[name]`)
        filename: '[name].[hash].bundle.js',
        // `chunkFilename` provides a template for naming code-split bundles (optional)
        chunkFilename: '[name].[hash].chunk.js',
        path: path.resolve(__dirname, 'build/'),
        publicPath: '/'
    },
    devServer: {
        //contentBase: path.join(__dirname, 'build/'),
        port: 3000,
        hotOnly: true,
        /*HTML5 - Always route to index.html (React handles routing) */
        historyApiFallback: true
    },
    devtool: 'source-map',
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        /* Automatically creates our index.html page */
        new HtmlWebpackPlugin({
            title: 'ProCoSys',
            meta: {
                viewport: 'width=device-width, initial-scale=1'
            }
        }),
        /* Deletes our build directory when building */
        new CleanWebpackPlugin()
    ]
};
