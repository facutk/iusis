const HtmlWebpackPlugin = require('html-webpack-plugin');
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
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
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
