var express = require('express');
const { getHome, getAbout, getContact, getShop, getBlog, getCategories, getCategoryProducts, getBrandProducts, getProductDetails, getCart, addToCart, removeFromCart, changeQuantity, getCheckout, postCheckout, getOrderSuccess, getFranchise, submitContactForm, searchFunction } = require('../controllers/userController');
var router = express.Router();

/* GET home page. */
router.get('/',getHome);
router.get('/about',getAbout)
router.get('/shop',getShop)
router.get('/blogs',getBlog)
router.get('/cart',getCart)
router.post('/search',searchFunction)
router.route('/checkout').get(getCheckout).post(postCheckout)
router.get('/order-success',getOrderSuccess)
router.post('/add-to-cart',addToCart)
router.post('/change-quantity',changeQuantity)
router.get('/remove-from-cart/:id',removeFromCart)
router.get('/product/:id',getProductDetails)
router.get('/categories',getCategories)
router.get('/category/:id',getCategoryProducts)
router.get('/brand/:id',getBrandProducts)
router.get('/contact',getContact)
router.get('/franchise',getFranchise)
router.post('/contact-form',submitContactForm)

module.exports = router;
    