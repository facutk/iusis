const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var AppCachePlugin = require('appcache-webpack-plugin');
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
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(png|jpg|ico)$/,
                loader: 'file?name=[name].[hash].[ext]'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    plugins: [
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
