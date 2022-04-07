const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = (env) => {
  const bundleOutputDir = './dist'
  const isDevBuild = !(env && env.prod)
  const plugins = isDevBuild
    ? [new webpack.SourceMapDevToolPlugin()]
    : []
  plugins.push(
    new CopyWebpackPlugin([{ from: 'demo/' }]),
    new webpack.EnvironmentPlugin({
      APP_URL: 'https://chat.dev-otechie.com'
    })
  )
  return [{
    mode: isDevBuild ? 'development' : 'production',
    entry: './src/index.js',
    output: {
      filename: 'index.js',
      path: path.resolve(bundleOutputDir)
    },
    devServer: {
      contentBase: bundleOutputDir
    },
    plugins: plugins,
    optimization: {
      minimizer: [new UglifyJsPlugin()]
    },
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
