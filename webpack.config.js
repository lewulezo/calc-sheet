module.exports = [{  
  entry: ['./client/ts/ui/main.tsx'],
  output: {
    filename: './client/main.js'
  },
  resolve: {
    extensions: ['', '.d.ts',' .webpack.js', '.web.js', '.ts', '.js', '.tsx']
  },
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
},{  
  entry: ['./client/ts/calc-sheet.ts'],
  output: {
    filename: './client/calc-sheet.js'
  },
  resolve: {
    extensions: ['', '.d.ts',' .webpack.js', '.web.js', '.ts', '.js', '.tsx']
  },
  devtool: 'source-map',
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ]
  }
},
]