const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  prodid: Number,
  Prodtname: { type: String, required: true, unique: true },
  Prodtdescription: { type: String, required: true },
  Prodtprice: { type: Number, required: true },
  Prodtcategory: { type: String, required: true },
  Productimg: { type: String, required: true },
});

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;