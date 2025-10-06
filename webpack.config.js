const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    'personal/favorites': './markup/pages/personal/favorites.ts',
    index: './markup/index.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/js'),
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
