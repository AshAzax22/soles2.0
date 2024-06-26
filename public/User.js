const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  wishlist: [Number],
  cart: [Number],
});

module.exports = mongoose.model("User", userSchema);
