const brandModel = require("../models/brandModel");
const categoryModel = require("../models/categoryModel");
const productModel = require("../models/productModel");
module.exports = {
  getHome: async(req, res) => {
    try {
      const brands = await brandModel.aggregate([{ $sample: { size: 3 } }]).exec();
      const categories = await categoryModel.find({}).lean()
      const popularProducts = await productModel.aggregate([{ $sample: { size: 10 } }]).exec();
      const bestSellerProducts = await productModel.aggregate([{ $sample: { size: 6 } }]).exec();
      res.render("user/home",{brands,categories,popularProducts,bestSellerProducts});
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
      const categories = await categoryModel.find({}).lean()
             const popularProducts = await productModel
        .aggregate([{ $sample: { size: 4 } }])
        .exec();
      const products = await productModel.find({}).lean();
      res.render("user/shop", { products,popularProducts,categories});
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
  getCategories: async(req, res) => {
    try {
      const categories = await categoryModel.find({}).lean()
      res.render("user/categories",{categories});
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getCategoryProducts:async(req,res)=>{
    const categoryId = req.params.id
        try {
          const category = await categoryModel.findById(categoryId)
      const categories = await categoryModel.find().lean()
      const popularProducts = await productModel.aggregate([{ $sample: { size: 4 } }]).exec();
      const products = await productModel.find({category:category.category}).lean();
      console.log(products)
      res.render("user/shop", { products,popularProducts,categories});
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getBrandProducts:async(req,res)=>{
    const brandId = req.params.id
        try {
          const brand = await brandModel.findById(brandId)
      const categories = await categoryModel.find().lean()
      const popularProducts = await productModel.aggregate([{ $sample: { size: 4 } }]).exec();
      const products = await productModel.find({brand:brand.brand}).lean();
      res.render("user/shop", { products,popularProducts,categories});
    } catch (err) {
      res.render("error", { message: err });
    }
  }
};
