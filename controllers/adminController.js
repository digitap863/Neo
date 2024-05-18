const { deleteImage } = require("../middlewares/multer");
const brandModel = require("../models/brandModel");
const categoryModel = require("../models/categoryModel");
const productModel = require("../models/productModel");

module.exports = {
  getHome: (req, res) => {
    try {
      res.render("admin/home", { admin: true });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getBrands: async(req, res) => {
    try {
      const brands = await brandModel.find({}).lean()
      res.render("admin/brands", { admin: true,brands:brands });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getCategories: async(req, res) => {
    try {
      const categories = await categoryModel.find({}).lean()
      res.render("admin/categories", { admin: true,categories:categories });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getProducts:async(req,res)=>{
    try {
        const products = await productModel.find({}).lean()
        res.render("admin/products", { admin: true,products });
      } catch (err) {
        res.render("error", { message: err });
      }
  },
    getAddProducts:async(req,res)=>{
    try {
        const categories = await categoryModel.find({}).lean()
        const brands = await brandModel.find({}).lean()
        res.render("admin/add-product", { admin: true,categories,brands });
      } catch (err) {
        res.render("error", { message: err });
      }
  },
  addBrand: async(req, res) => {
    try {
      const { brand } = req.body;
      const image = req.files[0].filename
      const newBrand = new brandModel({brand,image})
      await newBrand.save();
      res.redirect('/admin/brands')
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  addCategory: async(req, res) => {
    try {
      const { category } = req.body;
      const image = req.files[0].filename
      const newCategory = new categoryModel({category,image})
      await newCategory.save();
      res.redirect('/admin/categories')
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  addProduct:async(req,res)=>{
    try{
        const images = req.files.map(elem => elem.filename);
        const newProduct = new productModel({...req.body,images})  
        await newProduct.save()
        res.redirect('/admin/products')
        console.log(req.files[0].filename)
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  deleteCategory:async(req,res)=>{
    const categoryId = req.params.id
    try{
      categoryModel.findByIdAndDelete(categoryId).then((response)=>{
        if(response.image){
          deleteImage(response.image)
        }
        res.json({})
      })
    }catch(err){
      res.render("error", { message: err });
    }
  },
  deleteBrand:async(req,res)=>{
    const brandId = req.params.id
    try{
      brandModel.findByIdAndDelete(brandId).then((response)=>{
        if(response.image){
          deleteImage(response.image)
        }
        res.json({})
      })
    }catch(err){
      res.render("error", { message: err });
    }
  },
  deleteProduct:async(req,res)=>{
    const productId=req.params.id
    try{
      productModel.findByIdAndDelete(productId).then((response)=>{
        if(response.images.length>0){
          response.images.forEach((image)=>{
            deleteImage(image)
          })
        }
        res.json({})
      })
    }catch(err){
      res.render("error", { message: err });
    }
  },
  geteditProduct:async(req,res)=>{
    const productId = req.params.id
    try{
     const product = await productModel.findById(productId).lean()
     const categories = await categoryModel.find({}).lean()
     const brands = await brandModel.find({}).lean()
     res.render('admin/edit-product',{admin:true,product,categories,brands})
    }catch(err){
      res.render("error", { message: err });
    }
  },
  editProduct:async(req,res)=>{
    const productId = req.params.id
    const {name,category,brand,description,price} = req.body
    try{
      const product = await productModel.findById(productId)
      if(req.files.length>0){
        product.images = req.files.map(elem => elem.filename);
      }
      product.name = name
      product.category = category
      product.brand = brand
      product.description = description
      product.price = price
      await product.save()
      res.redirect('/admin/products')
    }catch(err){
      res.render("error", { message: err });
    }
  }
};
