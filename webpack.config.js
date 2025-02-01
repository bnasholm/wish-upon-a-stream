const path = require("path");

module.exports = {
  entry: "./src/index.ts", // Main TypeScript file
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    static: path.join(__dirname, 'src'),  // Serve files from the 'src' folder
    port: 9000,  // Port to serve your app
    open: true,   // Open the browser automatically
    hot: true,    // Enable hot module replacement
  },
  mode: "development", // Change to "production" for optimized builds
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"], // Allow imports without specifying extensions
  },
};
