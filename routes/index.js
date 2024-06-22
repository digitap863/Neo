var express = require('express');
const { getHome, getAbout, getContact, getShop, getBlog, getCategories, getCategoryProducts, getBrandProducts, getProductDetails, getCart, addToCart, removeFromCart, changeQuantity, getCheckout, postCheckout, getOrderSuccess, getFranchise, submitContactForm, searchFunction, frequestQuestions, privacyPolicy, refundPolicy, shippingPolicy, termsOfService, checkOutPayment, JustPayResponse, getOrderFailed } = require('../controllers/userController');
const { default: axios } = require('axios');
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

router.post('/test',async(req,res)=>{
    const apiKey = '74F6392C77C46299CB1EC7702F1409'; // Replace with your actual API Key
    const merchantId = 'hdfcmaster'; // Replace with your actual Merchant ID
    const customerId = 'hdfc-testing-customer-one'; // Replace with your actual Customer ID
    const orderId = 'order_66727ffc36e78161fc4510cd'
  
    const url = `https://smartgatewayuat.hdfcbank.com/orders/${orderId}`; // Use the sandbox URL for testing
  
    const config = {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`, // Encode API Key
        'x-merchantid': merchantId,
        'x-customerid': customerId,
        'Content-Type': 'application/json'
      }
    };
  
    try {
      const response = await axios.get(url, config);
      console.log(response.data); // Log the response data
      return response.data;
    } catch (error) {
      console.error(`Error fetching order status: ${error}`);
      throw error;
    }


    const postData = {
        usernam
      };
      
    //   const config = {
    //     headers: {
    //       'Authorization': 'Basic base_64_encoded_api_key==74F6392C77C46299CB1EC7702F1409',
    //       'version': '2023-06-30',
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //       'x-merchantid': 'hdfcmaster',
    //       'x-customerid': 'hdfc-testing-customer-one'
    //     }
    //   };
      
    //   axios.post('https://smartgatewayuat.hdfcbank.com/orders/order_66727ffc36e78161fc4510cd', postData, config)
    //    .then((response) => {
    //       console.log(response.data);
    //     })
    //    .catch((error) => {
    //       console.error(error);
    //     });
})


module.exports = router;
     