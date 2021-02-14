/* eslint-disable */

const path = require('path');
const webpack = require('webpack')
const { getEntryAndPage, getHtml } = require('./fileUtil')

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//清理打包
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { entry, pages } = getEntryAndPage('src/pages')
module.exports = {
    entry: {
        ...entry,
        'app': path.resolve(__dirname, '../src/app.js')
    },
    output: {
        filename: 'js/[name]-[hash].js',
        path: path.resolve(__dirname, './../dist')
    },
    resolve: {
        extensions: [".js"],
        alias: {
            "@": path.resolve(__dirname, '../src'),
        },
        modules: [
            "node_modules",
            path.resolve(__dirname, 'src')
        ]
    },
    module: {
        // 配置loader
        rules: [
            {
                test: /\.(sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.(png|jpg|gif|jpeg)$/,
                loader: 'file-loader',
                options: {
                    name: '[hash].[ext]',
                    outputPath: './img',
                    esModule: false
                }
            },
            {
                test: /\.js?$/,
                use: 'babel-loader?cacheDirectory'
            },
        ]
    },
    // 配置插件
    plugins: [
        ...pages,
        getHtml('index.html', ['app'], 'src/index.html', '首页-简历自动生成', { pageNames: pages.map(page => page.userOptions.title) }),
        new CleanWebpackPlugin(),
        //css分离(输出文件名))
        new MiniCssExtractPlugin({
            // 类似 webpackOptions.output里面的配置 可以忽略
            filename: 'css/[name]-[hash].css',
            chunkFilename: 'css/[id]-[hash].css',
        }),
        new webpack.HotModuleReplacementPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public' },
                { from: 'node_modules/jsoneditor/dist/jsoneditor.min.css', to: 'css' },
                { from: 'node_modules/jsoneditor/dist/jsoneditor.min.js', to: 'js' },
            ]
        })
    ],
}