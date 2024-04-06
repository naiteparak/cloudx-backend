const path = require("path");

module.exports = {
  entry: {
    getProductById: "./handlers/getProductById.js",
    getProductsList: "./handlers/getProductsList.js",
    createProduct: './handlers/createProduct.js'
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].cjs",
    libraryTarget: "commonjs2",
  },
  target: "node",
};
