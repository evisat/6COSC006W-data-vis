const path = require('path');
const webpack = require('webpack');
const Handlebars = require('handlebars');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/app.js',
    output: {
        filename: 'application.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-env']
                }
            },
            {
                test: /\.hbs/,
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
            template: 'src/index.hbs'
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    }
}
