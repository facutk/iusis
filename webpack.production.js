const webpack = require('webpack');
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
var AppCachePlugin = require('appcache-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    entry: './src/client.jsx',
    output: {
        path: './dist',
        filename: 'bundle.[hash].js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            },
            {
                test: /\.(png|jpg|ico)$/,
                loader: 'file?name=[name].[hash].[ext]'
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                loader: 'file-loader'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        alias: {
            'semantic-ui': path.join(__dirname, "node_modules", "semantic-ui-css", "semantic.min.css"),
        }
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new ExtractTextPlugin("styles.[hash].css"),
        new HtmlWebpackPlugin({
            template: './src/index.template.ejs',
            favicon: './src/favicon.ico',
            filename: 'index.html',
            minify: {
                "minifyCSS": true
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({
            'process.env': {
            'NODE_ENV': JSON.stringify('production')
            }
        }),
        new AppCachePlugin({
            settings: ['prefer-online'],
            output: 'manifest.appcache'
        })
    ]
};
