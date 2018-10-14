const webpackMerge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const base = require('./webpack.base');

module.exports = webpackMerge(base, {
  devtool: "none",
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        uglifyOptions: {
          output: {
            comments: false
          },
          compress: {
            dead_code: true
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
});