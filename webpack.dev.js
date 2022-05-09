const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  devtool: 'inline-source-map',
  mode: 'none',
  devServer: {
    static: {
        directory: path.join(__dirname, './src')
    },
    port: 8080,
    open: true,
    host: 'localhost',
    hot: true
  }
})