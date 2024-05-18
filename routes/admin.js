var express = require('express');
const { getHome, getBrands, addBrand, addCategory, getCategories, getAddProducts, addProduct, getProducts, deleteCategory, deleteBrand, geteditProduct, editProduct, deleteProduct } = require('../controllers/adminController');
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

module.exports = router;
