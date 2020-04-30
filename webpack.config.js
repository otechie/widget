const path = require('path')
const webpack = require('webpack')
const copyWebpackPlugin = require('copy-webpack-plugin')
const bundleOutputDir = './dist'

module.exports = (env) => {
  const isDevBuild = !(env && env.prod)
  const plugins = isDevBuild
    ? [new webpack.SourceMapDevToolPlugin()]
    : [new webpack.optimize.UglifyJsPlugin()]
  plugins.push(
    new copyWebpackPlugin([{ from: 'demo/' }]),
    new webpack.EnvironmentPlugin({ WEB_URL: 'http://localhost:8080' })
  )
  return [{
    entry: './src/widget.js',
    output: {
      filename: 'widget.js',
      path: path.resolve(bundleOutputDir),
    },
    devServer: {
      contentBase: bundleOutputDir
    },
    plugins: plugins,
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
