const path = require('path')
const webpack = require('webpack')
var copyWebpackPlugin = require('copy-webpack-plugin')
const bundleOutputDir = './dist'

module.exports = (env) => {
  const isDevBuild = !(env && env.prod)

  return [{
    entry: './src/widget.js',
    output: {
      filename: 'widget.js',
      path: path.resolve(bundleOutputDir),
    },
    devServer: {
      contentBase: bundleOutputDir
    },
    plugins: isDevBuild ? [
      new webpack.SourceMapDevToolPlugin(),
      new copyWebpackPlugin([{ from: 'demo/' }]),
      new webpack.EnvironmentPlugin({ WEB_URL: 'http://localhost:8080' })
    ] : [
      new webpack.optimize.UglifyJsPlugin(),
      new copyWebpackPlugin([{ from: 'demo/' }]),
      new webpack.EnvironmentPlugin({ WEB_URL: 'http://localhost:8080' })
    ],
    module: {
      rules: [
        { test: /\.html$/i, use: 'html-loader' },
        { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
        {
          test: /\.js$/i, exclude: /node_modules/, use: {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/env', {
                'targets': {
                  'browsers': ['ie 6', 'safari 7']
                }
              }]]
            }
          }
        }
      ]
    }
  }]
}
