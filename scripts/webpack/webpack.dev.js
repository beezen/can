const path = require('path');
const webpack = require('webpack');
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const webpackMerge = require('webpack-merge');
const base = require('./webpack.base');

module.exports = webpackMerge(base, {
  module: {
    rules: [{
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.less$/,
        use: [
          'style-loader', {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]_[local]_[hash:base64:5]',
              minimize: true,
              sourceMap: false
            }
          },
          'postcss-loader',
          'less-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              "modifyVars": {
                "@hd": "2px"
              },
              javascriptEnabled: true
            }
          }
        ],
        include: /node_modules/,
        exclude: /src/
      }
    ]
  },
  plugins: [
    new HardSourceWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool: 'eval',
  devServer: {
    disableHostCheck: true,
    contentBase: [path.resolve(process.cwd(), 'dist'),path.resolve(process.cwd(), 'mocks')],
    compress: true,
    port: 8080,
    host: "0.0.0.0",
    hot: true,
    inline: true,
    noInfo: false,
    clientLogLevel: "none",
    open: true,
    stats: 'minimal',
  }
});