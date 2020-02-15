module.exports = {
  module: {
    rules: [
      {
        test: /\.csv$/,
        use: 'raw-loader'
      }
    ]
  }
}
