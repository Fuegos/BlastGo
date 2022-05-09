const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default

module.exports = {

  context: path.join(__dirname, 'src'),
  entry: ['./index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  target: 'web',

  plugins: [

    new CopyPlugin({
      patterns: [
          { from: "assets/", to: "assets/" },
      ]
    }),

    new ImageminPlugin({
      test: /\.png$/i 
    }),
    
    new HtmlPlugin({
      file:path.join(__dirname,'dist','index.html'),
      template:'./index.html'
    })
  ]
}