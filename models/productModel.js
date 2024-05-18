const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    brand: String,
    category: String,
    description:String,
    images: [ String ],
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("products", productSchema);
module.exports = productModel;
