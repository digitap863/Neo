var express = require('express');
const { getHome, getAbout, getContact, getShop, getBlog, getCategories, getCategoryProducts, getBrandProducts, getProductDetails, getCart, addToCart, removeFromCart, changeQuantity, getCheckout, postCheckout, getOrderSuccess, getFranchise, submitContactForm, searchFunction, frequestQuestions, privacyPolicy, refundPolicy, shippingPolicy, termsOfService } = require('../controllers/userController');
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

router.get('/frequent-questions',frequestQuestions)
router.get('/privacy-policy',privacyPolicy)
router.get('/return-refund',refundPolicy)
router.get('/shipping-policy',shippingPolicy)
router.get('/terms-service',termsOfService)

router.get('/checkout',(req,res)=>{
    const merchantTxnId = 'uniqueTransactionID123'; // Generate a unique transaction ID
    const signature = generateSignature(merchantTxnId, req);
    res.redirect(`https://www.paymentgateway.com/pay?txnid=${merchantTxnId}&amount=1.00&signature=${signature}`);
})

module.exports = router;
    