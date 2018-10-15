const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HappyPack = require('happypack');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');

let defaults = require('./defaults');
// HappyPack生成器
const cHappyPack = (id, loaders) => new HappyPack({
  id: id,
  debug: false,
  verbose: false,
  threads: 4,
  loaders: loaders
});

// loaders
const prdLoaders = () => {
  if (process.env.DEFINED_ENV == 'dev') {
    return [];
  }
  return [{
      test: /\.css$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
      }, 'css-loader', 'postcss-loader']
    },
    {
      test: /\.less$/,
      use: [{
          loader: MiniCssExtractPlugin.loader,
        },
        {
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
      use: [{
          loader: MiniCssExtractPlugin.loader,
        },
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
};
/**
 * 公共模块导出
 */
module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    'index': [path.resolve(process.cwd(), 'src/index.jsx')],
  },
  output: {
    pathinfo: process.env.DEFINED_ENV == "prd" ? false : true,
    path: path.resolve(process.cwd(), 'dist'),
    filename: "[name].js"
  },
  module: {
    rules: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        include: [defaults.srcPath],
        use: ['happypack/loader?id=Js&cacheDirectory']
      },
      {
        enforce: "pre",
        test: /\.jsx?$/,
        exclude: /node_modules/,
        include: [defaults.srcPath],
        use: ['happypack/loader?id=ESLint&catch']
      },
      {
        test: /\.(ico|mp4|ogg|png|jpe?g|gif|svg)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          query: {
            limit: 10240
          }
        }],
        exclude: /node_modules/
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'file-loader',
          query: {
            limit: 10240
          }
        }
      },
      ...prdLoaders()
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new SimpleProgressWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      '__wd_define_env__': JSON.stringify(process.env.DEFINED_ENV),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(process.cwd(), 'src/index.html'),
      filename: 'index.html', // 输出至指定目录
      chunks: ['index', 'vendors'],
      chunksSortMode: 'dependency',
      hash: true,
      inject: true,
      alwaysWriteToDisk: true // 将内存文件写入磁盘
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    cHappyPack('ESLint', ['eslint-loader']),
    cHappyPack('Js', ['babel-loader']),
  ],
  cache: true,
  resolve: {
    extensions: ['.web.js', '.js', '.jsx', '.less'],
    alias: {
      '~': path.resolve(defaults.srcPath),
      'commons': path.resolve(defaults.srcPath, 'commons'),
      'components': path.resolve(defaults.srcPath, 'components'),
      'api': path.resolve(defaults.srcPath, 'components/api'),
      'entries': path.resolve(defaults.srcPath, 'entries'),
      'utils': path.resolve(defaults.srcPath, 'utils'),
      'assets': path.resolve(defaults.srcPath, 'assets'),
      'images': path.resolve(defaults.srcPath, 'assets/images'),
      'styles': path.resolve(defaults.srcPath, 'assets/styles'),
    }
  },
  optimization: {
    splitChunks: {
      name: "vendors",
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  stats: {
    assets: true,
    children: false,
    chunks: false,
    chunkModules: false,
    chunkOrigins: false,
    colors: true,
    hash: false,
    modules: false
  },
}