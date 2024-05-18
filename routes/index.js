var express = require('express');
const { getHome, getAbout, getContact, getShop, getBlog, getCategories, getCategoryProducts } = require('../controllers/userController');
var router = express.Router();

/* GET home page. */
router.get('/',getHome);
router.get('/about',getAbout)
router.get('/shop',getShop)
router.get('/blogs',getBlog)
router.get('/categories',getCategories)
router.get('/category/:id',getCategoryProducts)
router.get('/contact',getContact)

module.exports = router;
 