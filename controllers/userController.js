const { default: mongoose } = require("mongoose");
// const blogs = require("../constants");
const brandModel = require("../models/brandModel");
const categoryModel = require("../models/categoryModel");
const productModel = require("../models/productModel");
const orderModel = require("../models/orderModel");
const bannerModel = require("../models/bannerModel");
const blogModel = require("../models/blogModel");
const { default: axios } = require("axios");
const moment = require("moment-timezone");
const branchModel = require("../models/branchesModel");

function sendTelegramAlert(order) {
  console.log('entered telegram')
    const message = `<b>A bew order has been placed! 🎉</b>

  <b>Order Details:</b>
  - <b>Order ID:</b> NEO${order._id}
  - <b>Order Time:</b> ${order.time}
  - <b>Date:</b> ${order.date}
  - <b>Customer Phone:</b> ${order.phone}
  - <b>Total Amount:</b> ₹${order.total} /-
  - <b>Items Number:</b> ${order.lineItems.length}
  
  Please remember ⚠️ to check the <b>admin dashboard</b> for more details.`;
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api.telegram.org/bot6846417459:AAHoijJVqugNcfECQ9gPdNQ3bmaeM48CWXI/sendMessage?chat_id=-4268736732&text=${encodeURIComponent(message)}&parse_mode=HTML`
      )
      .then((response) => {
        console.log(response)
        resolve(response);
      })
      .catch((err) => {
        console.log(err)
        resolve(response);
      });
  });
}
module.exports = {
  getHome: async (req, res) => {
    try {
      const latestBanner = await bannerModel.findOne().sort({ createdAt: -1 }).lean();
      const banners =latestBanner.images
      const brands = await brandModel.find({})
      const categories = await categoryModel.find({}).lean();
      const blogs = await blogModel.find({}).lean();
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
        banners,
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
  getContact: async(req, res) => {
    try {
      const branches = await branchModel.find({}).lean()
      res.render("user/contact",{branches});
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getBlog: async(req, res) => {
    try {
      const blogs = await blogModel.find({}).lean();
      const updatesBlogs = blogs.map((order) => {
        const indianTime = moment(order.createdAt).tz("Asia/Kolkata");
        return {
          ...order,
          date: indianTime.format("DD-MM-YYYY"),
          time: indianTime.format("hh:mm:ss A"),
        };
      });
      console.log(updatesBlogs)
      res.render("user/blogs",{blogs:updatesBlogs});
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
      const product = await productModel.findById(productId).lean();
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
          ...product.toObject(),
          quantity: cartItem ? parseInt(cartItem.quantity, 10) : 0,
          subTotal: product.price * parseInt(cartItem.quantity, 10),
        };
      });
      let Total = 0;
      cartProducts.forEach((elem) => (Total += elem.price * elem.quantity));
      console.log(cartProducts);
      res.render("user/cart", { cartProducts, Total });
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

      // Save the session before redirecting
      req.session.save((err) => {
        if (err) {
          return res.render("error", { message: err });
        }
        res.redirect("/cart");
      });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  removeFromCart: async (req, res) => {
    try {
      const productId = req.params.id;
      const cart = (await req.session.cart) || [];
      const productIndex = cart.findIndex(
        (item) => item.productId === productId
      );
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
  },
  changeQuantity: async (req, res) => {
    const itemId = req.body.itemId;
    const newQuantity = parseInt(req.body.newQuantity);
    try {
      if (!req.session.cart) {
        req.session.cart = [];
        res.redirect("/cart");
      }
      req.session.cart = (await req.session.cart) || [];
      const existingProductIndex = req.session.cart.findIndex(
        (item) => item.productId === itemId
      );
      if (existingProductIndex >= 0) {
        if (newQuantity > 0) {
          req.session.cart[existingProductIndex].quantity = newQuantity;
        } else {
          req.session.cart.splice(existingProductIndex, 1);
          return res.json({ remove: true });
        }
      } else {
        console.warn(
          `Item with ID ${itemId} not found in cart, ignoring change.`
        );
      }
      const cart = req.session.cart;
      const productIds = cart.map(
        (item) => new mongoose.Types.ObjectId(item.productId)
      );
      const products = await productModel.find({ _id: { $in: productIds } });
      const cartProducts = products.map((product) => {
        const cartItem = cart.find((item) => {
          return item.productId.toString() === product._id.toString();
        });
        return {
          ...product.toObject(),
          quantity: cartItem ? parseInt(cartItem.quantity, 10) : 0,
          subTotal: product.price * parseInt(cartItem.quantity, 10),
        };
      });
      const product = cartProducts.find((item) => {
        return item._id.toString() === itemId;
      });
      let updatedPrice = product.subTotal;
      let Total = 0;
      cartProducts.forEach((elem) => (Total += elem.price * elem.quantity));

      res.json({ status: true, Total, cartProducts, updatedPrice });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getCheckout: async (req, res) => {
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
          ...product.toObject(),
          quantity: cartItem ? parseInt(cartItem.quantity, 10) : 0,
          subTotal: product.price * parseInt(cartItem.quantity, 10),
        };
      });
      let Total = 0;
      cartProducts.forEach((elem) => (Total += elem.price * elem.quantity));
      res.render("user/checkout", { products: cartProducts, total: Total });
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  postCheckout: async (req, res) => {
    try {
      const data = req.body;
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
          ...product.toObject(),
          quantity: cartItem ? parseInt(cartItem.quantity, 10) : 0,
          subTotal: product.price * parseInt(cartItem.quantity, 10),
        };
      });
      let total = 0;
      cartProducts.forEach((elem) => (total += elem.price * elem.quantity));
      const orderData = {
        ...data,
        lineItems: cartProducts,
        total,
      };
      const newOrder = new orderModel(orderData);
      await newOrder.save(); 
      const order = newOrder
        const indianTime = moment(order.createdAt).tz("Asia/Kolkata");

        order.date = indianTime.format("DD-MM-YYYY"),
          order.time = indianTime.format("hh:mm:ss A"),

      sendTelegramAlert(newOrder).then(()=>{
        res.redirect("/order-success");
      })
    } catch (err) {
      res.render("error", { message: err });
    }
  },
  getOrderSuccess:(req,res)=>{ 
    try{
      res.render("user/order-success");
    }catch(err){
      res.render("error", { message: err });
    }
  },
  getFranchise:(req,res)=>{
    try{
      res.render("user/franchise");
    }catch(err){
      res.render("error", { message: err });
    }
  },
  submitContactForm:(req,res)=>{
    try {
      const { name, email, phone, service, form } = req.body;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "joscoapp@gmail.com",
          pass: "vpgaoocnbgdeigsu",
        },
      });
      const mailOptions = {
        from: email,
        to: "joscofacility2016@gmail.com",
        subject:service,
        text: `Hi
        my name is ${name},My contact is ${phone}. I want to enquire about ${service}`,
      };
      transporter.sendMail(mailOptions,function(error,info){
        if(error){
          console.log(error)
        }else{
          console.log("Email send: "+info.response)
        }
        if(form==='home'){
          res.redirect('/')
          return
        }
        if(form==='service'){
          res.redirect('/services')
          return
        }
        if(form==='contact'){
          res.redirect('/contact')
          return
        }
      })
    }catch(err){
      res.render("error", { message: err });
    }
  }
};
