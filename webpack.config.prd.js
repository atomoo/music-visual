const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
    entry: './src/index.tsx',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'awesome-typescript-loader',
                    options: {
                        configFileName: 'tsconfig.prd.json',
                    },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css/,
                use: ['style-loader', 'css-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.mp3/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: '[name].[hash:7].[ext]',
                    },
                },
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    output: {
        filename: '[name].[hash:7].js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                parallel: true,
                sourceMap: false,
                uglifyOptions: {
                    compress: {
                        /* eslint-disable */
                        drop_console: true,
                        /* eslint-enable */
                    },
                },
            }),
        ],
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new webpack.HashedModuleIdsPlugin(),
        // new BundleAnalyzerPlugin(),
    ],
};
