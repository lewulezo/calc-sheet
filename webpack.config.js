module.exports = {  
  entry: ['./client/ts/calc-sheet.ts'],
  output: {
    filename: './client/calc-sheet.js'
  },
  resolve: {
    extensions: ['', '.d.ts',' .webpack.js', '.web.js', '.ts', '.js']
  },
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  }
}