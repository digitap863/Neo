var express = require('express');
const { getHome, getAbout, getContact, getShop, getBlog, getCategories, getCategoryProducts, getBrandProducts, getProductDetails, getCart, addToCart, removeFromCart } = require('../controllers/userController');
var router = express.Router();

/* GET home page. */
router.get('/',getHome);
router.get('/about',getAbout)
router.get('/shop',getShop)
router.get('/blogs',getBlog)
router.get('/cart',getCart)
router.post('/add-to-cart',addToCart)
router.get('/remove-from-cart/:id',removeFromCart)
router.get('/product/:id',getProductDetails)
router.get('/categories',getCategories)
router.get('/category/:id',getCategoryProducts)
router.get('/brand/:id',getBrandProducts)
router.get('/contact',getContact)

module.exports = router;
 