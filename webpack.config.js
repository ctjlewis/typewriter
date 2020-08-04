const { resolve } = require('path');
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  entry: {
    react: './src/react.js'
  },
  output: {
    filename: '[name].js',
    path: resolve('dist'),
    library: 'Typewriter',
    libraryTarget: 'umd',
    libraryExport: 'default',
    globalObject: 'typeof self !== \'undefined\' ? self : this',
    umdNamedDefine: true,
  },
  target: 'async-node'
}