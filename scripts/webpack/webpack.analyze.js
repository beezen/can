const webpackMerge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const dev = require("./dev");

module.exports = webpackMerge(dev, {
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerPort: 8082
        })
    ]
});