const path = require('path');

module.exports = {
	mode: 'development',
	devtool: 'inline-source-map',
	entry: './ts/main.ts',
	devServer: {
    port: 8000,
    static: {
      serveIndex: true,
      directory: __dirname
    }
  },
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/dist'
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
	module: {
		rules: [
			{ test: /\.tsx?$/, loader: 'ts-loader' },
		]
	},
	watchOptions: {
    ignored: /node_modules/
  }
}


// const path = require('path')

// module.exports = {
//   mode: 'development',
//   entry: './src/main.ts',
//   // devServer: {
//   //   port: 9000,
//   //   static: {
//   //     serveIndex: true,
//   //     directory: __dirname
//   //   }
//   // },
//   output: {
//     filename: 'bundle.js',
//     path: path.resolve(__dirname, 'dist'),
//     publicPath: '/dist/'
//   },
//   resolve: {
//     extensions: ['.ts', '.js']
//   },
//   module: {
//     rules: [
//       {
//         test: /\.ts$/,
//         use: 'ts-loader',
//         exclude: /node_modules/
//       },
//     ]
//   },
//   watchOptions: {
//     ignored: /node_modules/
//   }
// }
