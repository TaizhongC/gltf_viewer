
const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const dist = path.resolve(__dirname, 'dist');
const src = path.resolve(__dirname, 'src');

module.exports = {
  entry: path.resolve(src, 'index.js'),
  output: {
    filename: '[name].[hash].js',
    path: dist
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/
      },
      {
        test: /\.(gltf)$/,
        use: [
          {
            loader: "gltf-webpack-loader"
          }
        ]
      },
      {
        test: [/\.(bin)$/, /\.(jpg)$/, /\.(png)$/, /\.(hdr)$/],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]-[hash].[ext]'
            }
          }
        ]
      }
    ]
  },
  devServer: {
    static: dist,
    //contentBase: dist,
    //watchContentBase: true,
    //overlay: true,
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(src, 'index.html')
    }),
    new webpack.HotModuleReplacementPlugin(),
  ]
};
