const path = require('path');
const webpack = require('webpack');
const Handlebars = require('handlebars');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const MinifyPlugin = require('uglifyjs-webpack-plugin');

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
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-env'],
                    compact: false
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
            template: 'src/app.hbs',
            jsExtension: ".gz"
        }),
        new webpack.DefinePlugin({ //<--key to reduce React's size
            'process.env': {
                'NODE_ENV': JSON.stringify('development')
            }
        }),
        new CompressionPlugin(),
        new MinifyPlugin()
    ],
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    }
}
