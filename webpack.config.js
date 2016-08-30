const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");
module.exports = {
    entry: './src/client.jsx',
    output: {
        path: './dist',
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(png|jpg|ico)$/,
                loader: 'file?name=[name].[hash].[ext]'
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        alias: {
            'semantic-ui': path.join(__dirname, "node_modules", "semantic-ui-css", "semantic.min.css"),
        }
    },
    devServer: {
        host: 'localhost',
        port: 8080,
        contentBase: __dirname + '/dist/',
        proxy: {
            '/api/*' : 'http://localhost:3000',
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.template.ejs',
            favicon: './src/favicon.ico',
            filename: 'index.html',
        })
    ]
};
