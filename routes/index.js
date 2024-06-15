var express = require('express');
const { getHome, getAbout, getContact, getShop, getBlog, getCategories, getCategoryProducts, getBrandProducts, getProductDetails, getCart, addToCart, removeFromCart, changeQuantity, getCheckout, postCheckout, getOrderSuccess, getFranchise, submitContactForm, searchFunction, frequestQuestions, privacyPolicy, refundPolicy, shippingPolicy, termsOfService, checkOutPayment, JustPayResponse, getOrderFailed } = require('../controllers/userController');
const generateSignature = require('../helper/paymentHelper');
var router = express.Router();

/* GET home page. */
router.get('/',getHome);
router.get('/about',getAbout)
router.get('/shop',getShop)
router.get('/blogs',getBlog)
router.get('/cart',getCart)
router.post('/search',searchFunction)
// router.route('/checkout').get(getCheckout).post(postCheckout)
router.route('/checkout').get(getCheckout)
router.get('/order-success',getOrderSuccess)
router.get('/order-failed',getOrderFailed)
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

router.get('/frequent-questions',frequestQuestions)
router.get('/privacy-policy',privacyPolicy)
router.get('/return-refund',refundPolicy)
router.get('/shipping-policy',shippingPolicy)
router.get('/terms-service',termsOfService)

router.post('/checkout',checkOutPayment)
router.post('/handleJuspayResponse', JustPayResponse)




module.exports = router;
    