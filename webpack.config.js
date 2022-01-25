/* eslint-disable */

const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const { GenerateSW } = require('workbox-webpack-plugin');

const config = {
  entry: path.resolve(__dirname, '/src/index.tsx'),
  output: {
    path: path.resolve(__dirname, '/build'),
    filename: 'bundle.js'
  },
  resolve: {
    modules: [path.resolve(__dirname, '/src'), 'node_modules'],
    alias: {
      Components: path.resolve(__dirname, '/src/components/'),
      Hooks: path.resolve(__dirname, '/src/hooks/'),
      Stores: path.resolve(__dirname, '/src/stores/'),
      Utils: path.resolve(__dirname, '/src/utils/'),
      Loaders: path.resolve(__dirname, '/src/loaders/')
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.svg']
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
          
        },
      }
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'public'
        }
      ]
    }),
  ],
  performance: {
    hints: false,
  },
  devtool: 'eval-source-map'
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new GenerateSW({
      maximumFileSizeToCacheInBytes: 4 * 1024 * 1024
    })
  )
}

module.exports = config