var express = require('express');
const { getHome, getBrands, addBrand, addCategory, getCategories, getAddProducts, addProduct, getProducts, deleteCategory, deleteBrand, geteditProduct, editProduct, deleteProduct, getOrders, getDoneOrders, updateOrder, getOfferBanner, addOfferBanner, getAddBlog, addBlog, getAddBranch, addBranch, deleteBranch, deleteBlog } = require('../controllers/adminController');
const {upload} = require('../middlewares/multer');
var router = express.Router();

/* GET home page. */
router.get('/',getHome);

router.post('/add-brand',upload.any('image'),addBrand)
router.get('/brands',getBrands)
router.delete('/delete-brand/:id',deleteBrand)

router.post('/add-category',upload.any('image'),addCategory)
router.get('/categories',getCategories)
router.delete('/delete-category/:id',deleteCategory)

router.get('/products',getProducts)
router.route('/add-product').get(getAddProducts).post(upload.any('image'),addProduct)
router.route('/edit-product/:id').get(geteditProduct).post(upload.any('image'),editProduct)
router.delete('/delete-product/:id',deleteProduct)


router.get('/orders',getOrders)
router.get('/done-orders',getDoneOrders)
router.put('/update-order/:id',updateOrder)

router.route('/offer-banner').get(getOfferBanner).post(upload.any('image'),addOfferBanner)

router.route('/add-blog').get(getAddBlog).post(upload.any('image'),addBlog)
router.route('/add-branch').get(getAddBranch).post(addBranch)
router.delete('/delete-branch/:id',deleteBranch)
router.delete('/delete-blog/:id',deleteBlog)
module.exports = router;
