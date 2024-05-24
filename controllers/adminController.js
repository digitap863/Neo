const { deleteImage } = require("../middlewares/multer");
const brandModel = require("../models/brandModel");
const categoryModel = require("../models/categoryModel");
const moment = require("moment-timezone");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const bannerModel = require("../models/bannerModel");
const blogModel = require("../models/blogModel");
const branchModel = require("../models/branchesModel");

module.exports = {
  getHome: (req, res) => {
    try {
      res.render("admin/home", { admin: true });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getBrands: async (req, res) => {
    try {
      const brands = await brandModel.find({}).lean();
      res.render("admin/brands", { admin: true, brands: brands });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getCategories: async (req, res) => {
    try {
      const categories = await categoryModel.find({}).lean();
      res.render("admin/categories", { admin: true, categories: categories });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getProducts: async (req, res) => {
    try {
      const products = await productModel.find({}).lean();
      res.render("admin/products", { admin: true, products });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getAddProducts: async (req, res) => {
    try {
      const categories = await categoryModel.find({}).lean();
      const brands = await brandModel.find({}).lean();
      res.render("admin/add-product", { admin: true, categories, brands });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  addBrand: async (req, res) => {
    try {
      const { brand } = req.body;
      const image = req.files[0].filename;
      const newBrand = new brandModel({ brand, image });
      await newBrand.save();
      res.redirect("/admin/brands");
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  addCategory: async (req, res) => {
    try {
      const { category } = req.body;
      const image = req.files[0].filename;
      const newCategory = new categoryModel({ category, image });
      await newCategory.save();
      res.redirect("/admin/categories");
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  addProduct: async (req, res) => {
    try {
      const images = req.files.map((elem) => elem.filename);
      const newProduct = new productModel({ ...req.body, images });
      await newProduct.save();
      res.redirect("/admin/products");
      console.log(req.files[0].filename);
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  deleteCategory: async (req, res) => {
    const categoryId = req.params.id;
    try {
      categoryModel.findByIdAndDelete(categoryId).then((response) => {
        if (response.image) {
          deleteImage(response.image);
        }
        res.json({});
      });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  deleteBrand: async (req, res) => {
    const brandId = req.params.id;
    try {
      brandModel.findByIdAndDelete(brandId).then((response) => {
        if (response.image) {
          deleteImage(response.image);
        }
        res.json({});
      });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  deleteProduct: async (req, res) => {
    const productId = req.params.id;
    try {
      productModel.findByIdAndDelete(productId).then((response) => {
        if (response.images.length > 0) {
          response.images.forEach((image) => {
            deleteImage(image);
          });
        }
        res.json({});
      });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  geteditProduct: async (req, res) => {
    const productId = req.params.id;
    try {
      const product = await productModel.findById(productId).lean();
      const categories = await categoryModel.find({}).lean();
      const brands = await brandModel.find({}).lean();
      res.render("admin/edit-product", {
        admin: true,
        product,
        categories,
        brands,
      });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  editProduct: async (req, res) => {
    const productId = req.params.id;
    const { name, category, brand, description, price } = req.body;
    try {
      const product = await productModel.findById(productId);
      if (req.files.length > 0) {
        product.images = req.files.map((elem) => elem.filename);
      }
      product.name = name;
      product.category = category;
      product.brand = brand;
      product.description = description;
      product.price = price;
      await product.save();
      res.redirect("/admin/products");
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getOrders: async (req, res) => {
    try {
      const orders = await orderModel
        .find({ done: { $ne: true } })
        .sort({ createdAt: -1 })
        .lean();
      const updatedOrders = orders.map((order) => {
        const indianTime = moment(order.createdAt).tz("Asia/Kolkata");
        return {
          ...order,
          date: indianTime.format("DD-MM-YYYY"),
          time: indianTime.format("hh:mm:ss A"),
        };
      });
      res.render("admin/orders", { admin: true, updatedOrders });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  updateOrder: async (req, res) => {
    try {
      const orderId = req.params.id;
      const order = await orderModel.findById(orderId);
      order.done = true;
      await order.save();
      res.json({});
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getDoneOrders: async (req, res) => {
    try {
      const order = await orderModel
        .find({ done: true })
        .sort({ createdAt: -1 })
        .lean();
      const orders = order.map((order) => {
        const indianTime = moment(order.createdAt).tz("Asia/Kolkata");
        return {
          ...order,
          date: indianTime.format("DD-MM-YYYY"),
          time: indianTime.format("hh:mm:ss A"),
        };
      });
      console.log(orders);
      res.render("admin/done-order", { admin: true, orders });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getOfferBanner: async (req, res) => {
    try {
      res.render("admin/OfferBanner", { admin: true });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  addOfferBanner: async (req, res) => {
    try {
      const { bannerName } = req.body;
      const images = req.files.map((elem) => elem.filename);
      const data = {
        bannerName,
        images,
      };
      const newBanner = new bannerModel(data);
      await newBanner.save();
      res.redirect("/admin/offer-banner");
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getAddBlog: async (req, res) => {
    try {
      const blogs = await blogModel.find({}).lean();
      res.render("admin/blogs", { admin: true, blogs });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  addBlog: async(req, res) => {
    try{
      const {title,content} = req.body
      const images = req.files.map((elem) => elem.filename);
      console.log(images)
      const blogData = {
        title,
        content,
        images
      }
      const newBlog = new blogModel(blogData)
      await newBlog.save()
      res.redirect("/admin/add-blog")
    }catch(err){
      res.render("error", { message: err });
    }
  },
  getAddBranch:async(req,res)=>{
    try{
      const branches = await branchModel.find({}).lean()
      console.log(branches)
      res.render("admin/branches", { admin: true,branches });
    }catch(err){
      res.render("error", { message: err });
    }
  },
  addBranch:async(req,res)=>{
    try{
      const data = req.body
      console.log(data)
      const newBranch = new branchModel(data)
      await newBranch.save()
      res.redirect("/admin/add-branch")
    }catch(err){
      res.render("error", { message: err });
    }
  },
  deleteBranch: async (req, res) => {
    const branchId = req.params.id;
    try {
      branchModel.findByIdAndDelete(branchId).then((response) => {
        res.json({});
      });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  deleteBlog: async (req, res) => {
    const blogId= req.params.id;
    try {
      blogModel.findByIdAndDelete(blogId).then((response) => {
        if (response.image) {  
          deleteImage(response.image);
        }
        res.json({});
      });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
};
