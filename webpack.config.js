/* eslint-disable */

// detect if in production
const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';

const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const { GenerateSW } = require('workbox-webpack-plugin');

const config = {
  entry: path.join(__dirname, '/src/index.tsx'),
  output: {
    path: path.join(__dirname, '/build'),
    filename: 'bundle.js'
  },
  resolve: {
    modules: [path.join(__dirname, '/src'), 'node_modules'],
    alias: {
      components: path.join(__dirname, '/src/components/'),
      hooks: path.join(__dirname, '/src/hooks/'),
      stores: path.join(__dirname, '/src/stores/'),
      utils: path.join(__dirname, '/src/utils/'),
      loaders: path.join(__dirname, '/src/loaders/')
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

if (isProduction) {
  config.plugins.push(
    new GenerateSW({
      maximumFileSizeToCacheInBytes: 4 * 1024 * 1024
    })
  )
}

module.exports = config