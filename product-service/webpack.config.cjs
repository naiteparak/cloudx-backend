const path = require("path");

module.exports = {
  entry: {
    getProductById: "./handlers/getProductById.js",
    getProductsList: "./handlers/getProductsList.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].cjs",
    libraryTarget: "commonjs2",
  },
  target: "node",
};
