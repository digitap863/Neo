const { default: mongoose } = require("mongoose");
const blogs = require("../constants");
const brandModel = require("../models/brandModel");
const categoryModel = require("../models/categoryModel");
const productModel = require("../models/productModel");
module.exports = {
  getHome: async (req, res) => {
    try {
      const brands = await brandModel
        .aggregate([{ $sample: { size: 3 } }])
        .exec();
      const categories = await categoryModel.find({}).lean();
      const popularProducts = await productModel
        .aggregate([{ $sample: { size: 10 } }])
        .exec();
      const bestSellerProducts = await productModel
        .aggregate([{ $sample: { size: 6 } }])
        .exec();
      res.render("user/home", {
        brands,
        categories,
        popularProducts,
        bestSellerProducts,
        blogs,
      });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getAbout: (req, res) => {
    try {
      res.render("user/about");
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getShop: async (req, res) => {
    try {
      const categories = await categoryModel.find({}).lean();
      const popularProducts = await productModel
        .aggregate([{ $sample: { size: 4 } }])
        .exec();
      const products = await productModel.find({}).lean();
      res.render("user/shop", { products, popularProducts, categories });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getContact: (req, res) => {
    try {
      res.render("user/contact");
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getBlog: (req, res) => {
    try {
      res.render("user/blogs");
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getCategories: async (req, res) => {
    try {
      const categories = await categoryModel.find({}).lean();
      res.render("user/categories", { categories });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getProductDetails: async (req, res) => {
    try {
      const productId = req.params.id;
      console.log(productId);
      const product = await productModel.findById(productId).lean();
      console.log(product);
      res.render("user/product-details", { product });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getCategoryProducts: async (req, res) => {
    const categoryId = req.params.id;
    try {
      const category = await categoryModel.findById(categoryId);
      const categories = await categoryModel.find().lean();
      const popularProducts = await productModel
        .aggregate([{ $sample: { size: 4 } }])
        .exec();
      const products = await productModel
        .find({ category: category.category })
        .lean();
      console.log(products);
      res.render("user/shop", { products, popularProducts, categories });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getBrandProducts: async (req, res) => {
    const brandId = req.params.id;
    try {
      const brand = await brandModel.findById(brandId);
      const categories = await categoryModel.find().lean();
      const popularProducts = await productModel
        .aggregate([{ $sample: { size: 4 } }])
        .exec();
      const products = await productModel.find({ brand: brand.brand }).lean();
      res.render("user/shop", { products, popularProducts, categories });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getCart: async (req, res) => {
    try {
      const cart = await req.session.cart;
      const productIds = cart.map(
        (item) => new mongoose.Types.ObjectId(item.productId)
      );
      const products = await productModel.find({ _id: { $in: productIds } });
      const cartProducts = products.map((product) => {
        const cartItem = cart.find((item) => {
          return item.productId.toString() === product._id.toString();
        });
        return {
          ...product.toObject(), // Convert Mongoose document to plain JavaScript object
          quantity: cartItem ? parseInt(cartItem.quantity, 10) : 0, // Use the quantity from cart or default to 0
        };
      });
      res.render("user/cart", { cartProducts });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  addToCart: async (req, res) => {
    try {
      const { quantity, productId } = req.body;
      const existingProductIndex = req.session.cart.findIndex(
        (item) => item.productId === productId
      );
      if (existingProductIndex >= 0) {
        req.session.cart[existingProductIndex].quantity += quantity;
      } else {
        req.session.cart.push({ productId, quantity });
      }
      res.redirect("/cart");
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  removeFromCart:async(req,res)=>{
    try {
      const productId = req.params.id
      const cart = await req.session.cart || [];
      const productIndex = cart.findIndex(item => item.productId === productId);
      if (productIndex >= 0) {
        cart.splice(productIndex, 1);
        req.session.cart = cart;
        return res.json({ status: true });
      } else {
        return res.json({ status: false });
      }
    } catch (err) {
      res.render("error", { message: err });
    }
  }
};
