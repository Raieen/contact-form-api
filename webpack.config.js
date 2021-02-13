const path = require('path')

module.exports = {
  entry: './src/controller/worker_handler.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
}
