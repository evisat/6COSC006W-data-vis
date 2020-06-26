const path = require('path');
const webpack = require('webpack');
const Handlebars = require('handlebars');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill', './src/app.js'],
    output: {
        filename: 'application.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        alias: {
            fullpage: `${__dirname}/node_modules/fullpage.js/dist/fullpage.min.js`
        }
    },
    module: {
        rules: [{
                test: /\.(scss)$/,
                exclude: /node_modules/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-env'],
                    compact: false
                }
            },
            {
                test: /\.hbs/,
                exclude: /node_modules/,
                loader: "handlebars-loader"
            }
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                handlebarsLoader: {}
            }
        }),
        new HtmlWebpackPlugin({
            title: '6COSC006W-data-vis',
            template: path.resolve(__dirname, 'src', 'app.hbs'),
            filename: 'index.html'
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    }
}
