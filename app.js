const express = require("express");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/soles");
const Product = require("./public/Product");
const User = require("./public/User");
const app = express();
const path = require("path");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("./public"));

app.get("/findid/:categorytofind", async function (req, res) {
  let { categorytofind } = req.params;
  res
    .status(200)
    .json(await Product.find({ category: categorytofind }).select("id"));
});

app.get("/find/product/:id", async function (req, res) {
  let ID = req.params.id;
  ID = Number(ID);
  res.status(200).json(await Product.find({ id: ID }));
});

app.post("/login", async function (req, res) {
  let { username, password } = req.body;
  let user = await User.findOne({ username: username });
  if (user) {
    if (user.password === password) {
      res.status(200).json({
        success: true,
        message: "Login Successful",
        id: user._id,
        cart: user.cart,
        wishlist: user.wishlist,
      });
    } else {
      res.status(200).json({ success: false, message: "Incorrect Password" });
    }
  } else {
    user = new User({ username: username, password: password });
    await user.save();
    res.status(200).json({
      success: true,
      message: "Account Created",
      id: user._id,
      cart: user.cart,
      wishlist: user.wishlist,
    });
  }
});

app.post("/updateCart", async function (req, res) {
  try {
    let id = req.body.user;
    let cart = req.body.cart_items_array;
    let user = await User.findById(id);
    if (user) {
      user.cart = cart;
      await user.save();
      res.status(200).json({ success: true, message: "Cart Updated" });
    }
  } catch (e) {
    console.log(e);
    res.status(200).json({ success: false, message: "Error" });
  }
});

app.post("/updateWishlist", async function (req, res) {
  try {
    let id = req.body.user;
    let wishlist = req.body.wishlist_items_array;
    let user = await User.findById(id);
    if (user) {
      user.wishlist = wishlist;
      await user.save();
      res.status(200).json({ success: true, message: "Wishlist Updated" });
    }
  } catch (e) {
    console.log(e);
    res.status(200).json({ success: false, message: "Error" });
  }
});

app.all("*", (req, res) => {
  res.status(404).sendFile(path.resolve(__dirname, "public", "404.html"));
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
