const mongoose = require("mongoose");

const prod = new mongoose.Schema({
  name: String,
  src: String,
  src2: String,
  src3: String,
  src4: String,
  id: Number,
  price: Number,
  review: Number,
  category: String,
});

const Product = mongoose.model("Product", prod); // model for products

module.exports = Product;
