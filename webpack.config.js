const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const tsConfig = require('./tsconfig.json');

const isProduction = process.env.NODE_ENV === 'production';

const tsRules = {
    test: /\.tsx?$/,
    use: {
        loader: 'awesome-typescript-loader',
        options: { ...tsConfig },
    },
    exclude: /node_modules/,
};

const cssRules = {
    test: /\.css/,
    use: ['style-loader', 'css-loader'],
    exclude: /node_modules/,
};

const mp3Rules = {
    test: /\.mp3/,
    use: {
        loader: 'url-loader',
        options: {
            limit: 8192,
        },
    },
    exclude: /node_modules/,
};

const webpackConfig = {
    entry: './src/index.tsx',
    mode: 'development',
    module: {
        rules: [
            tsRules,
            cssRules,
            mp3Rules,
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
    ],
};

if (isProduction) {
    webpackConfig.mode = 'production';
    tsRules.use.options = {
        ...tsConfig,
        compilerOptions: {
            ...tsConfig.compilerOptions,
            sourceMap: false,
        },
    };
    mp3Rules.use.options.name = '[name].[hash:7].[ext]';
    webpackConfig.module.rules = [tsRules, cssRules, mp3Rules];
    webpackConfig.output.filename = '[name].[hash:7].js';
    webpackConfig.optimization = {
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
    };
    webpackConfig.plugins.push(new webpack.HashedModuleIdsPlugin());
}
else {
    webpackConfig.devtool = 'inline-source-map';
    webpackConfig.devServer = {
        contentBase: './dist',
        hot: true,
    };
    webpackConfig.plugins.push(new webpack.NamedChunksPlugin());
    webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = webpackConfig;
